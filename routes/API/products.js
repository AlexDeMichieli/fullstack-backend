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

router.get("/test", async (req, res) => {
  res.json({ message: "hello there" });
})


module.exports = router;
