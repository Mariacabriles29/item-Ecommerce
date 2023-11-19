import React, { useState, useContext, useEffect } from "react";
import { DataContext } from "../store/GlobalState";

const TicketForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [userTickets, setUserTickets] = useState([]);
  const { state, dispatch } = useContext(DataContext);
  const { auth, tickets } = state;

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleSubmit = async () => {
    try {
      const newTicket = {
        name: title,
        description,
        email: auth.user.email,
        status: "en revision", // Agregar el estado inicial del ticket
        adminComments: "", // Agregar comentarios iniciales del admin (pueden ser vacíos)
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
      setShowModal(false); // Cerrar la modal después de agregar el ticket
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  // Cargar los tickets del usuario al cargar el componente
  useEffect(() => {
    const fetchUserTickets = async () => {
      try {
        if (auth.user && auth.user.email) {
          const response = await fetch(`/api/ticket?email=${auth.user.email}`);
          if (response.ok) {
            const tickets = await response.json();
            setUserTickets(tickets);
          }
        }
      } catch (error) {
        console.error("Error:", error.message);
      }
    };

    fetchUserTickets();
  }, [auth.user?.email, tickets]); // Verificando si auth.user existe y tiene email

  return (
    <div>
      <h2>Tickets del Usuario</h2>
      <button type="button" className="btn btn-primary" onClick={handleShow}>
        Agregar Nuevo Ticket
      </button>

      {/* Lista de tickets en forma de tabla */}
      <table className="table">
        <thead>
          <tr>
            <th>Título</th>
            <th>Descripción</th>
            <th>Estado</th>
            <th>Comentarios del Admin</th>
          </tr>
        </thead>
        <tbody>
          {userTickets.map((ticket) => (
            <tr key={ticket._id}>
              <td>{ticket.name}</td>
              <td>{ticket.description}</td>
              <td>{ticket.status}</td>
              <td>{ticket.adminComments}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal para agregar nuevo ticket */}
      {showModal && (
        <div className="modal-background">
          <div className="modal-content">
            <h3>Agregar Nuevo Ticket</h3>
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
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleClose}
              >
                Cerrar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketForm;
