import type { MetadataRoute } from "next";
import { locales, routing } from "@/i18n/routing";
import { getCharacters, getEpisodes, getLocations } from "@/services/api";
import { siteUrl } from "@/utils/site";

export const revalidate = 86400;


const idsUpTo = (count: number) =>
  Array.from({ length: count }, (_, i) => i + 1);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [characters, episodes, locations] = await Promise.all([
    getCharacters({ page: 1 }),
    getEpisodes({ page: 1 }),
    getLocations({ page: 1 }),
  ]);

  const paths = [
    "",
    "/characters",
    "/episodes",
    "/locations",
    ...idsUpTo(characters.count).map((id) => `/character/${id}`),
    ...idsUpTo(episodes.count).map((id) => `/episode/${id}`),
    ...idsUpTo(locations.count).map((id) => `/location/${id}`),
  ];

  return paths.map((path) => ({
    url: `${siteUrl}/${routing.defaultLocale}${path}`,
    lastModified: new Date(),
    changeFrequency: path.includes("/") ? "monthly" : "weekly",
    priority: path === "" ? 1 : path.split("/").length === 2 ? 0.8 : 0.6,
    alternates: {
      languages: Object.fromEntries(
        locales.map((l) => [l, `${siteUrl}/${l}${path}`]),
      ),
    },
  }));
}
