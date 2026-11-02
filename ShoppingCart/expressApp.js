import express from "express";

const app = express();
const PORT = 4000;

app.use(express.json());

let cart = [
  {
    id: 1,
    productName: "Wireless Mouse",
    price: 799,
    quantity: 2,
    category: "Electronics",
  },
  {
    id: 2,
    productName: "Notebook",
    price: 60,
    quantity: 5,
    category: "Stationery",
  },
  {
    id: 3,
    productName: "Water Bottle",
    price: 350,
    quantity: 1,
    category: "Home",
  },
];

const withTotal = (item) => ({
  ...item,
  totalPrice: item.price * item.quantity,
});

// GET all
app.get("/cart", (req, res) => res.json(cart.map(withTotal)));

// GET by id
app.get("/cart/:id", (req, res) => {
  const item = cart.find((p) => p.id === Number(req.params.id));
  if (!item) return res.status(404).json({ error: "Product not found" });
  res.json(withTotal(item));
});

// POST
app.post("/cart", (req, res) => {
  const { id, productName, price, quantity, category } = req.body;
  if (
    id == null ||
    !productName ||
    price == null ||
    quantity == null ||
    !category
  ) {
    return res
      .status(400)
      .json({
        error: "id, productName, price, quantity and category are required",
      });
  }
  if (cart.some((p) => p.id === Number(id))) {
    return res
      .status(400)
      .json({ error: "Product with this id already exists" });
  }
  const product = { id: Number(id), productName, price, quantity, category };
  cart.push(product);
  res.status(201).json({ message: "Product added successfully", product });
});

// PUT
app.put("/cart/:id", (req, res) => {
  const item = cart.find((p) => p.id === Number(req.params.id));
  if (!item) return res.status(404).json({ error: "Product not found" });
  const { productName, price, quantity, category } = req.body;
  if (!productName || price == null || quantity == null || !category) {
    return res
      .status(400)
      .json({
        error: "productName, price, quantity and category are required",
      });
  }
  Object.assign(item, { productName, price, quantity, category });
  res.json({
    message: "Product updated successfully",
    product: withTotal(item),
  });
});

// DELETE
app.delete("/cart/:id", (req, res) => {
  const index = cart.findIndex((p) => p.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Product not found" });
  const [removed] = cart.splice(index, 1);
  res.json({ message: "Product deleted successfully", product: removed });
});

// Unknown routes
app.use((req, res) => res.status(404).json({ error: "Route not found" }));

app.listen(PORT, () =>
  console.log(`Express Server running at http://localhost:${PORT}`),
);
