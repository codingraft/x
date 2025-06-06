import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { NextFunction, Response } from "express";
import { ProtectedRouteRequest } from "../types/types.js";

export const protectedRoute = async (
  req: ProtectedRouteRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // console.log("req.cookies: ", req);
    const token = req.cookies?.jwt;
    // console.log("Token: ", token);
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized No Token Provided" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    if (!decoded || typeof decoded === "string") {
      return res.status(401).json({ message: "Unauthorized Invalid Token" });
    }
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Unauthorized User Not Found" });
    }
    req.user = user;

    next();
  } catch (error) {
    console.log("Protected route error:", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};
 