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


router.patch("/:id/voto", async (req, res) => {
    try {
        const { id } = req.params;
        const { opcaoId } = req.body;

        if (!opcaoId) {
            return res.status(400).json({
                message: "Opção é obrigatória"
            });
        }

        const existe = await Enquete.findById(id);

        if (!existe) {
            return res.status(404).json({
                message: "Essa enquete não existe"
            });
        }

        if (new Date() > existe.dataLimite) {
            return res.status(400).json({
                message: "Esta votação já foi encerrada"
            });
        }

        const enquete = await Enquete.findOneAndUpdate(
            {
                _id: id,
                dataLimite: { $gt: new Date() },
                "opcoes._id": opcaoId
            },
            {
                $inc: {
                    "opcoes.$.votos": 1
                }
            },
            {
                new: true
            }
        );

        if (!enquete) {
            return res.status(404).json({
                message: "Opção não encontrada"
            });
        }

        return res.status(200).json(enquete);

    } catch (error) {
        return res.status(500).json({
            message: "Erro ao registrar voto",
            error: error.message
        });
    }
});

router.get("/", async (req, res) => {
    try {
        const enquetes = await Enquete.find();

        return res.status(200).json(enquetes);

    } catch (error) {
        return res.status(500).json({
            message: "Erro ao listar enquetes",
            error: error.message
        });
    }
});



export default router;