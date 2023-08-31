const io = require("socket.io-client");
const crypto = require("crypto");
const aes256 = require("aes256");
const givenData = require("./data.json");
const express = require("express");
const http = require("http");

const app = express();
//app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);

const socket = io.connect("http://localhost:3005"); // Assuming Listener Service is running on port 3005

function GetRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateMessage() {
  const min = 3;
  const max = 6;
  const randomTimes = GetRandomNumber(min, max);
  const dataArr = [];
  finalEncryptedMessage = ""
  for (let i = 0; i < randomTimes; i++) {
    data = GetData();
    data.secret_key = crypto
      .createHash("sha256")
      .update(JSON.stringify(data))
      .digest("hex");
    // dataArr.push(data);
    let dataToEncrypt = JSON.stringify(data);
    let passKey = "syook-bbk";
    let encryptedMessage = aes256.encrypt(passKey, dataToEncrypt);
    finalEncryptedMessage = finalEncryptedMessage+encryptedMessage + "|"
  }
  console.log("finalencrypted ",finalEncryptedMessage.slice(0, -1).split("|"))
  
  return finalEncryptedMessage.slice(0, -1);
}

function GetData() {
  let temp = new Object();
  maxm = givenData.names.length;
  temp.name = givenData.names[Math.floor(Math.random() * maxm)];
  temp.origin = givenData.cities[Math.floor(Math.random() * maxm)];
  temp.destination = givenData.cities[Math.floor(Math.random() * maxm)];
  return temp;
}

setInterval(() => {
  const message = generateMessage();
  socket.emit("message", message);
}, 10000);

setInterval(() => {
  socket.emit;
});

server.listen(3001, (err) => {
  if (!err) {
    console.log("Emitter Service Is Running On PORT 3001");
  } else {
    console.error(err);
  }
});
