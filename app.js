//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request")
const path = require("path");

const app = express();

//Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, "public")));

var port = process.env.PORT || 3000;

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/public/index.html")
});

app.post("/subscribe", function(req, res) {
  const {email, fName, lName, js} = req.body;
  console.log(req.body);

  const mcData = {
    members: [
      {
        merge_fields: {
          FNAME: fName,
          LNAME: lName
        },
        email_address: email,
        status: "subscribed"//"pending" mailchimp se gui mail toi de xac nhan roi moi add vao list
      }
    ]
  }
  const mcDataPost = JSON.stringify(mcData);

  const options = {
    url: 'https://us1.api.mailchimp.com/3.0/lists/0ed17a1263', // list key o day
    method: 'POST',
    headers: {
      Authorization: 'auth 9c26e81addc4a61b9df1ba5fca55490c-us1' //API key
    },
    body: mcDataPost
  }

  if (email) {
    request(options, function(error, response, body) {
      if(error) {
        res.json({error: error})
      } else {
        if (js) {
          res.sendStatus(200);
        }
        else {
          res.redirect('/success.html')
        }
      }
    })
  } else {
    res.status(404).send({message: 'Failed'})
  }
})

app.listen(port, console.log("Server is listening at port 3000"))
