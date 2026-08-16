import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register User
const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
    };

    res.status(201).json({
      message: "User registered successfully",
      user: userResponse,
    });
  } catch (error: unknown) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Server error",
    });
  }
};

// Login User
const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "7d",
      }
    );

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
    };

    res.json({
      message: "Login successful",
      token,
      user: userResponse,
    });
  } catch (error: unknown) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Server error",
    });
  }
};

export {
  registerUser,
  loginUser,
};