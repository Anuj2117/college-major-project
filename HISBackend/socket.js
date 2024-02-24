const { Server } = require("socket.io");
const { sendMessage } = require("./controllers/user");

function startSocketServer(expressServer) {
  const io = new Server(expressServer, {
    cors: {
      origin: ["http://localhost:5173", "http://localhost:5174"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Client Connected");

    // LIstner for incomin messages
    socket.on("message-received", async (payload) => {
      const newMessage = await sendMessage(payload);
      // Emit the message to all the users listening on newMessage Channel
      io.emit(newMessage.messageId, newMessage);
    });

    socket.on("disconnect", () => {
      console.log("Client Disconnected");
    });
  });
}

module.exports = { startSocketServer };
