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
    // Add more URLs as needed
  ];

  const sitemapStream = new SitemapStream({
    hostname: "https://blackdantella.com",
  });

  links.forEach((link) => sitemapStream.write(link));
  sitemapStream.end();

  const sitemapXML = await streamToPromise(sitemapStream);

  // Save the sitemap in the correct directory
  const sitemapPath = path.join(process.cwd(), "/public", "sitemap.xml");
  fs.writeFileSync(sitemapPath, sitemapXML.toString());
  console.log(`Sitemap generated at ${sitemapPath}`);
}

generateSitemap().catch((error) => {
  console.error("Error generating sitemap:", error);
});
