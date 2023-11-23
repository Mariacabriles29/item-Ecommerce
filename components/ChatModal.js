// components/ChatModal.js
import React, { useState, useEffect, useContext } from "react";
import io from "socket.io-client";
import { DataContext } from "../store/GlobalState";

let socket = io("http://localhost:3001");

const ChatModal = ({ name = "", show, handleClose }) => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const { state, dispatch } = useContext(DataContext);
  const { auth } = state;

  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const handleSendMessage = () => {
    if (messageInput.trim() !== "") {
      const currentTime = getCurrentTime();
      console.log("auth ", auth);
      const newMessage = {
        text: messageInput,
        time: currentTime,
        userName: auth.user?.name,
        userImage: auth.user?.avatar,
      };
      socket.emit("chat message", newMessage);
      setMessageInput("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    socket.on("chat message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div
      className="modal fade"
      id="exampleModal3"
      tabIndex="-1"
      aria-labelledby="exampleModalLabe3"
      aria-hidden="true"
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Chat en Vivo con {name}</h5>
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
            <div className="chat-container">
              <ul className="list-group">
                {messages.map((msg, index) => (
                  <li key={index} className="list-group-item">
                    <div className="d-flex align-items-start">
                      <img
                        src={msg.userImage}
                        className="rounded-circle"
                        style={{
                          width: "30px",
                          height: "30px",
                          marginRight: "10px",
                        }}
                        onError={(e) => {
                          e.target.src =
                            "https://res.cloudinary.com/ddtwmoh7j/image/upload/v1700484068/avatar_user_edwqfe.png";
                        }}
                      />
                      <div className="d-flex flex-column w-100">
                        <div className="d-flex justify-content-between ">
                          <small className="text-muted mr-2">
                            {msg.userName}
                          </small>
                          <small className="text-muted">{msg.time}</small>
                        </div>
                        <div className="d-flex">{msg.text}</div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="input-group mt-3">
              <input
                type="text"
                className="form-control"
                placeholder="Escribe tu mensaje..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <div className="input-group-append">
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={handleSendMessage}
                >
                  Enviar
                </button>
              </div>
            </div>
          </div>
          <div className="modal-footer">
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
    </div>
  );
};

export default ChatModal;
