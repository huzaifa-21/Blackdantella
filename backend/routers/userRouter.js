import express from "express";
import {
  register,
  deleteUser,
  getUsers,
  login,
  refresh,
  updateUser,
  getUser,
  googleLogin,
} from "../controllers/userController.js";
import verifyToken from "../middlewares/verifytoken.js";
import checkRole from "../middlewares/checkRole.js";

const userRouter = express.Router();

userRouter.get("/", verifyToken, checkRole("admin"), getUsers);
userRouter.delete("/:id", verifyToken, checkRole("admin"), deleteUser);
userRouter.post("/update", verifyToken, updateUser);
userRouter.get("/profile", verifyToken, getUser);
userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.post("/refresh", refresh); // Endpoint to refresh the token
userRouter.post("/google-login", googleLogin);

export default userRouter;
