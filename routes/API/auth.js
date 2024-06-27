const { PrismaClient } = require("@alexdemichieli/fullstack-db-express-react");
const prisma = new PrismaClient();
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();

const insertUserIntoDB = async (name, email, hashedPassword, role) => {
  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });
    return user;
  } catch (error) {
    console.error(error);
  }
};

router.post("/register", async (req, res) => {
  try {
    const { name, password, email, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const doesUserExist = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (doesUserExist) {
      return res.status(400).json({ error: "User already exists" });
    }
    const user = await insertUserIntoDB(name, email, hashedPassword, role);
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    const passworMatch = await bcrypt.compare(password, user.password);
    if (passworMatch) {
      const payload = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      };
      const accessToken = jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: "7d",
      });
      res.status(200).json({ accessToken, userId: user.id });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
