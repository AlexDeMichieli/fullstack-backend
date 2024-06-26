const { PrismaClient } = require("@alexdemichieli/fullstack-db-express-react");
const prisma = new PrismaClient();
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();

const insertUserIntoDB = async (username, hashedPassword) => {
  try {
    const user = await prisma.user.create({
      data: {
        username,
        hashedPassword,
      },
    });
    return user;
  } catch (error) {
    console.error(error);
  }
};

router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const doesUserExist = await prisma.user.findUnique({
            where: {
                username
            }
        })
        if (doesUserExist) {
            return res.status(400).json({error: "User already exists"})
        }
        const user = await insertUserIntoDB(username, hashedPassword);
        res.status(201).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

module.exports = router;
