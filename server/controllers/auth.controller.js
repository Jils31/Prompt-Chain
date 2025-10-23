import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import genToken from "../src/config/token.js";

const prisma = new PrismaClient();

export async function signIn(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password both are required" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = await genToken(user.id);
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    console.log(token)

    return res.status(200).json({ message: "Sign in successful", user });
  } catch (error) {
    console.log("Error while signing in: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function signUp(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res
        .status(400)
        .json({ message: "Name, email and password are required" });

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    const token = await genToken(newUser.id);
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    console.log(token)

    return res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.log("Error while signing up:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
