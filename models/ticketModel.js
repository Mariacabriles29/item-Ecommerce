import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    ticketNumber: {
      type: String,
      required: true,
      unique: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["en revision", "finalizado"],
      default: "en revision",
    },
    adminComments: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

let Ticket = mongoose.models.Ticket || mongoose.model("Ticket", ticketSchema);
export default Ticket;
