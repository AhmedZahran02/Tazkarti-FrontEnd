const { Router } = require("express");
const router = Router();

const RefereeController = require("../controllers/referee");

router.post("/add", RefereeController.addReferee);
router.get("/get-main-referees", RefereeController.getMainReferees);
router.get("/get-linesmen", RefereeController.getLinesmen);

module.exports = router;
