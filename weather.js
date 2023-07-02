require('dotenv').config();
const express = require("express");
const path = require('path');
const axios = require("axios");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get("/",function(req,res){
  res.sendFile(__dirname + "/weather.html");
});

app.post("/", function(req,res){
  if ('city' in req.body){
     const city = req.body.city.toLowerCase();
     axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${process.env.APP_ID}`)
     .then((response)=>{
      const data = response.data;
      if (data.length != 0){
         const lat = data[0].lat;
         const lon = data[0].lon;
         getDataFromAPI(lat,lon,res);
      }
      else{
        res.status(400).send(error);
      }
     }).catch((error)=>{
      res.status(400).send(error);
     });
  }
  else{
    getDataFromAPI(req.body.lat,req.body.lon,res);
  }
});


app.listen(3000 || process.env.PORT,function(){
  console.log("server is running");
});


function getDataFromAPI(lat,lon,res){
  const current = axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.APP_ID}`);
  const forecast = axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.APP_ID}`);
  const air = axios.get(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.APP_ID}`);
  Promise.all([current,forecast,air])
  .then((result)=>{
    res.send([result[0].data,result[1].data,result[2].data]);
  })
  .catch((error)=>{
    res.status(400).send(error);
  });
}