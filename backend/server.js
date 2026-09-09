import express from "express";
import dotenv from "dotenv";
import connectDatabase from "./src/config/config.js";
import cors from "cors";
import enqueteRoutes from "./src/routes/enquete.js";

dotenv.config();

const app = express();

// Lê a string do .env, divide por vírgula e remove espaços extras
const envOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",").map((origin) => origin.trim())
  : [];

// Mantém valores padrão como fallback caso a variável não seja declarada
const defaultOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001"
];

const whitelist = envOrigins.length > 0 ? envOrigins : defaultOrigins;

const corsOptions = {
  origin: function (origin, callback) {
    // Permite se a origem estiver na whitelist ou se não houver origin (Postman, apps mobile, curl)
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Não permitido pelo CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/enquete", enqueteRoutes);

await connectDatabase();

app.listen(7340, () => {
  console.log("Servidor rodando na porta 7340");
});