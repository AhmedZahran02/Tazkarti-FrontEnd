const { Router } = require("express");
const router = Router();

const StadiumController = require("../controllers/stadium");

router.post("/add", StadiumController.addStadium);
router.get("/get-all", StadiumController.getAllStadiums);

module.exports = router;
