const { PrismaClient } = require("@alexdemichieli/fullstack-db-express-react");
const prisma = new PrismaClient();
const express = require("express");
const router = express.Router();

router.get("/products", async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    console.log("products", products )

    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await prisma.product.findUnique({
            where: {
                id: parseInt(id)
            }
        })
        if (!product) {
            return res.status(404).json({error: "Product not found"})
        }
        res.status(200).json(product)
    } catch (error) {
        console.error(error)
        res.status(500).json({error: "Internal Server Error"})
    }
})

router.delete('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await prisma.product.delete({
            where: {
                id: parseInt(id)
            }
        })
        if (!product) {
            return res.status(404).json({error: "Product not found"})
        }
        res.status(200).json({"message": "Product deleted"})
    } catch (error) {
        console.error(error)
        res.status(500).json({error: "Internal Server Error"})
    }
})

router.patch('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, quantity } = req.body;
        const product = await prisma.product.update({
            where: {
                id: parseInt(id)
            },
            data: {
                name,
                description,
                price,
                quantity
            }
        })
        if (!product) {
            return res.status(404).json({error: "Product not found"})
        }
        res.status(201).json(product)
    } catch (error) {
        console.error(error)
        res.status(500).json({error: "Internal Server Error"})
    }
})

module.exports = router;
