import { NextResponse } from "next/server";

export async function GET() {
  // NASA GIBS daily MODIS / VIIRS composite is published with ~12-18h latency
  const dateObj = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const passDate = dateObj.toISOString().split("T")[0];

  return NextResponse.json({
    product: "MODIS_Terra_CorrectedReflectance_TrueColor",
    name: "NASA GIBS Corrected Surface Reflectance",
    passTimestamp: `${passDate} 18:30 UTC`,
    latencyHours: 18,
    freshnessLabel: `NASA GIBS MODIS TERRA // PASS: ${passDate} 18:30 UTC // LATENCY: 18H`,
    projection: "EPSG:4326 (WGS 84 Geographic Lat/Lon)",
    tileUrlTemplate: `https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/${passDate}/250m/{z}/{y}/{x}.jpg`,
    attribution: "NASA Earth Science Data and Information System (ESDIS) / GIBS",
    fallbackTexture: "/textures/earth_dark.jpg",
  });
}
