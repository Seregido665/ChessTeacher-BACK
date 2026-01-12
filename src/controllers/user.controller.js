const UserModel = require("../models/User.model");
const bcrypt = require("bcryptjs");

// --- CONJUNTO DE OPERACIONES HECHAS CON LA BASE DE DATOS "users" ---
// ----- A --> routes.config.js
// -- REGISTRAR UN USUARIO --
module.exports.registerUser = async (req, res) => {
  try {
    const newUser = req.body;

    // - Comprueba si el usuario existe -
    const existingUser = await UserModel.findOne({ email: newUser.email });
    if (existingUser) {
      return res.status(422).json({
        errors: { email: { message: "El email ya está registrado" }
        }
      });
    }

    // - Si no hay, crea el nuevo usuario -
    const user = await UserModel.create(newUser);

    // - POR SEGURIDAD, no devolvemos la contraseña en la respuesta
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
    };

    res.status(201).json({
      message: "Usuario creado correctamente",
      user: userResponse,
    });
  } catch (err) {
    res
      res.status(500).json({ message: "Error registrando usuario", error: err.message });
  }
};

// -- INICIAR SESION --
module.exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    
    // 1. Comprobar si el usuario existe
    if (!user) {
      return res.status(404).json({ message: "El usuario no existe" });
    }

    // 2. Comprobar si la contraseña es correcta
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
    };

    return res.status(200).json({
      message: "Login exitoso",
      user: userResponse,
    });
  } catch (err) {
    console.error("Error en login:", err);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

// - MUESTRA TODOS LOS USUARIOS -
module.exports.getUsers = (req, res, next) => {
  UserModel.find()
    .then((users) => {
      res.json(users);
    })
    .catch((err) => {
      res.json(err);
    });
};

// - BUSCA UN USUARIO POR id -
module.exports.getUserById = (req, res, next) => {
  const id = req.params.id;

  UserModel.findById(id)
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      res.json(err);
    });
};

// -- BORRAR UN USUARIO :React ---
module.exports.deleteUser = (req, res, next) => {
  const id = req.params.id;

  UserModel.findByIdAndDelete(id)
    .then(() => {
      res.json({ message: "Usuario eliminado correctamente" });
    })
    .catch((err) => {
      res.json(err);
    });
};

// -- ACTUALIZAR UN USUARIO :React --
module.exports.updateUser = (req, res, next) => {
  const id = req.params.id;
  const updates = req.body;

  UserModel.findByIdAndUpdate(id, updates, { new: true })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      res.json(err);
    });
};
