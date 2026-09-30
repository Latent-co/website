// Stamps every local script and stylesheet the home pages load with a fingerprint of its
// contents (site.css?v=3f9a12c0). Cloudflare tells browsers to keep these files for hours,
// but never the HTML, so without this a returning visitor gets the new page with the OLD
// css/js, and anything new on the page silently does nothing. Runs before every build
// (package.json "prebuild"), so a changed file always gets a new URL.
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const dir = join(process.cwd(), "public", "home");
for (const page of ["index.html", "mobile.html"]) {
  const file = join(dir, page);
  const html = readFileSync(file, "utf8").replace(
    /((?:src|href)=")((?:vendor\/)?[\w.-]+\.(?:css|js))(?:\?v=[\w]+)?"/g,
    (_, attr, path) => {
      const v = createHash("sha1").update(readFileSync(join(dir, path))).digest("hex").slice(0, 10);
      return `${attr}${path}?v=${v}"`;
    },
  );
  writeFileSync(file, html);
}
console.log("home page assets versioned");
