import React, { useState, useContext } from "react";
import { DataContext } from "../store/GlobalState";

const TicketForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { state, dispatch } = useContext(DataContext);
  const { auth } = state;

  const handleSubmit = async () => {
    try {
      const newTicket = {
        name: title,
        description,
        email: auth.user.email,
      };
      const response = await fetch("/api/ticket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTicket),
      });

      if (!response.ok) {
        dispatch({
          type: "NOTIFY",
          payload: { error: "Error al crear el ticket" },
        });
        throw new Error("Error al crear el ticket");
      }

      const createdTicket = await response.json();

      dispatch({ type: "ADD_TICKET", payload: createdTicket });

      setTitle("");
      setDescription("");
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  return (
    <div>
      <h2>Agregar Nuevo Ticket</h2>
      <form>
        <div className="form-group">
          <label htmlFor="title">Título</label>
          <input
            type="text"
            className="form-control"
            id="title"
            placeholder="Ingresa el título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Descripción</label>
          <textarea
            className="form-control"
            rows="4"
            id="description"
            placeholder="Ingresa la descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleSubmit}
        >
          Agregar Ticket
        </button>
      </form>
    </div>
  );
};

export default TicketForm;
