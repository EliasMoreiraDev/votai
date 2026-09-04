import express from "express";
import dotenv from "dotenv";
import connectDatabase from "./src/config/config.js"
import cors from 'cors'
dotenv.config();

const corsOptions = {
  origin: function (origin, callback) {
    // Se a origem estiver na whitelist ou se for uma requisição sem origem (como Postman/Mobile)
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true); // Permite o acesso
    } else {
      callback(new Error('Não permitido pelo CORS')); // Bloqueia o acesso
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true // Permite o envio de cookies/headers de autenticação se necessário
};

// Aplica o middleware com a função de callback
app.use(cors(corsOptions));

const app = express();

app.use(express.json());

await connectDatabase();

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});

