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

    // - Por si los datos son incorrectos
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    // - Si son correctos, POR SEGURIDAD, no devolvemos la contraseña en la respuesta
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
    };

    res.status(200).json({
      message: "Login exitoso",
      user: userResponse,
    });
  } catch (err) {
    res.status(500).json({ message: "Error en el login", error: err.message });
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
