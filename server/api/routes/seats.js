const { Router } = require("express");
const router = Router();

const SeatController = require("../controllers/seats");

router.get("/match/:matchId", SeatController.getMatchSeats);
router.post("/reserve", SeatController.reserveSeat);
router.patch("/cancel/:seatId", SeatController.cancelReservation);

module.exports = router;
