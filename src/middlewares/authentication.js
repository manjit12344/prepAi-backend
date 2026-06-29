import jwt from "jsonwebtoken";
import config, { prisma, myCookieRef, myCookieAcc } from "../config/config.js"
import { newToken } from "../services/01auth.service.js"

export async function verifyRef(req, res, next) {
  console.log("ALL COOKIES:", req.cookies);

  const token = req.cookies.refreshToken;
  
  if (!token) {
    return res.status(401).json({
      message: "Refresh token missing",
    });
  }
  const decoded = jwt.verify(token, config.refresh_secret);
  try {
    
    req.user = decoded; 
    req.refToken = token;
    next();
  }
  catch (err) {
    console.log(err.name);
      res.clearCookie("accessToken", myCookieAcc);
      res.clearCookie("refreshToken", myCookieRef);
    await prisma.user.update({
      where:{
        id:decoded.id,
      },
      data:{
        refreshToken:null
      }
    })
    return res.sendStatus(401);
  }
}

export async function verifyAcc(req, res, next) {
  let token = req.cookies.accessToken;
  let refToken = req.cookies.refreshToken;
  console.log("Access:", req.cookies.accessToken);
console.log("Refresh:", req.cookies.refreshToken);
  if (!token && refToken) {
    token = await newToken(refToken);
    if (!token || token === -1 || token === 0) {
      return res.sendStatus(403);
    }
    res.cookie("accessToken", token, myCookieAcc);
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
      console.log(err.name,err);
      const newAccessToken = await newToken(refToken);
      if (!newAccessToken || newAccessToken === -1 || newAccessToken === 0) return res.sendStatus(403);
      res.clearCookie("accessToken");
      res.cookie("accessToken", newAccessToken, myCookieAcc)
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