import { Router } from "express";
import Enquete from "../model/enquete.js";

const router = Router();

router.post("/cadastro", async (req, res) => {
    const { titulo, descricao, opcoes, dataLimite } = req.body;

    if (!titulo) {
        return res.status(400).json({
            message: "Título é obrigatório"
        });
    }

    if (!opcoes || opcoes.length < 2) {
        return res.status(400).json({
            message: "É obrigatório ter pelo menos duas opções"
        });
    }

    if (!dataLimite) {
        return res.status(400).json({
            message: "Data limite é obrigatória"
        });
    }

    const data = new Date(dataLimite);

    if (isNaN(data.getTime())) {
        return res.status(400).json({
            message: "Data limite inválida"
        });
    }

    if (data <= new Date()) {
        return res.status(400).json({
            message: "A data limite deve ser futura"
        });
    }

    const enquete = await Enquete.create(req.body);

    return res.status(201).json(enquete);
});

export default router;