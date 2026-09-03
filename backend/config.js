import mongoose from "mongoose";

const connectDatabase = async () => {
  try {
    const mongoUri = process.env.DB_URL;

    if (!mongoUri) {
      throw new Error("MONGO_URI não foi definida no arquivo .env");
    }

    await mongoose.connect(mongoUri);

    console.log(" MongoDB conectado com sucesso!");
  } catch (error) {
    console.error(" Erro ao conectar ao MongoDB:", error.message);
    process.exit(1);
  }
};

export default connectDatabase;
