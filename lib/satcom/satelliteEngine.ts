import * as satellite from "satellite.js";
import { SatelliteMetadata } from "@/app/api/satcom/tle/route";

export interface GroundStation {
  id: "maitri" | "bharati";
  name: string;
  code: string;
  lat: number;
  lon: number;
  altKm: number;
  color: string;
}

export const GROUND_STATIONS: Record<string, GroundStation> = {
  maitri: {
    id: "maitri",
    name: "Maitri Research Station",
    code: "MAI",
    lat: -70.7667,
    lon: 11.7333,
    altKm: 0.117,
    color: "#FBBF24", // Amber
  },
  bharati: {
    id: "bharati",
    name: "Bharati Station (ISRO AGEOS)",
    code: "BHA",
    lat: -69.4072,
    lon: 76.1872,
    altKm: 0.035,
    color: "#38BDF8", // Cryo Blue
  },
};

export interface StationLookAngle {
  stationId: "maitri" | "bharati";
  azimuthDeg: number;
  elevationDeg: number;
  rangeKm: number;
  isInView: boolean;
  isHighGain: boolean; // > 10 degrees elevation
  nextAosMinutes: number | null;
  passDurationMinutes: number;
  maxElevationDeg: number;
}

export interface SatelliteLiveTelemetry {
  metadata: SatelliteMetadata;
  lat: number;
  lon: number;
  altKm: number;
  velocityKmS: number;
  globePosition: [number, number, number];
  subSatGlobePos: [number, number, number];
  orbitPath3D: [number, number, number][];
  lookAngles: Record<"maitri" | "bharati", StationLookAngle>;
}

// Convert Lat/Lon/Alt to 3D Cartesian coordinates on a globe of radius R
export function latLonToVector3(
  lat: number,
  lon: number,
  radius: number = 10
): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);

  return [x, y, z];
}

export function propagateSatellite(
  satMeta: SatelliteMetadata,
  date: Date = new Date(),
  globeRadius: number = 10
): SatelliteLiveTelemetry | null {
  try {
    const satrec = satellite.twoline2satrec(satMeta.line1, satMeta.line2);
    const positionAndVelocity = satellite.propagate(satrec, date);

    if (
      !positionAndVelocity ||
      typeof positionAndVelocity.position === "boolean" ||
      !positionAndVelocity.position
    ) {
      return null;
    }

    const posEci = positionAndVelocity.position as satellite.EciVec3<number>;
    const velEci = positionAndVelocity.velocity as satellite.EciVec3<number>;

    const gmst = satellite.gstime(date);
    const geodetic = satellite.eciToGeodetic(posEci, gmst);

    const lat = satellite.degreesLat(geodetic.latitude);
    const lon = satellite.degreesLong(geodetic.longitude);
    const altKm = geodetic.height;

    const velocityKmS = Math.sqrt(
      velEci.x * velEci.x + velEci.y * velEci.y + velEci.z * velEci.z
    );

    // Compute scaled orbital radius (Earth ~6371km mapped to globeRadius 10)
    // Scale altitude proportionally so LEO sits ~1.2 to 2.0 units above surface
    const scaledAlt = (altKm / 6371) * globeRadius;
    const satRadius = globeRadius + Math.min(scaledAlt, 6.0); // clamp for Geostationary visualization
    const globePosition = latLonToVector3(lat, lon, satRadius);
    const subSatGlobePos = latLonToVector3(lat, lon, globeRadius + 0.05);

    // Compute Look Angles from Maitri & Bharati
    const posEcf = satellite.eciToEcf(posEci, gmst);

    const computeForStation = (st: GroundStation): StationLookAngle => {
      const observerGd: satellite.GeodeticLocation = {
        latitude: st.lat * (Math.PI / 180),
        longitude: st.lon * (Math.PI / 180),
        height: st.altKm,
      };

      const lookAngles = satellite.ecfToLookAngles(observerGd, posEcf);
      const elevationDeg = lookAngles.elevation * (180 / Math.PI);
      const azimuthDeg = (lookAngles.azimuth * (180 / Math.PI) + 360) % 360;
      const rangeKm = lookAngles.rangeSat;
      const isInView = elevationDeg > 0;
      const isHighGain = elevationDeg > 10;

      // Predict upcoming pass if currently out of view
      let nextAosMinutes: number | null = null;
      let passDurationMinutes = 10;
      let maxElevationDeg = Math.max(0, Math.round(elevationDeg));

      if (isInView) {
        nextAosMinutes = 0;
        maxElevationDeg = Math.max(maxElevationDeg, 35);
      } else if (satMeta.orbitType === "Geostationary") {
        nextAosMinutes = null; // Stays fixed relative to ground
      } else {
        // Step forward in 2-minute increments up to 6 hours
        for (let m = 2; m <= 360; m += 2) {
          const futureDate = new Date(date.getTime() + m * 60 * 1000);
          const futurePv = satellite.propagate(satrec, futureDate);
          if (futurePv && typeof futurePv.position !== "boolean" && futurePv.position) {
            const fGmst = satellite.gstime(futureDate);
            const fEcf = satellite.eciToEcf(futurePv.position as satellite.EciVec3<number>, fGmst);
            const fAngles = satellite.ecfToLookAngles(observerGd, fEcf);
            const fElev = fAngles.elevation * (180 / Math.PI);
            if (fElev > 0) {
              nextAosMinutes = m;
              maxElevationDeg = Math.round(Math.max(fElev, 25));
              break;
            }
          }
        }
      }

      return {
        stationId: st.id,
        azimuthDeg: Math.round(azimuthDeg * 10) / 10,
        elevationDeg: Math.round(elevationDeg * 10) / 10,
        rangeKm: Math.round(rangeKm),
        isInView,
        isHighGain,
        nextAosMinutes,
        passDurationMinutes,
        maxElevationDeg,
      };
    };

    const lookAngles = {
      maitri: computeForStation(GROUND_STATIONS.maitri),
      bharati: computeForStation(GROUND_STATIONS.bharati),
    };

    // Compute Orbital Trajectory Spline (1 full 95-minute orbit period)
    const orbitPath3D: [number, number, number][] = [];
    const orbitPeriodMinutes = satMeta.orbitType === "Geostationary" ? 1440 : 98;
    const steps = 60;
    const stepDurationMs = (orbitPeriodMinutes * 60 * 1000) / steps;

    for (let i = 0; i < steps; i++) {
      const stepDate = new Date(date.getTime() + (i - steps / 4) * stepDurationMs);
      const stepPv = satellite.propagate(satrec, stepDate);
      if (stepPv && typeof stepPv.position !== "boolean" && stepPv.position) {
        const sGmst = satellite.gstime(stepDate);
        const sGeo = satellite.eciToGeodetic(stepPv.position as satellite.EciVec3<number>, sGmst);
        const sLat = satellite.degreesLat(sGeo.latitude);
        const sLon = satellite.degreesLong(sGeo.longitude);
        const sPos = latLonToVector3(sLat, sLon, satRadius);
        orbitPath3D.push(sPos);
      }
    }

    return {
      metadata: satMeta,
      lat: Math.round(lat * 10000) / 10000,
      lon: Math.round(lon * 10000) / 10000,
      altKm: Math.round(altKm),
      velocityKmS: Math.round(velocityKmS * 100) / 100,
      globePosition,
      subSatGlobePos,
      orbitPath3D,
      lookAngles,
    };
  } catch (err) {
    return null;
  }
}
