const UserModel = require("../models/User.model");
const bcrypt = require("bcryptjs");

// --- CONJUNTO DE OPERACIONES HECHAS CON LA BASE DE DATOS "users" ---
// ----- A --> routes.config.js
// -- REGISTRAR UN USUARIO --
module.exports.registerUser = async (req, res) => {
  try {
    const newUser = req.body;

    // - Comprueba si el email ya existe -
    const existingEmail = await UserModel.findOne({ email: newUser.email });
    if (existingEmail) {
      return res.status(422).json({
        errors: {
          email: { message: "El email ya está registrado" }
        }
      });
    }

    // - Comprueba si el nombre ya existe -
    const existingName = await UserModel.findOne({ name: newUser.name });
    if (existingName) {
      return res.status(422).json({
        errors: {
          name: { message: "El nombre de usuario ya está en uso" }
        }
      });
    }

    // - Si no hay conflictos, crea el usuario -
    const user = await UserModel.create(newUser);

    // - No devolver la contraseña -
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
    res.status(500).json({
      message: "Error registrando usuario",
      error: err.message
    });
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
