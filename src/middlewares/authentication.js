import jwt from "jsonwebtoken";
import config, { prisma } from "../config/config.js"
import { newToken } from "../services/01auth.service.js"

export function verifyRef(req,res,next){
  const token = req.cookies.refreshToken;
    if (!token) {
    return res.status(401).json({
      message: "Refresh token missing",
    });
  }
  try{
    const decoded = jwt.verify(token, config.refresh_secret);
    next();
  }
 catch(err) {
   console.log(err.name);

    if (err.name === "TokenExpiredError") {
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");
      return res.status(401).json({
        message: "Refresh token expired",
      });
    }

    return res.status(403).json({
      message: "Invalid refresh token",
    });
  }
 }

export async function verifyAcc(req, res, next) {
  let token = req.cookies.accessToken;
  let refToken = req.cookies.refreshToken;
  if (!token && refToken) {
    token = await newToken(refToken);
    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1000*60*15
    })
  }
  if (!token && !refToken) {
    return res.sendStatus(401);
  }
  try {
    console.log("access:", req.cookies.accessToken);
    console.log("refresh:", req.cookies.refreshToken);

    const decoded = jwt.verify(token, config.access_secret);
    req.user = decoded;
    req.token = token;
    return next();
  } catch (err) {
    if (err.name == "TokenExpiredError") {
      console.log(err.name);
      const newAccessToken = await newToken(refToken);
      if (!newAccessToken || newAccessToken === -1 || newAccessToken === 0) return res.sendStatus(403);
      res.clearCookie("accessToken");
      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 1000*60*15
      })
      const decoded = jwt.verify(newAccessToken, config.access_secret);
      req.user = decoded;
      req.token = newAccessToken;
      req.acc = newAccessToken;
      req.ref = refToken;
      return next();
    }

    console.log(err.name, err)
    res.sendStatus(401)
  }
}


