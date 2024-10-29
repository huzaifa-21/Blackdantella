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

  const primaryHostname = "https://blackdantella.com";
  const wwwHostname = "https://www.blackdantella.com";

  const sitemapStream = new SitemapStream({
    hostname: primaryHostname, // Use primary hostname initially
  });

  // Write links for both hostnames
  links.forEach((link) => {
    // Add link for primary hostname
    sitemapStream.write({ ...link, loc: primaryHostname + link.url });
    // Add link for www hostname
    sitemapStream.write({ ...link, loc: wwwHostname + link.url });
  });

  sitemapStream.end();

  // Get the sitemap XML and trim any extra spaces or new lines
  const sitemapXML = await streamToPromise(sitemapStream);
  const trimmedSitemap = sitemapXML.toString().trim();

  // Save the sitemap in the correct directory
  const sitemapPath = path.join(process.cwd(), "/public", "sitemap.xml");
  fs.writeFileSync(sitemapPath, trimmedSitemap);
  console.log(`Sitemap generated at ${sitemapPath}`);
}

generateSitemap().catch((error) => {
  console.error("Error generating sitemap:", error);
});
