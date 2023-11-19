import React, { useState, useContext } from "react";
import { DataContext } from "../store/GlobalState";

const TicketForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { state, dispatch } = useContext(DataContext);
  const { auth } = state;

  const handleSubmit = () => {
    const newTicket = {
      id: Date.now(),
      title,
      description,
    };

    dispatch({ type: "ADD_TICKET", payload: newTicket });

    setTitle("");
    setDescription("");
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
