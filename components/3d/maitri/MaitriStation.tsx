import React from "react";
import { MAITRI_ASSET_REGISTRY } from "@/lib/3d/assetRegistry";
import { MaitriMainBuilding } from "./MainBuilding";
import { MaitriPowerPlantZone } from "./PowerPlantZone";
import { MaitriFuelFarmZone } from "./FuelFarmZone";
import { MaitriLakePriyadarshiniZone } from "./LakePriyadarshiniZone";
import { MaitriCommsAndWeatherZone } from "./CommsAndWeatherZone";
import { MaitriLogisticsAndHelipadZone } from "./LogisticsAndHelipadZone";
import { MaitriScienceInstrumentsZone } from "./ScienceInstrumentsZone";
import { MaitriOutdoorHutsZone } from "./OutdoorHutsZone";
import { MaitriVehicleFleetZone } from "./VehicleFleetZone";
import { MaitriEnvironmentLandmarks } from "./EnvironmentLandmarks";

interface MaitriStationProps {
  liveAssets?: Record<string, any>;
  selectedAssetId: string | null;
  hoveredAssetId: string | null;
  onSelectAsset: (assetId: string) => void;
  onHoverAsset: (assetId: string | null) => void;
}

export function MaitriStation({
  liveAssets = {},
  selectedAssetId,
  hoveredAssetId,
  onSelectAsset,
  onHoverAsset,
}: MaitriStationProps) {
  // Merge static registry with live telemetry
  const mergedAssets = React.useMemo(() => {
    const res: Record<string, any> = {};
    for (const [id, staticAsset] of Object.entries(MAITRI_ASSET_REGISTRY)) {
      const live = liveAssets[id] || {};
      res[id] = {
        ...staticAsset,
        operationalStatus: live.operational_status || staticAsset.operationalStatus,
        healthScore: live.health_score !== undefined ? live.health_score : staticAsset.healthScore,
        failureProbability: live.failure_probability !== undefined ? live.failure_probability : staticAsset.failureProbability,
        rulHours: live.rul_hours !== undefined ? live.rul_hours : staticAsset.rulHours,
        readings: {
          ...staticAsset.readings,
          ...(live.sensor_readings ? Object.fromEntries(
            Object.entries(live.sensor_readings).map(([k, v]) => [k, { value: v, unit: "", label: k }])
          ) : {}),
        },
      };
    }
    return res;
  }, [liveAssets]);

  const mainBld = mergedAssets["BLD-MAI-MAIN"];

  return (
    <group name="maitri-digital-twin-full-assembly">
      {/* Environmental & Geographic Landmarks (Shivlinga Nunatak, Continental Ice Wall, Ice Caves) */}
      <MaitriEnvironmentLandmarks />

      {/* 1. Main Station Building (U-shaped prefabricated structure on steel stilts) */}
      {mainBld && (
        <MaitriMainBuilding
          asset={mainBld}
          isSelected={selectedAssetId === mainBld.assetId}
          isHovered={hoveredAssetId === mainBld.assetId}
          onSelect={onSelectAsset}
          onHover={onHoverAsset}
        />
      )}

      {/* 2. Power & Thermal Generation Zone */}
      <MaitriPowerPlantZone
        assets={mergedAssets}
        selectedAssetId={selectedAssetId}
        hoveredAssetId={hoveredAssetId}
        onSelect={onSelectAsset}
        onHover={onHoverAsset}
      />

      {/* 3. Fuel Storage Farm */}
      <MaitriFuelFarmZone
        assets={mergedAssets}
        selectedAssetId={selectedAssetId}
        hoveredAssetId={hoveredAssetId}
        onSelect={onSelectAsset}
        onHover={onHoverAsset}
      />

      {/* 4. Lake Priyadarshini Water System */}
      <MaitriLakePriyadarshiniZone
        assets={mergedAssets}
        selectedAssetId={selectedAssetId}
        hoveredAssetId={hoveredAssetId}
        onSelect={onSelectAsset}
        onHover={onHoverAsset}
      />

      {/* 5. Comms, Weather & Satellites */}
      <MaitriCommsAndWeatherZone
        assets={mergedAssets}
        selectedAssetId={selectedAssetId}
        hoveredAssetId={hoveredAssetId}
        onSelect={onSelectAsset}
        onHover={onHoverAsset}
      />

      {/* 6. Helipad & Logistics */}
      <MaitriLogisticsAndHelipadZone
        assets={mergedAssets}
        selectedAssetId={selectedAssetId}
        hoveredAssetId={hoveredAssetId}
        onSelect={onSelectAsset}
        onHover={onHoverAsset}
      />

      {/* 7. Comprehensive Scientific Instruments Suite (MARA, CADI, Riometer, GEC, AWS, Sonde, All-Sky) */}
      <MaitriScienceInstrumentsZone
        assets={mergedAssets}
        selectedAssetId={selectedAssetId}
        hoveredAssetId={hoveredAssetId}
        onSelect={onSelectAsset}
        onHover={onHoverAsset}
      />

      {/* 8. Outdoor Scientific Lab Huts (Nandadevi, Tiruvella, NPL, Dodda Betta, Annapoorna, Gauri Parbat, Girnar) */}
      <MaitriOutdoorHutsZone
        assets={mergedAssets}
        selectedAssetId={selectedAssetId}
        hoveredAssetId={hoveredAssetId}
        onSelect={onSelectAsset}
        onHover={onHoverAsset}
      />

      {/* 9. Heavy Machinery & Vehicle Transport Fleet (PistenBullies, Toyota Arctic Truck, Bulldozer, Cranes, Banjara Module) */}
      <MaitriVehicleFleetZone
        assets={mergedAssets}
        selectedAssetId={selectedAssetId}
        hoveredAssetId={hoveredAssetId}
        onSelect={onSelectAsset}
        onHover={onHoverAsset}
      />
    </group>
  );
}
