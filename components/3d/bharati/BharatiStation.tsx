import React from "react";
import { BHARATI_ASSET_REGISTRY } from "@/lib/3d/assetRegistry";
import { BharatiAerodynamicMainBuilding } from "./AerodynamicMainBuilding";
import { BharatiCHPAndFuelZone } from "./CHPAndFuelZone";
import { BharatiSeaWaterSystemZone } from "./SeaWaterSystemZone";
import { BharatiSatcomArrayZone } from "./SatcomArrayZone";
import { BharatiHelipadAndLogisticsZone } from "./HelipadAndLogisticsZone";

interface BharatiStationProps {
  liveAssets?: Record<string, any>;
  selectedAssetId: string | null;
  hoveredAssetId: string | null;
  onSelectAsset: (assetId: string) => void;
  onHoverAsset: (assetId: string | null) => void;
}

export function BharatiStation({
  liveAssets = {},
  selectedAssetId,
  hoveredAssetId,
  onSelectAsset,
  onHoverAsset,
}: BharatiStationProps) {
  const mergedAssets = React.useMemo(() => {
    const res: Record<string, any> = {};
    for (const [id, staticAsset] of Object.entries(BHARATI_ASSET_REGISTRY)) {
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

  const mainBld = mergedAssets["BLD-BHA-MAIN"];

  return (
    <group name="bharati-digital-twin-station-assembly">
      {/* 1. Main Aerodynamic Faceted Superstructure */}
      {mainBld && (
        <BharatiAerodynamicMainBuilding
          asset={mainBld}
          isSelected={selectedAssetId === mainBld.assetId}
          isHovered={hoveredAssetId === mainBld.assetId}
          onSelect={onSelectAsset}
          onHover={onHoverAsset}
        />
      )}

      {/* 2. Combined Heat & Power Plant and Bulk Fuel */}
      <BharatiCHPAndFuelZone
        assets={mergedAssets}
        selectedAssetId={selectedAssetId}
        hoveredAssetId={hoveredAssetId}
        onSelect={onSelectAsset}
        onHover={onHoverAsset}
      />

      {/* 3. Coastal Seawater Reverse Osmosis System */}
      <BharatiSeaWaterSystemZone
        assets={mergedAssets}
        selectedAssetId={selectedAssetId}
        hoveredAssetId={hoveredAssetId}
        onSelect={onSelectAsset}
        onHover={onHoverAsset}
      />

      {/* 4. Satcom Earth Observation Array */}
      <BharatiSatcomArrayZone
        assets={mergedAssets}
        selectedAssetId={selectedAssetId}
        hoveredAssetId={hoveredAssetId}
        onSelect={onSelectAsset}
        onHover={onHoverAsset}
      />

      {/* 5. Aviation Helideck & Logistics */}
      <BharatiHelipadAndLogisticsZone
        assets={mergedAssets}
        selectedAssetId={selectedAssetId}
        hoveredAssetId={hoveredAssetId}
        onSelect={onSelectAsset}
        onHover={onHoverAsset}
      />
    </group>
  );
}
