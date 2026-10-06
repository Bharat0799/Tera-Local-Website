const http = require("http");
const fs = require("fs");
const path = require("path");

const host = "127.0.0.1";
const port = 4173;
const basePath = "/Tera-Local-Website";
const distDir = path.join(__dirname, "dist");

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8",
  ".webp": "image/webp",
};

const sendFile = (res, filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  const type = mimeTypes[ext] || "application/octet-stream";
  res.writeHead(200, { "Content-Type": type });
  fs.createReadStream(filePath).pipe(res);
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${host}:${port}`);
  let pathname = decodeURIComponent(url.pathname);

  if (pathname === "/") {
    res.writeHead(302, { Location: `${basePath}/` });
    res.end();
    return;
  }

  if (!pathname.startsWith(basePath)) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
    return;
  }

  let relativePath = pathname.slice(basePath.length);
  if (relativePath === "" || relativePath === "/") {
    relativePath = "/index.html";
  }

  const safePath = path.normalize(relativePath).replace(/^(\.\.[/\\])+/, "");
  let filePath = path.join(distDir, safePath);

  if (!filePath.startsWith(distDir)) {
    res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Forbidden");
    return;
  }

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(distDir, "index.html");
  }

  if (!fs.existsSync(filePath)) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
    return;
  }

  sendFile(res, filePath);
});

server.listen(port, host, () => {
  console.log(`Preview server running at http://${host}:${port}${basePath}/`);
});
