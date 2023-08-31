const io = require("socket.io")();
const crypto = require("crypto");
const aes256 = require("aes256");
const mongoose = require("mongoose");
//const express =

// Connect to MongoDB using Mongoose

const mongoDbConnection = () => {
  mongoose
    .connect(
      "mongodb+srv://bbk:mAZUxyRVzObUeSZo@cluster1.kkjl4.mongodb.net/forSyook?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
    .then((res) => {
      console.log(res.connection.name, res.connection.host, "db connected");
    })
    .catch((err) => {
      console.log(err);
    });
};
mongoDbConnection();

// Define a MongoDB schema for time-series data
const dataSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },

  data: [
    {
      name: String,
      origin: String,
      destination: String,
    },
  ],
  particularData: {
    name: String,
    origin: String,
    destination: String,
  },

  count: { type: Number, default: 0 },
});

const DataModel = mongoose.model("listenerdatas", dataSchema);

io.on("connection", (socket) => {
  console.log("emitter connected");

  socket.on("message", (encryptedMessage) => {
    console.log(encryptedMessage);
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
            particularData:{
                name: data.name,
                origin: data.origin,
                destination: data.destination,
            }
          });
          ArrData.push(newData);
        //   console.log(newData);
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
    console.log("correct data is  ",data[i])
    document.data.push(data[i]);
  }
  document.count = document.count + 1;

  // Save the document
  await document.save();

  console.log("Data appended:", document.count);
}

io.listen(3005); // Listen on port 3005
