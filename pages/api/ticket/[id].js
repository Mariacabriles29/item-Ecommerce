import connectDB from "../../../utils/connectDB";
import Ticket from "../../../models/ticketModel";

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "PUT":
      await updateTicket(req, res);
      break;
  }
};

const updateTicket = async (req, res) => {
  try {
    const { id, status, adminComments } = req.body;

    // Validar si el id es proporcionado
    if (!id) {
      return res
        .status(400)
        .json({ error: "Se requiere un ID de ticket válido" });
    }

    // Validar si el ticket con el ID proporcionado existe
    const existingTicket = await Ticket.findById(id);
    if (!existingTicket) {
      return res.status(404).json({ error: "Ticket no encontrado" });
    }

    // Actualizar los campos del ticket
    existingTicket.status = status || existingTicket.status;
    existingTicket.adminComments =
      adminComments || existingTicket.adminComments;

    // Guardar la actualización en la base de datos
    const updatedTicket = await existingTicket.save();

    return res.status(200).json(updatedTicket);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};
