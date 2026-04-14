const mongoose = require("mongoose");

async function connectToMongo() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI no esta definida en el archivo .env");
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      family: 4,
    });
    console.log("Conectado a MongoDB Atlas");
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error.message);
    throw error;
  }
}

module.exports = { connectToMongo };
