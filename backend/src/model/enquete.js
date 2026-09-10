import mongoose from "mongoose";

const comentarioSchema = new mongoose.Schema(
    {
        autor: {
            type: String,
            trim: true
        },
        texto: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

const enqueteSchema = new mongoose.Schema(
    {
        titulo: {
            type: String,
            required: true,
            trim: true,
        },

        descricao: {
            type: String,
            trim: true,
        },

        dataLimite: {
            type: Date,
            required: true,
            
        },

        opcoes: [{
            texto: {type: String,  required: true},
            votos: {type: Number, default: 0}
        }],

        comentarios: [comentarioSchema],
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Enquete", enqueteSchema);