const express = require("express");
const router = express.Router();

// --- AGRUPAMOS TODAS LAS LLAMADAS DE LA APLICACION ---
const usersController = require("../controllers/user.controller");

router.post("/register", usersController.registerUser);
router.get("/users", usersController.getUsers);
router.post("/login", usersController.loginUser);
router.get("/user/:id", usersController.getUserById);
router.delete("/user/:id", usersController.deleteUser);
router.patch("/user/:id", usersController.updateUser);

module.exports = router;
