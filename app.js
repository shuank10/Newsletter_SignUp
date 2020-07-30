// Here wew are consuming mailchimp API, which
// will help to collect all the users email in a table,
// and thrugh we are sending NewsLetter.

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.listen(process.env.PORT||1000,function(){
  console.log("Server started at port 1000");
});
// this process.env.PORT is used to give dynamically port, and also we are using
// or 1000, so that we can check it in our localhost as well.
app.get("/",function(req,res){
  res.sendFile(__dirname+"/signup.html");
});

// Now till here we are not handling any static pages in the server like styles.css, images one etc
// to handle this we have to use like this:

app.use(express.static("public"));

// we can give any name rather than public, and inside public folder we'll put
// all the static files.

app.post("/",function(req,res){
  var fname = (req.body.firstname);
  var sname = (req.body.Sname);
  var email = (req.body.Email);
  console.log("first name is: "+ fname);


  // we are consuming mailchimp API.
  // for this we have to store the members details in JSON format.

  // first of all we'll create JSobject. and will stringify it.

  var data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: fname,
          LNAME: sname

          // this merge we have copied from manage audie tab in mailchimp inside
          // Audience fields and *|MERGE|* tags
        }
      }
    ]
  }

  // from this we have fetched all the data whichh user will enter and put it into the mailchimp list
  // but we need these data in pach JSON(i.e string),so
  const JSONData = JSON.stringify(data);
  // console.log(JSONData);
  // {"members":[{"email_address":"svshubhangi1@gmail.com","status":"subscribed","merge_fields":{"FNAME":"Shubhangi","LNAME":"Verma"}}]}

  // now till here we have fetch all the data in the objects.
  // As we are inserting something into the 2nd server(mailchimp), so we'll use POST method

  const url = "https://us17.api.mailchimp.com/3.0/lists/490dd809f0";
  const options = {
    method :  "POST",
    auth: "shubhangi:257ccfb6e338ec51c4c37ba9f997e26f-us17"
    // this auth will you to basic authentication.
  }
  const request = https.request(url,options,function(response){
    response.on("data",function(data){
      console.log(JSON.parse(data));
      // console.log(response.statusCode);
      var Status = response.statusCode;
      if(Status == 200){
        res.sendFile(__dirname+"/success.html");
      }
      else{
        res.sendFile(__dirname+"/failure.html");
      }

    })
  })
  request.write(JSONData);
  request.end();
});

app.post("/failure",function(req,res){
  res.redirect("/");
})


// API KEY //
// 257ccfb6e338ec51c4c37ba9f997e26f-us17//
// listID// this will help to identify the list in which we are adding people.
// 490dd809f0 //
