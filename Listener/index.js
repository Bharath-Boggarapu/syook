const io = require("socket.io")();
const crypto = require("crypto");
const aes256 = require("aes256");
const cors = require("cors");
const http = require("http");
const {DataModel} = require('./models/models')
const MongoDbConnection= require('./dbutils/dbconnect')

const express = require('express')
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

MongoDbConnection();

io.on("connection", (socket) => {
  console.log("emitter connected");

  socket.on("message", (encryptedMessage) => {
    const passKey = "syook-bbk";
    const parsedObjects = encryptedMessage.split("|");
    const ArrData = [];
    try {
      for (let i = 0; i < parsedObjects.length; i++) {
        const data = JSON.parse(aes256.decrypt(passKey, parsedObjects[i]));
        const computedSecretKey = crypto
          .createHash("sha256")
          .update(
            JSON.stringify({
              name: data.name,
              origin: data.origin,
              destination: data.destination,
            })
          )
          .digest("hex");

        if (computedSecretKey === data.secret_key) {
          const newData = new DataModel({
            timestamp: new Date(),
            data:[],
            particularData:{
                name: data.name,
                origin: data.origin,
                destination: data.destination,
            }
          });
          ArrData.push(newData);
        } else {
          console.error("Unable to match the integrity");
        }
      }
      appendData(ArrData);
    } catch (err) {
      console.error("Error parsing or validating data:", err);
    }
  });
});

async function appendData(data) {
  const currentTime = new Date();
  const minuteAgo = new Date(currentTime - 60 * 1000); // One minute ago

  // Find the document for the current minute
  let document = await DataModel.findOne({
    timestamp: {
      $gte: minuteAgo,
      $lt: currentTime,
    },
  });

  // If no document is found for the current minute, create a new one
  if (!document || document.count === 6) {
    document = new DataModel({
      timestamp: currentTime,
      data: [],
      count: 0,
    });
  }
  // Append the new data to the existing or new document
  for (let i = 0; i < data.length; i++) {
    let temp = new Object()
    temp.name = data[i].particularData.name
    temp.origin = data[i].particularData.origin
    temp.destination = data[i].particularData.destination
    document.data.push(temp);
  }
  
  document.count = document.count + 1;

  await document.save();  //saves the document
}
const server = http.createServer(app);

server.listen(3003, (err) => {
  if (!err) {
    console.log("Listener Service Is Running On port 3003");
  } else {
    console.error(err);
  }
});

app.get('/api/messages', async (req, res) => {
  try {
    const documents = await DataModel.find();
    res.json(documents);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'An error occurred' });
  }
})
io.listen(3005); // Listen on port 3005
