const { Router } = require("express");
const router = Router();

const MatchController = require("../controllers/match");
router.post("/create", MatchController.createMatch);
router.patch("/edit", MatchController.editMatch);
router.get("/", MatchController.getAllMatches); // New route for getting all matches
router.get("/:matchId", MatchController.matchDetails);
router.get("/get-seats/:matchId", MatchController.fetchSeatingLayout); // New route for getting all matches

module.exports = router;
