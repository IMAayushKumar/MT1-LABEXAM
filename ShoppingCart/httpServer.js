import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 3000;

let cart = [{ id: 1, productName: "Wireless Mouse", price: 799, quantity: 2 }];

const sendJSON = (res, status, data) => {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
};

const server = http.createServer((req, res) => {
  const { method, url } = req;

  // GET /
  if (method === "GET" && url === "/") {
    res.writeHead(200, { "Content-Type": "text/html" });
    return res.end("<h1>Welcome to the Shopping Cart App</h1>");
  }

  // GET /cart
  if (method === "GET" && url === "/cart") {
    return sendJSON(res, 200, cart);
  }

  // GET /about
  if (method === "GET" && url === "/about") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    return res.end(
      "Shopping Cart Management App built with Node.js HTTP module.",
    );
  }

  // GET /home  (FS module)
  if (method === "GET" && url === "/home") {
    const filePath = path.join(__dirname, "public", "index.html");
    return fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        return res.end("Error reading HTML file");
      }
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    });
  }

  // POST /add-to-cart
  if (method === "POST" && url === "/add-to-cart") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      let product;
      try {
        product = JSON.parse(body);
      } catch {
        return sendJSON(res, 400, { error: "Invalid JSON" });
      }
      const { id, productName, price, quantity } = product;
      if (id == null || !productName || price == null || quantity == null) {
        return sendJSON(res, 400, {
          error: "id, productName, price and quantity are required",
        });
      }
      cart.push({ id, productName, price, quantity });
      sendJSON(res, 201, { message: "Product added to cart", product });
    });
    return;
  }

  // Anything else -> 404
  sendJSON(res, 404, { error: "Route not found" });
});

server.listen(PORT, () =>
  console.log(`HTTP Server running at http://localhost:${PORT}`),
);
