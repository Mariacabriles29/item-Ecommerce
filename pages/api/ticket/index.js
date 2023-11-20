import connectDB from "../../../utils/connectDB";
import Ticket from "../../../models/ticketModel";
import User from "../../../models/userModel";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "POST") {
    try {
      const { name, description, email, status, adminComments } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      const ticketNumber = generateTicketNumber();

      const newTicketData = {
        name,
        description,
        ticketNumber,
        userEmail: email,
        status,
        adminComments,
      };
      const newTicket = new Ticket(newTicketData);

      // Guardar el ticket en la base de datos
      const savedTicket = await newTicket.save();

      return res.status(201).json(savedTicket);
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  if (req.method === "GET") {
    try {
      const { email } = req.query;

      if (email) {
        // Si se proporciona un correo electrónico, filtrar por ese correo
        const tickets = await Ticket.find({ userEmail: email });
        return res.status(200).json(tickets);
      } else {
        // Si no se proporciona un correo electrónico, obtener todos los tickets
        const tickets = await Ticket.find();
        return res.status(200).json(tickets);
      }
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  return res.status(405).json({ error: "Método no permitido" });
}

// Función para generar el número de ticket (puedes personalizar esta lógica)
function generateTicketNumber() {
  // Lógica para generar el número de ticket
  return `TICKET-${Math.floor(1000 + Math.random() * 9000)}`;
}
