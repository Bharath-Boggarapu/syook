const givenData = require("../data.json");

const crypto = require("crypto");
const aes256 = require("aes256");

function GenerateRandomData() {
  let temp = new Object();
  maxm = givenData.names.length;
  temp.name = givenData.names[Math.floor(Math.random() * maxm)];
  temp.origin = givenData.cities[Math.floor(Math.random() * maxm)];
  temp.destination = givenData.cities[Math.floor(Math.random() * maxm)];
  return temp;
}

function GetRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function GenerateEncryptedMessage() {
  const min = 49;
  const max = 449;
  const randomTimes = GetRandomNumber(min, max);
  finalEncryptedMessage = "";
  const dataArr = [];
  finalEncryptedMessage = "";
  for (let i = 0; i < randomTimes; i++) {
    data = GenerateRandomData();
    data.secret_key = crypto
      .createHash("sha256")
      .update(JSON.stringify(data))
      .digest("hex");
    let dataToEncrypt = JSON.stringify(data);
    let passKey = "syook-bbk";
    let encryptedMessage = aes256.encrypt(passKey, dataToEncrypt);
    finalEncryptedMessage = finalEncryptedMessage + encryptedMessage + "|";
  }
  return finalEncryptedMessage.slice(0, -1);
}

module.exports = { GenerateRandomData, GenerateEncryptedMessage };
