export const cancelTicket = async (req, res) => {
  const { ticketId } = req.body;

  // DB logic here
  res.json({ message: "Ticket cancelled successfully" });
};

export const rescheduleTicket = async (req, res) => {
  const { ticketId, newSeatNumber, newJourneyDate } = req.body;

  res.json({ message: "Ticket rescheduled successfully" });
};

export const getMyTickets = async (req, res) => {
  res.json([]); // return tickets array
};
