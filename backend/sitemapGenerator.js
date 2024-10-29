import fs from "fs";
import path from "path";
import { SitemapStream, streamToPromise } from "sitemap";

async function generateSitemap() {
  const links = [
    { url: "/", changefreq: "daily", priority: 1.0 },
    { url: "/about", changefreq: "monthly", priority: 0.8 },
    { url: "/policy", changefreq: "monthly", priority: 0.8 },
    { url: "/terms", changefreq: "monthly", priority: 0.8 },
    { url: "/cart", changefreq: "monthly", priority: 0.8 },
    { url: "/account/login", changefreq: "monthly", priority: 0.8 },
    { url: "/account/register", changefreq: "monthly", priority: 0.8 },
    { url: "/profile", changefreq: "monthly", priority: 0.8 },
    { url: "/order", changefreq: "monthly", priority: 0.8 },
    { url: "/myorders", changefreq: "monthly", priority: 0.8 },
    // Add more URLs as needed
  ];

  const sitemaps = await Promise.all(
    ["https://blackdantella.com", "https://www.blackdantella.com"].map(
      async (hostname) => {
        const sitemapStream = new SitemapStream({ hostname });

        links.forEach((link) => sitemapStream.write(link));
        sitemapStream.end();

        return streamToPromise(sitemapStream);
      }
    )
  );

  // Combine both sitemaps into one XML structure
  const combinedSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map((sitemap) => sitemap.toString()).join("")}
</urlset>`;

  // Save the combined sitemap in the correct directory
  const sitemapPath = path.join(process.cwd(), "/public", "sitemap.xml");
  fs.writeFileSync(sitemapPath, combinedSitemap);
  console.log(`Sitemap generated at ${sitemapPath}`);
}

generateSitemap().catch((error) => {
  console.error("Error generating sitemap:", error);
});
