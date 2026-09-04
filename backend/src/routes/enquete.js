import { Router } from "express";
import Enquete from "../models/Enquete.js";
const router = Router();


router.post("/cadastro", async (req, res) => {
    const { titulo, descricao, opcoes } = req.body

    if (!titulo) {
        return res.status(400).json({
            message: "Titulo é obrigatório"
        })
    }

    if (opcoes.length < 2) {
        return res.status(400).json({
            message: "É obrigatório ter pelo menos duas opções"
        })
    }

    const enquete = await Enquete.create(req.body)
    return res.status(201).json(enquete);
})




