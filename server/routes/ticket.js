const { Router } = require("express");
const router = Router();

const TicketController = require("../controllers/ticket");

router.get("/:userId", TicketController.getTickets);
router.delete("/:ticketId", TicketController.deleteTicket);

module.exports = router;
