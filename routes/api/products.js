const express = require("express");
const router = express.Router();
const { Product } = require("../../models/product");
const validateProduct = require("../../middlewares/validateProduct");
const Joi = require("@hapi/joi");

// ... (previous imports and setups)

// GET all products with pagination
router.get("/", async (req, res) => {
  try {
    const page = Number(req.query.page || 1);
    const perPage = Number(req.query.perPage || 10);
    const skipRecords = perPage * (page - 1);
    const products = await Product.find().skip(skipRecords).limit(perPage);
    return res.send(products);
  } catch (err) {
    return res.status(500).send("Internal Server Error");
  }
});

// GET a single product by ID
router.get("/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findOne({ id: productId });
    if (!product)
      return res.status(404).send("Product with the given ID was not found");
    return res.send(product);
  } catch (err) {
    return res.status(400).send("Invalid ID");
  }
});

// Update a product by ID
router.put("/:id", validateProduct, async (req, res) => {
  try {
    const productId = req.params.id;
    const { productName, price, sizes, imageUrl, inStock } = req.body;

    const updatedProduct = {
      id: productId,
      productName: productName,
      price: price,
      sizes: sizes,
      imageUrl: imageUrl,
      inStock: inStock,
      // Add any other fields based on your schema
    };

    await Product.findOneAndUpdate({ id: productId }, updatedProduct, {
      new: true,
    });

    return res.send(updatedProduct);
  } catch (err) {
    return res.status(400).send("Invalid ID or Invalid Data");
  }
});

// Delete a product by ID
router.delete("/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const deletedProduct = await Product.findOneAndDelete({ id: productId });
    if (!deletedProduct)
      return res.status(404).send("Product with the given ID was not found");
    return res.send(deletedProduct);
  } catch (err) {
    return res.status(400).send("Invalid ID");
  }
});

// Insert a new product
router.post("/", validateProduct, async (req, res) => {
  try {
    const { productName, price, sizes, imageUrl, inStock } = req.body;
    const productId = generateUniqueId(); // You'll need to implement this function

    const newProduct = new Product({
      id: productId,
      productName: productName,
      price: price,
      sizes: sizes,
      imageUrl: imageUrl,
      inStock: inStock,
    });

    await newProduct.save();
    return res.send(newProduct);
  } catch (err) {
    return res.status(500).send("Internal Server Error");
  }
});

module.exports = router;