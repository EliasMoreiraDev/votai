import express from "express";
import dotenv from "dotenv";
import connectDatabase from "./src/config/config.js"
import cors from 'cors'
import enqueteRoutes from "./src/routes/enquete.js";
dotenv.config();
const app = express();

const whitelist = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
];

const corsOptions = {
  origin: function (origin, callback) {
    // Se a origem estiver na whitelist ou se for uma requisição sem origem (como Postman/Mobile)
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true); // Permite o acesso
    } else {
      callback(new Error('Não permitido pelo CORS')); // Bloqueia o acesso
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true // Permite o envio de cookies/headers de autenticação se necessário
};
//teste

app.use(cors(corsOptions));



app.use(express.json());
app.use("/enquete", enqueteRoutes);
app.use("/enquetes", enqueteRoutes);

await connectDatabase();

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});