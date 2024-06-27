const { PrismaClient } = require("@alexdemichieli/fullstack-db-express-react");
const prisma = new PrismaClient();
const express = require("express");
const router = express.Router();
const { authenticateAndAuthorize } = require("../../middleware/authMiddleware");

// Add a product to the cart
router.post(
  "/cart",
  authenticateAndAuthorize("USER", "ADMIN"),
  async (req, res) => {
    try {
      const { userId, productId, quantity } = req.body;

      // Check if the user and product exist
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!user || !product) {
        return res.status(404).json({ error: "User or Product not found" });
      }

      // Check if the product is already in the cart
      const existingCartItem = await prisma.cart.findFirst({
        where: {
          userId,
          productId,
        },
      });

      let cartItem;
      if (existingCartItem) {
        // Update the quantity if the product is already in the cart
        cartItem = await prisma.cart.update({
          where: {
            id: existingCartItem.id,
          },
          data: {
            quantity: existingCartItem.quantity + quantity,
          },
        });
      } else {
        // Add new cart item
        cartItem = await prisma.cart.create({
          data: {
            userId,
            productId,
            quantity,
          },
        });
      }

      res.status(201).json(cartItem);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Delete a product from the cart
router.delete(
  "/cart",
  authenticateAndAuthorize("USER", "ADMIN"),
  async (req, res) => {
    try {
      const { userId, productId } = req.body;

      // Check if the cart item exists
      const cartItem = await prisma.cart.findFirst({
        where: {
          userId,
          productId,
        },
      });

      if (!cartItem) {
        return res.status(404).json({ error: "Cart item not found" });
      }

      // Delete the cart item
      await prisma.cart.delete({
        where: {
          id: cartItem.id,
        },
      });

      res.status(200).json({ message: "Product removed from cart" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Fetch all products in the cart for a user
router.get(
  "/cart/:userId",
  authenticateAndAuthorize("USER", "ADMIN"),
  async (req, res) => {
    try {
      const { userId } = req.params;

      // Check if the user exists
      const user = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Fetch all cart items for the user
      const cartItems = await prisma.cart.findMany({
        where: { userId: parseInt(userId) },
        include: {
          product: true, // Include product details
        },
      });

      res.status(200).json(cartItems);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Increment the quantity of a product in the cart
router.patch(
  "/cart/increment",
  authenticateAndAuthorize("USER", "ADMIN"),
  async (req, res) => {
    try {
      const { userId, productId, incrementQuantity } = req.body;

      // Check if the cart item exists
      const cartItem = await prisma.cart.findFirst({
        where: {
          userId,
          productId,
        },
      });

      if (!cartItem) {
        return res.status(404).json({ error: "Cart item not found" });
      }

      // Update the cart item with the new quantity
      const updatedCartItem = await prisma.cart.update({
        where: {
          id: cartItem.id,
        },
        data: {
          quantity: cartItem.quantity + incrementQuantity,
        },
      });

      res.status(200).json(updatedCartItem);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Decrement the quantity of a product in the cart
router.patch(
  "/cart/decrement",
  authenticateAndAuthorize("USER", "ADMIN"),
  async (req, res) => {
    try {
      const { userId, productId, decrementQuantity } = req.body;

      // Check if the cart item exists
      const cartItem = await prisma.cart.findFirst({
        where: {
          userId,
          productId,
        },
      });

      if (!cartItem) {
        return res.status(404).json({ error: "Cart item not found" });
      }

      // Calculate the new quantity
      const newQuantity = cartItem.quantity - decrementQuantity;

      if (newQuantity <= 0) {
        // Remove the cart item if the new quantity is zero or less
        await prisma.cart.delete({
          where: {
            id: cartItem.id,
          },
        });
        return res.status(200).json({ message: "Product removed from cart" });
      }

      // Update the cart item with the new quantity
      const updatedCartItem = await prisma.cart.update({
        where: {
          id: cartItem.id,
        },
        data: {
          quantity: newQuantity,
        },
      });

      res.status(200).json(updatedCartItem);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

module.exports = router;
