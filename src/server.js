import express from "express";
import passport from "passport";
import morgan from "morgan";
import  cors from "cors";
import cookieParser from "cookie-parser"
import config,{prisma} from "./config/config.js";

import my_auth from "./routes/01.oautj.route.js";
import pre from "./routes/02.userDb.route.js";
import history from "./routes/03.history.route.js";
import resume from "./routes/04.resume.route.js";

const app = express();
app.use(cookieParser());
app.set("trust proxy", 1);

app.use(cors({
    origin: "https://prep-ai-1vpd.vercel.app", // exact frontend URL, no trailing slash
    credentials: true,  // THIS is critical — without this cookies never send
    methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use(express.json());
app.use(passport.initialize());


app.use("/",my_auth);
app.use("/api/preInterview",pre);
app.use("/hist",history);
app.use("/resume",resume);

app.listen(config.port,()=>console.log(`app is running on port ${config.port} `));

