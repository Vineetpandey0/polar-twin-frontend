import * as THREE from "three";

// Color Palettes
export const POLAR_PALETTE = {
  snowBase: "#e8eff7",
  snowShadow: "#b0c4de",
  rockBrown: "#2b2622",
  rockDark: "#1a1816",
  lakeIce: "#7eb0d5",
  seaIce: "#5c8a9e",

  // Maitri architectural colors (tan/beige/brown cladding, industrial steel)
  maitriTan: "#d4a373",
  maitriBrown: "#5c4033",
  maitriCladdingOrange: "#d96523",
  maitriCladdingYellow: "#e6a122",
  maitriSteelGray: "#4a5568",
  maitriRoofGray: "#2d3748",

  // Bharati architectural colors
  bharatiPanelSilver: "#cbd5e1",
  bharatiPanelWhite: "#f1f5f9",
  bharatiAccentBlue: "#0284c7",
  bharatiGlass: "#0f2b3e",
  bharatiStilts: "#334155",

  // Industrial assets
  generatorDark: "#1e293b",
  generatorExhaust: "#64748b",
  fuelTankSilver: "#94a3b8",
  fuelBunding: "#475569",
  pipeWaterBlue: "#38bdf8",
  pipeFuelAmber: "#f59e0b",
  pipeHeatRed: "#f43f5e",
  radomeWhite: "#f8fafc",

  // Digital Twin SCADA Status
  statusGreen: "#10b981",
  statusAmber: "#f59e0b",
  statusRed: "#ef4444",
  statusCyan: "#06b6d4",
  statusGray: "#64748b",
};

