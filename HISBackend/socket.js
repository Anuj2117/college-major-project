const { Server } = require("socket.io");
const { sendMessage } = require("./controllers/user");
const aws = require("aws-sdk");
const dotenv = require("dotenv");
dotenv.config();

aws.config.update({
  secretAccessKey: process.env.AWS_ACCESS_SECRET,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  region: process.env.AWS_S3_REGION,
});

const myS3 = new aws.S3();

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

    socket.on("file-receiver", (payload) => {
      const { file, receiverId, senderId, fileName } = payload;

      // 1. Upload the file over s3
      const params = {
        Bucket: "newhisbucket2",
        Key: fileName,
        Body: file,
      };

      myS3.upload(params, async (err, data) => {
        if (err) {
          console.log(err);
        } else {
          data = {
            senderId,
            receiverId,
            message: data.Location,
          };
          const newMessage = await sendMessage(data, true);
          // Emit the message to all the users listening on newMessage Channel
          io.emit(newMessage.messageId, newMessage);
        }
      });
    });

    socket.on("disconnect", () => {
      console.log("Client Disconnected");
    });
  });
}

module.exports = { startSocketServer };
