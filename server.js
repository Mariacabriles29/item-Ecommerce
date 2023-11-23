// const express = require("express");
// const http = require("http");
// const socketIO = require("socket.io");

// const app = express();
// const server = http.createServer(app);
// const io = socketIO(server, {
//   cors: {
//     origin: "http://localhost:3000", // URL de tu aplicación NEXT.js
//     methods: ["GET", "POST"],
//   },
// });

// io.on("connection", (socket) => {
//   console.log("Usuario conectado");

//   // Escucha eventos de mensajes
//   socket.on("chat message", (msg) => {
//     console.log("Mensaje recibido:", msg);
//     // Emite el mensaje a todos los clientes conectados
//     io.emit("chat message", msg);
//   });

//   // Maneja la desconexión de un usuario
//   socket.on("disconnect", () => {
//     console.log("Usuario desconectado");
//   });
// });

// const PORT = process.env.PORT || 3001;

// server.listen(PORT, () => {
//   console.log(`Servidor Socket.io en http://localhost:${PORT}`);
// });
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "http://localhost:3000", // URL de tu aplicación NEXT.js
    methods: ["GET", "POST"],
  },
});

// Objeto para rastrear usuarios conectados
const connectedUsers = {};

io.on("connection", (socket) => {
  console.log("Usuario conectado");

  // Evento para manejar la conexión de un usuario
  socket.on("user connected", (userId) => {
    console.log("Usuario conectado:", userId);

    // Guarda la información del usuario conectado
    connectedUsers[userId] = socket.id;

    // Emite la lista de usuarios conectados a todos los clientes
    io.emit("update users", Object.keys(connectedUsers));
  });

  // Escucha eventos de mensajes
  socket.on("chat message", (msg) => {
    console.log("Mensaje recibido:", msg);
    // Emite el mensaje a todos los clientes conectados
    io.emit("chat message", msg);
  });

  // Maneja la desconexión de un usuario
  socket.on("disconnect", () => {
    console.log("Usuario desconectado");

    // Encuentra y elimina al usuario desconectado
    const userId = Object.keys(connectedUsers).find(
      (key) => connectedUsers[key] === socket.id
    );
    if (userId) {
      delete connectedUsers[userId];

      // Emite la lista actualizada de usuarios conectados a todos los clientes
      io.emit("update users", Object.keys(connectedUsers));
    }
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Servidor Socket.io en http://localhost:${PORT}`);
});
