const MatchModel = require("../models/Match.model");

module.exports.saveMatch = async (req, res) => {
  try {
    const {
      user,
      playerColor,
      winner,
      resultReason,
      moveHistory,
      totalMoves,
      difficulty,
      finalFen
    } = req.body;

    const match = await MatchModel.create({
      user,
      playerColor,
      winner,
      resultReason,
      moveHistory,
      totalMoves,
      difficulty,
      finalFen
    });

    res.status(201).json({
      message: "Partida guardada correctamente",
      match
    });

  } catch (error) {
    console.error("🔥 ERROR GUARDANDO PARTIDA:", error);
    res.status(500).json({
      message: error.message
    });
  }
};

// - TODAS LAS PARTIDAS -
module.exports.getMatches = (req, res, next) => {
  MatchModel.find()
    .then((matches) => {
      res.json(matches);
    })
    .catch((err) => {
      res.json(err);
    });
};
