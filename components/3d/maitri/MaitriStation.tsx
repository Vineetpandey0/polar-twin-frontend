import React from "react";
import { MAITRI_ASSET_REGISTRY } from "@/lib/3d/assetRegistry";
import { MaitriMainBuilding } from "./MainBuilding";
import { MaitriPowerPlantZone } from "./PowerPlantZone";
import { MaitriFuelFarmZone } from "./FuelFarmZone";
import { MaitriLakePriyadarshiniZone } from "./LakePriyadarshiniZone";
import { MaitriCommsAndWeatherZone } from "./CommsAndWeatherZone";
import { MaitriLogisticsAndHelipadZone } from "./LogisticsAndHelipadZone";

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
    <group name="maitri-digital-twin-station-assembly">
      {/* 1. Main Station Building */}
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

      {/* 5. Comms, Weather & Science */}
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
    </group>
  );
}
