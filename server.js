const express = require("express");
const path = require("path");
const fs = require("fs");
const ejs = require("ejs");
const axios = require("axios");
const bodyParser = require("body-parser");
const multer = require('multer');

const app = express();
const upload = multer();

const host = "localhost";
const PORT = process.env.PORT || 8000;

app.use(express.static(__dirname + "/public"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// REITTI "/"
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/public" + "/index.html"));
}); 

// REITTI "/GUESTBOOK"
app.get("/guestbook", (req, res) => {
  var data = require(__dirname + "/data" + "/guestbook.json");

  /* toinen tapa olis ollut kuten tuntiesimerkissä, eli parsetaan yllä haettu data muuttujaan, jossa määritellään html ja for-loopilla pusketaan tiedot tähän tableen, mutta en halunnut koko html sivua listata tähän niin toteutin ejs:llä */
  res.render(__dirname + "/views" + "/index.ejs", { data });
});

// REITTI "/NEWMESSAGE"
app.get("/newmessage", (req, res) => {
  res.sendFile(path.join(__dirname + "/public" + "/newmessage.html"));
});

app.post("/newmessage", (req, res) => {
  var data = require(__dirname + "/data" + "/guestbook.json");

  const tunnus = req.body.username;
  const maa = req.body.country;
  const viesti = req.body.message;
  const date =
    new Date().getDate() +
    "/" +
    (1 + parseInt(new Date().getMonth())) +
    "/" +
    new Date().getFullYear();
  let newId = 0;

  for (var i = 0; i < data.length; i++) {
    newId = data[i].id + 1;
  }

  data.push({
    id: newId,
    username: tunnus,
    country: maa,
    date: date,
    message: viesti,
  });

  var jsonStr = JSON.stringify(data);

  fs.writeFile(__dirname + "/data" + "/guestbook.json", jsonStr, (err) => {
    if (err) throw err;
    console.log("tiedot tallennettu...")
})
  res.send("Your message has been saved! Go to <a href='/guestbook'>/guestbook</a> to see all messages");
});

// REITTI "/AJAXMESSAGE"
app.get("/ajaxmessage", (req, res) => {
  res.sendFile(path.join(__dirname + "/public" + "/ajaxmessage.html"));
});

  /*  */
app.post('/ajaxmessage', upload.none(), (req, res) => {
  var newData = req.body;

  let existingData = [];
  try {
      existingData = JSON.parse(fs.readFileSync(__dirname + "/data" + "/guestbook.json"));
  } catch (error) {
      console.error('Error reading file:', error);
  }

  var newId = 0;
  var date =
    new Date().getDate() +
    "/" +
    (1 + parseInt(new Date().getMonth())) +
    "/" +
    new Date().getFullYear();
  for (var i = 0; i < existingData.length; i++) {
    newId = existingData[i].id + 1;
  }

  newData.id = newId;
  newData.date = date;

  existingData.push(newData);

  fs.writeFileSync(__dirname + "/data" + "/guestbook.json", JSON.stringify(existingData, null, 2), 'utf8');

  res.json(existingData);
});

app.get(__dirname + "/public" + "/script.js", (req, res) => {
    res.sendFile(__dirname + "/public" + "/script.js");
});

app.listen(PORT, () => 
  console.log(`Server is running on http://${host}:${PORT}`)
); 