import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwtgen.js";
import admin from "../utils/firebaseAdmin.js";

const generateTokens = (user) => {
  const accessToken = generateAccessToken({
    email: user.email,
    id: user._id,
    role: user.role,
  });
  const refreshToken = generateRefreshToken({
    email: user.email,
    id: user._id,
    role: user.role,
  });
  return { accessToken, refreshToken };
};

const register = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.send({ success: false, message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      address,
      role,
    });

    await newUser.save();

    res
      .status(201)
      .send({ success: true, message: "User created successfully" });
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.send({ success: false, message: "User not found" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.send({ success: false, message: "Invalid password" });
    }

    const { accessToken, refreshToken } = generateTokens(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    res.send({
      success: true,
      accessToken,
      user: { name: user.name, address: user.address, role: user.role },
    });
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
};

const googleLogin = async (req, res) => {
  const { tokenId } = req.body;
  try {
    // Verify the Google ID token
    const decodedToken = await admin.auth().verifyIdToken(tokenId);
    const { email, name, uid } = decodedToken;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(uid, salt);

    // Check if user already exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user if not exists
      user = new User({
        name,
        email,
        password: hashedPassword, // Set password to empty since it’s not used for Google login
        address: {},
        role: "user", // Default role
      });

      await user.save();
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    res.send({
      success: true,
      accessToken,
      user: { name: user.name, address: user.address },
    });
  } catch (error) {
    res.status(401).send({ success: false, message: "Invalid Google token" });
  }
};

const refresh = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res
      .status(401)
      .send({ success: false, message: "Refresh token required" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      console.log(decoded);
      return res
        .status(401)
        .send({ success: false, message: "Invalid refresh token" });
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });
    res.send({ success: true, accessToken });
  } catch (error) {
    res.status(401).send({ success: false, message: "Invalid refresh token" });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({}, { __v: false, password: false });

    res.status(200).send({ success: true, users });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }
    res.status(200).send({
      success: true,
      user: {
        name: user.name,
        address: user.address,
        cartdata: user.cartdata,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }

    await User.findByIdAndDelete(id);

    res
      .status(200)
      .send({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

const updateUser = async (req, res) => {
  const userId = req.user.id;
  const {
    firstName,
    lastName,
    address: home,
    apartment,
    city,
    country,
    zipCode,
    phone,
  } = req.body;
  const name = `${firstName} ${lastName}`;
  const address = { address: home, apartment, city, country, zipCode, phone };
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, address },
      {
        new: true, // Return the updated user
        runValidators: true, // Run model validation on update
      }
    );

    if (!updatedUser) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }

    res.status(200).send({ success: true, message: "Updated Successfully" });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};
export {
  register,
  login,
  refresh,
  getUsers,
  deleteUser,
  updateUser,
  getUser,
  googleLogin,
};
