import express from "express";
import * as resum from "../controllers/04.resume.controller.js"
const router = express.Router();

router.post("/",resum.myResume);

export default router;