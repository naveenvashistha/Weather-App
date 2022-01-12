const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({"extended":true}));

app.get("/",function(req,res){
 res.sendFile(__dirname+"/index.html");
});

app.post("/", function(req,res){
  const city = req.body.cityName;
  const url = "https://api.openweathermap.org/data/2.5/weather?q="+city+"&units=metric&appid=5dbe2bfa94f965a6f78cf971b08d1916#";
  https.get(url,function(response){
    response.on("data",function(data){
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const icon = weatherData.weather[0].icon;
      const description = weatherData.weather[0].description;
      const imageURL = "http://openweathermap.org/img/wn/"+icon+"@2x.png";
      res.write("<h1>weather conditions are: "+description+"</h1>");
      res.write("<h1>Temperature in "+city+" is "+temp+"</h1>");
      res.write("<img src = "+imageURL+">");
      res.send();
    });
  });
});


app.listen(3000,function(){
  console.log("server is running");
});
