const { Router } = require("express");
const router = Router();

const TeamController = require("../controllers/team");

router.post("/add", TeamController.addTeam);
router.get("/get-all", TeamController.getAllTeams);

module.exports = router;
