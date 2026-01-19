const express = require("express");
const router = express.Router();

// --- AGRUPAMOS TODAS LAS LLAMADAS DE LA APLICACION ---
const usersController = require("../controllers/user.controller");
const matchesController = require("../controllers/match.controller");

router.post("/register", usersController.registerUser);
router.get("/users", usersController.getUsers);
router.post("/login", usersController.loginUser);
router.get("/user/:id", usersController.getUserById);
router.delete("/user/:id", usersController.deleteUser);
router.patch("/user/:id", usersController.updateUser);

router.post("/save", matchesController.saveMatch);
router.get("/matches", matchesController.getMatches);
/*router.get("/match/:id", matchesController.getMatchById);
router.delete("/match/:id", matchesController.deleteMatch);*/

module.exports = router;
