import { apiSource } from "@/lib/data/api-source";
import { bundleSource } from "@/lib/data/bundle-source";
import type { DataSource } from "@/lib/data/source";

export const dataSource: DataSource =
  process.env.NEXT_PUBLIC_DATA_SOURCE === "api" ? apiSource : bundleSource;

export { DataError } from "@/lib/data/fetch-json";
