import express from "express";
import dotenv from "dotenv";
import connectDatabase from "./src/config.js"

dotenv.config();

const app = express();

app.use(express.json());

await connectDatabase();

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});

