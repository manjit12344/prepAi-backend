import express from "express";
import passport from "passport";
import morgan from "morgan";
import  cors from "cors";
import cookieParser from "cookie-parser"
import config,{prisma} from "./config/config.js";

import my_auth from "./routes/01.oautj.route.js";
import pre from "./routes/02.userDb.route.js";
import history from "./routes/03.history.route.js";

const app = express();
app.set("trust proxy", 1);
app.use(cookieParser());
app.use(cors({
  origin: "https://prep-ai-1vpd.vercel.app", 
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"]
}));

// 2. EXPLICIT PREFLIGHT OPTIONS HANDLER (CRITICAL FOR VERCEL)
app.options("*", cors());
app.use(express.json());
app.use(passport.initialize());


app.use("/",my_auth);
app.use("/api/preInterview",pre);
app.use("/hist",history);

app.listen(3000,()=>console.log(`app is running on port `));