// Procedural Canvas Texture Generator for Wall Cladding & Panel Seams
function createCladdingCanvasTexture(colorHex: string, isRoof: boolean = false): THREE.CanvasTexture | null {
  if (typeof window === "undefined") return null;

  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Base background fill
  ctx.fillStyle = colorHex;
  ctx.fillRect(0, 0, 512, 512);

  if (isRoof) {
    // Corrugated Roof Ridges (Vertical dark & light stripes)
    for (let x = 0; x < 512; x += 16) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
      ctx.fillRect(x, 0, 6, 512);
      ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
      ctx.fillRect(x + 6, 0, 6, 512);
    }
  } else {
    // Prefab Composite Panel Grid (128x128 panels)
    ctx.strokeStyle = "rgba(0, 0, 0, 0.25)";
    ctx.lineWidth = 4;
    for (let x = 0; x <= 512; x += 128) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 512);
      ctx.stroke();
    }
    for (let y = 0; y <= 512; y += 128) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(512, y);
      ctx.stroke();
    }

    // Metallic Rivet Dots at panel edges
    ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
    for (let x = 8; x < 512; x += 128) {
      for (let y = 8; y < 512; y += 64) {
        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + 112, y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
}

const wallTanTexture = createCladdingCanvasTexture(POLAR_PALETTE.maitriTan, false);
const roofBrownTexture = createCladdingCanvasTexture(POLAR_PALETTE.maitriBrown, true);

// Reusable Three.js Materials
export const materials = {
  // Terrain
  snowTerrain: new THREE.MeshStandardMaterial({
    color: POLAR_PALETTE.snowBase,
    roughness: 0.85,
    metalness: 0.05,
    flatShading: true,
  }),

  rockMoraine: new THREE.MeshStandardMaterial({
    color: POLAR_PALETTE.rockBrown,
    roughness: 0.95,
    metalness: 0.1,
    flatShading: true,
  }),

  lakeIce: new THREE.MeshPhysicalMaterial({
    color: POLAR_PALETTE.lakeIce,
    roughness: 0.15,
    transmission: 0.6,
    thickness: 1.2,
    transparent: true,
    opacity: 0.88,
    reflectivity: 0.9,
  }),

  seaWater: new THREE.MeshPhysicalMaterial({
    color: POLAR_PALETTE.seaIce,
    roughness: 0.2,
    transmission: 0.7,
    thickness: 2.0,
    transparent: true,
    opacity: 0.85,
  }),

  // Structural Steel Stilts
  structuralStilts: new THREE.MeshStandardMaterial({
    color: POLAR_PALETTE.maitriSteelGray,
    roughness: 0.4,
    metalness: 0.8,
  }),

  maitriSteelGray: new THREE.MeshStandardMaterial({
    color: POLAR_PALETTE.maitriSteelGray,
    roughness: 0.5,
    metalness: 0.6,
  }),

  // Maitri Facade Materials with Procedural Panel Cladding
  maitriWallTan: new THREE.MeshStandardMaterial({
    color: POLAR_PALETTE.maitriTan,
    map: wallTanTexture || undefined,
    roughness: 0.5,
    metalness: 0.2,
  }),

  maitriWallOrange: new THREE.MeshStandardMaterial({
    color: POLAR_PALETTE.maitriCladdingOrange,
    map: wallTanTexture || undefined,
    roughness: 0.5,
    metalness: 0.2,
  }),

  maitriWallYellow: new THREE.MeshStandardMaterial({
    color: POLAR_PALETTE.maitriCladdingYellow,
    map: wallTanTexture || undefined,
    roughness: 0.5,
    metalness: 0.2,
  }),

  maitriRoof: new THREE.MeshStandardMaterial({
    color: POLAR_PALETTE.maitriBrown,
    map: roofBrownTexture || undefined,
    roughness: 0.6,
    metalness: 0.3,
  }),

  // Bharati Facade Materials
  bharatiPanelSilver: new THREE.MeshStandardMaterial({
    color: POLAR_PALETTE.bharatiPanelSilver,
    roughness: 0.3,
    metalness: 0.7,
  }),

  bharatiGlass: new THREE.MeshPhysicalMaterial({
    color: POLAR_PALETTE.bharatiGlass,
    roughness: 0.1,
    transmission: 0.8,
    thickness: 0.8,
    transparent: true,
    opacity: 0.75,
  }),

  // Equipment & Tanks
  fuelTank: new THREE.MeshStandardMaterial({
    color: POLAR_PALETTE.fuelTankSilver,
    roughness: 0.35,
    metalness: 0.75,
  }),

  generatorBody: new THREE.MeshStandardMaterial({
    color: POLAR_PALETTE.generatorDark,
    roughness: 0.45,
    metalness: 0.6,
  }),

  generatorExhaust: new THREE.MeshStandardMaterial({
    color: POLAR_PALETTE.generatorExhaust,
    roughness: 0.5,
    metalness: 0.7,
  }),

  radomeCover: new THREE.MeshStandardMaterial({
    color: POLAR_PALETTE.radomeWhite,
    roughness: 0.2,
    metalness: 0.1,
  }),

  // Status Materials
  statusRunning: new THREE.MeshBasicMaterial({ color: POLAR_PALETTE.statusGreen }),
  statusWarning: new THREE.MeshBasicMaterial({ color: POLAR_PALETTE.statusAmber }),
  statusCritical: new THREE.MeshBasicMaterial({ color: POLAR_PALETTE.statusRed }),
  statusStandby: new THREE.MeshBasicMaterial({ color: POLAR_PALETTE.statusCyan }),

  // Helipad Marking Material
  helipadMarking: new THREE.MeshBasicMaterial({
    color: "#facc15",
    transparent: true,
    opacity: 0.9,
  }),
};

export function getStatusColor(status: string, healthScore: number = 1.0): string {
  if (status === "CRITICAL" || healthScore < 0.6) return POLAR_PALETTE.statusRed;
  if (status === "WARNING" || healthScore < 0.8) return POLAR_PALETTE.statusAmber;
  if (status === "STANDBY") return POLAR_PALETTE.statusCyan;
  if (status === "STOPPED") return POLAR_PALETTE.statusGray;
  return POLAR_PALETTE.statusGreen;
}
