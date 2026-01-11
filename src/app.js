require("dotenv").config();                                                                     
const express = require("express");          
const app = express();

      // --- CONFIGURACIÓN CORS ---
const cors = require("cors");
app.use(cors()); 
app.use(express.json()); // middleware para parsear JSON

      // --- CONEXION A LA BASE DE DATOS DE MongoDB:  ->  mongo.config.js  <---
require("./config/mongo.config");

      // --- IMPORTA EL ARCHIVO  ->  routes.config  <-  CON TODAS LAS CONSULTAS ---
const router = require("./config/routes.config");
app.use("/", router);

      // -- CONSULTA EL PORT (3000) DE .env, Y POR SI TARDA APARECE UN MENSAJE. --
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});