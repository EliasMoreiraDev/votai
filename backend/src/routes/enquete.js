import { Router } from "express";
import Enquete from "../model/enquete.js";

const router = Router();

router.post("/", async (req, res) => {
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

router.get("/", async (req, res) => {
    const enquetes = await Enquete.find();

    return res.status(200).json(enquetes);
});

router.get("/:id/comentarios", async (req, res) => {
    const { id } = req.params;

    const enquete = await Enquete.findById(id);
    if (!enquete) {
        return res.status(404).json({
            message: "Enquete não encontrada"
        });
    }

    return res.status(200).json(enquete.comentarios);
});

router.post("/:id/comentarios", async (req, res) => {
    const { id } = req.params;
    const { texto } = req.body;

    if (!texto || typeof texto !== "string" || !texto.trim()) {
        return res.status(400).json({
            message: "Comentário é obrigatório"
        });
    }

    const enquete = await Enquete.findById(id);
    if (!enquete) {
        return res.status(404).json({
            message: "Enquete não encontrada"
        });
    }

    enquete.comentarios.push({ texto: texto.trim() });
    await enquete.save();

    const comentario = enquete.comentarios[enquete.comentarios.length - 1];

    return res.status(201).json(comentario);
});

router.post("/:id/votar", async (req, res) => {
    const { id } = req.params;
    const { opcaoId } = req.body;

    if (!opcaoId) {
        return res.status(400).json({
            message: "ID da opção é obrigatório"
        });
    }
    
    const enquete = await Enquete.findById(id);
    if (!enquete) {
        return res.status(404).json({
            message: "Enquete não encontrada"
        });
    }

    const opcao = enquete.opcoes.find((o) => o.id === opcaoId);
    if (!opcao) {
        return res.status(404).json({
            message: "Opção não encontrada"
        });
    }

    opcao.votos++;

    await enquete.save();

    return res.status(200).json({
        message: "Voto registrado com sucesso"
    });

});
router.get("/:id/comentarios", async (req, res) => {
    const { id } = req.params;

    const enquete = await Enquete.findById(id);
    if (!enquete) {
        return res.status(404).json({
            message: "Enquete não encontrada"
        });
    }

    return res.status(200).json(enquete.comentarios);
});

router.post("/:id/comentarios", async (req, res) => {
    const { id } = req.params;
    const { texto } = req.body;

    if (!texto || typeof texto !== "string" || !texto.trim()) {
        return res.status(400).json({
            message: "Comentário é obrigatório"
        });
    }

    const enquete = await Enquete.findById(id);
    if (!enquete) {
        return res.status(404).json({
            message: "Enquete não encontrada"
        });
    }

    enquete.comentarios.push({ texto: texto.trim() });
    await enquete.save();

    const comentario = enquete.comentarios[enquete.comentarios.length - 1];

    return res.status(201).json(comentario);
});

export default router;
