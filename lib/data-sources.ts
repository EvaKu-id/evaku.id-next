export interface DataSourceInfo {
  name: string;
  usedFor: string;
  license: string;
  attribution: string;
  url: string;
}

export const DATA_SOURCES: readonly DataSourceInfo[] = [
  {
    name: "Copernicus Sentinel-1",
    usedFor: "Citra radar untuk peta genangan",
    license: "Copernicus open data",
    attribution: "Contains modified Copernicus Sentinel data",
    url: "https://dataspace.copernicus.eu",
  },
  {
    name: "OpenStreetMap",
    usedFor: "Jaringan jalan, jembatan, sungai, fasilitas",
    license: "ODbL 1.0",
    attribution: "© OpenStreetMap contributors",
    url: "https://www.openstreetmap.org/copyright",
  },
  {
    name: "Copernicus DEM GLO-30",
    usedFor: "Ketinggian medan dan HAND",
    license: "Copernicus DEM licence",
    attribution: "Copernicus DEM © DLR e.V., Airbus",
    url: "https://spacedata.copernicus.eu/collections/copernicus-digital-elevation-model",
  },
  {
    name: "WorldPop 2026",
    usedFor: "Jumlah warga, balita, dan lansia per desa",
    license: "CC BY 4.0",
    attribution: "WorldPop, University of Southampton",
    url: "https://www.worldpop.org",
  },
  {
    name: "BPS via OCHA HDX (COD-AB)",
    usedFor: "Batas provinsi, kabupaten, dan desa",
    license: "CC BY-IGO",
    attribution: "BPS, OCHA HDX",
    url: "https://data.humdata.org/dataset/cod-ab-idn",
  },
  {
    name: "GloFAS dan Open-Meteo",
    usedFor: "Prakiraan debit sungai, hujan, dan kelembapan tanah",
    license: "CC BY 4.0",
    attribution: "Copernicus Emergency Management Service, Open-Meteo",
    url: "https://open-meteo.com",
  },
  {
    name: "Overture Maps Places",
    usedFor: "Pelengkap lokasi fasilitas",
    license: "CDLA Permissive 2.0",
    attribution: "Overture Maps Foundation",
    url: "https://overturemaps.org",
  },
  {
    name: "BNPB, Data Bencana Indonesia 2024",
    usedFor: "Kejadian banjir per provinsi",
    license: "Data publik pemerintah",
    attribution: "Badan Nasional Penanggulangan Bencana",
    url: "https://bnpb.go.id",
  },
];
