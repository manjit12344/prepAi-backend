import dotenv from "dotenv";
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

dotenv.config();

// prisma configration

export const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
})


//Environment variables configration

const config = {

    database_url: process.env.DATABASE_URL,
    gemini_api_key: process.env.GEMINI_API_KEY,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    redirect_url: process.env.REDIRECT_URL,
    access_secret:process.env.ACCESS_SECRET,
    refresh_secret:process.env.REFRESH_SECRET,
    port: process.env.PORT
}

export default config;
