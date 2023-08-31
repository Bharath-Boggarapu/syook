const io = require("socket.io-client");
const express = require("express");
const http = require("http");
const cors = require("cors");
const {GenerateRandomData,GenerateEncryptedMessage} = require("./utils/GenerateMessages")

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);

const socket = io.connect("http://localhost:3005"); // Listener Service is running on port 3005

setInterval(() => {
  const message = GenerateEncryptedMessage();
  socket.emit("message", message);
}, 10000);

server.listen(3001, (err) => {
  if (!err) {
    console.log("Emitter Service Is Running On PORT 3001");
  } else {
    console.error(err);
  }
});
