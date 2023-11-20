import React, { useState, useContext, useEffect } from "react";
import { DataContext } from "../store/GlobalState";

const TicketForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("en revision");
  const [adminComments, setAdminComments] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [userTickets, setUserTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(false);
  const { state, dispatch } = useContext(DataContext);
  const { auth, tickets } = state;
  const [currentPage, setCurrentPage] = useState(1);
  const [ticketsPerPage] = useState(5); // Cantidad de tickets por página

  const handleShow = (ticket) => {
    setSelectedTicket(ticket);
    setTitle(ticket ? ticket.name : "");
    setDescription(ticket ? ticket.description : "");
    setStatus(ticket ? ticket.status : "en revision");
    setAdminComments(ticket ? ticket.adminComments : "");
  };

  const handleClose = () => {
    setSelectedTicket(null);
    setTitle("");
    setDescription("");
    setStatus("en revision");
    setAdminComments("");
    setShowModal(false);
  };

  const handleSubmit = async () => {
    try {
      const newTicket = {
        id: selectedTicket?._id,
        name: title,
        description,
        email: auth.user.email,
        status: auth.user.role === "admin" ? status : "en revision",
        adminComments: auth.user.role === "admin" ? adminComments : "",
      };
      console.log("selectTicket", selectedTicket);

      const url = selectedTicket
        ? `/api/ticket/${selectedTicket._id}`
        : "/api/ticket";

      const method = selectedTicket ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTicket),
      });
      console.log("response", response);

      if (!response.ok) {
        dispatch({
          type: "NOTIFY",
          payload: {
            error: `Error al ${selectedTicket ? "editar" : "crear"} el ticket`,
          },
        });
        throw new Error(
          `Error al ${selectedTicket ? "editar" : "crear"} el ticket`
        );
      }
      const updatedTicket = await response.json();

      if (selectedTicket) {
        dispatch({
          type: "NOTIFY",
          payload: { success: "Ticket editado con exito " },
        });
        dispatch({ type: "UPDATE_TICKET", payload: updatedTicket });
      } else {
        dispatch({
          type: "NOTIFY",
          payload: { success: "Ticket creado con exito " },
        });
        dispatch({ type: "ADD_TICKET", payload: updatedTicket });
      }

      setShowModal(false); // Cerrar la modal después de agregar/editar el ticket
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  // Cargar los tickets del usuario al cargar el componente
  useEffect(() => {
    const fetchUserTickets = async () => {
      try {
        if (auth.user && auth.user.email && auth.user?.role === "user") {
          const response = await fetch(`/api/ticket?email=${auth.user.email}`);
          if (response.ok) {
            const tickets = await response.json();
            setUserTickets(tickets);
          }
        } else if (auth.user?.role === "admin") {
          const response = await fetch(`/api/ticket`);
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
      <div className="d-flex justify-content-between align-items-center w-100 mb-3">
        <h2>Tickets del Usuario</h2>
        <button
          type="button"
          className="btn btn-primary"
          data-toggle="modal"
          data-target="#exampleModal1"
          onClick={() => handleShow(null)}
        >
          Agregar Nuevo Ticket
        </button>
      </div>

      {/* Lista de tickets en forma de tabla */}
      <table className="table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Estado</th>
            <th>Comentarios del Admin</th>
            {auth.user?.role === "admin" && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {userTickets.map((ticket) => (
            <tr key={ticket._id}>
              <td>{ticket.ticketNumber}</td>
              <td>{ticket.name}</td>
              <td>{ticket.description}</td>
              <td>
                {ticket.status === "finalizado" ? (
                  <span class="badge badge-success">{ticket.status}</span>
                ) : (
                  <span class="badge badge-pill badge-info">
                    {ticket.status}
                  </span>
                )}
              </td>
              <td>{ticket.adminComments}</td>
              {auth.user?.role === "admin" && (
                <td>
                  <button
                    className="btn btn-info mr-2"
                    onClick={() => handleShow(ticket)}
                    data-toggle="modal"
                    data-target="#exampleModal1"
                  >
                    Editar
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <ul className="pagination">
        {Array.from({
          length: Math.ceil(userTickets.length / ticketsPerPage),
        }).map((_, index) => (
          <li
            key={index + 1}
            className={index + 1 === currentPage ? "active" : ""}
          >
            <a onClick={() => setCurrentPage(index + 1)} href="#">
              {index + 1}
            </a>
          </li>
        ))}
      </ul>

      <div
        className="modal fade"
        id="exampleModal1"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel1"
        aria-hidden="true"
      >
        <form>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  {selectedTicket ? "Editar Ticket" : "Agregar Nuevo Ticket"}
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  onClick={handleClose}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                {/* Campos comunes */}
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

                {/* Campos específicos para administradores */}
                {auth.user?.role === "admin" && (
                  <div>
                    <div className="form-group">
                      <label htmlFor="status">Estado</label>
                      <select
                        className="form-control"
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                      >
                        <option value="en revision">En Revisión</option>
                        <option value="finalizado">Finalizado</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="adminComments">
                        Comentarios del Admin
                      </label>
                      <textarea
                        className="form-control"
                        rows="4"
                        id="adminComments"
                        placeholder="Ingresa comentarios para el admin"
                        value={adminComments}
                        onChange={(e) => setAdminComments(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  data-dismiss="modal"
                  onClick={handleSubmit}
                >
                  {selectedTicket ? "Editar Ticket" : "Agregar Ticket"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                  onClick={handleClose}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TicketForm;
