import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

const base = "/portfolio/";

// GitHub Pages already redirects /portfolio to /portfolio/; do the same for dev and preview.
const redirectBaseWithoutSlash = {
  name: "redirect-base-without-slash",
  configureServer: addRedirect,
  configurePreviewServer: addRedirect,
};

function addRedirect(server) {
  server.middlewares.use((req, res, next) => {
    if (req.url === base.slice(0, -1)) {
      res.statusCode = 301;
      res.setHeader("Location", base);
      res.end();
      return;
    }
    next();
  });
}

export default defineConfig({
  plugins: [vue(), redirectBaseWithoutSlash],
  base,
});
