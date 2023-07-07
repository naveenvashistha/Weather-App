const city = document.getElementById("id1");
const lat = document.getElementById("id2");
const wait = document.getElementById("wait");
const errorPage = document.getElementById("error");
const dashboard = document.getElementById("dashboard");
const currentDate = document.getElementById("currentDate");
const month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const text = ["Dont know whats the weather at your place?","Click the button and let the power of Gods may flow through you. Shazam!!!"];
const air = {"1":"Good", "2":"Fair","3":"Avg","4":"Bad","5":"Awful"}
const tag = document.getElementById("mainText");
const weather = document.getElementById("weather");
const modal = document.getElementById("modalShow");
const cityname = document.getElementById("city");
const flag = document.getElementById("flag");
const content1 = document.getElementById("content1");
const content2 = document.getElementById("content2");
let itemIndex = 0;
let letterIndex = 0;
const entityNames = ['temperature','humidity','pressure','visibility','cloudiness','aqi'];
let lineChart = new Chart("myChart", {
    type: "line",
    data: {
      datasets: [{
      pointRadius: 20,
      label: 'Temp',
      borderColor: "rgba(21,1,2,0.1)",
      pointStyle: [],
      data: []
 }]
},
   options: {
    plugins: {
        legend: false,
        title: {
            display: true,
            text: '5 days forecast'
          }
    },
     responsive: true,
     maintainAspectRatio: false,
     scales: {
     x1: {
        border:{
            display: false
        },
        offset:true,
        labels: [],
        type: 'category',
        display: false,
         grid: {
             display:false
         }
     },
     x:{
        border:{
            display: false
        },
        offset:true,
        type: 'category',
        ticks:{
            padding: 8
        },
        labels: [],
        display: true, // Set to false to hide the axis
        grid: {
            display:false
        }

      },
     y: {
        border:{
            display: false
        },
        offset:true,
        display: true,
        ticks:{
            padding: 10
        },
        grid: {
            display:false
        }

     }
 }
}
});

function selectChange(event){
   if (event.target.value === "0"){
    hide(city,lat);
   }
   else if (event.target.value === "1"){
    show(city);
    hide(lat);
   }
   else{
    show(lat);
    hide(city);
   }
}

function show(...ele){
    for (i of ele){
        i.style.display = "flex";
        i.classList.add("addAnimation");
    }
   
}

function hide(...ele){
    for(i of ele){
        i.style.display = "none";
        i.classList.remove("addAnimation");
    }
}

function loadtext(){
    if (letterIndex < text[itemIndex].length){
       tag.innerHTML = text[itemIndex].slice(0,letterIndex) + "<div id='dash' class='cursor'></div>";
       letterIndex++;
       setTimeout(loadtext,100);
    }
    else{
        if(itemIndex + 1 != text.length){
            setTimeout(deleteChar,1000);
    }
    else{
        document.getElementById("dash").remove();
        tag.innerHTML += "<i class='fa-solid fa-cloud-bolt px-2'></i>";
    }
}
}

function deleteChar(){
     if(letterIndex != -1){
        tag.innerHTML = text[itemIndex].slice(0,letterIndex) + "<div id='dash' class='cursor'></div>";
        letterIndex--;
        setTimeout(deleteChar,100);
     }
     else{
        itemIndex++;
        letterIndex++;
        loadtext();
     }
}

function check(event){
    event.preventDefault();
    modal.click();
    show(wait);
    hide(errorPage,dashboard);
    wait.style.display = "block";
    if (event.target.id == "id1"){
        getData({city:event.target[0].value,id:"id1"});
    }
    else{
        getData({lat:event.target[0].value,lon:event.target[1].value,id:"id2"});
    }
}

function getData(dataPoints){
    axios.post("/",dataPoints)
    .then((response)=>{
        const d = new Date();
        let dateNo = d.getDate();
        let monthName = month[d.getMonth()];
        let year = d.getFullYear();
        let day = days[d.getDay()];
        currentDate.innerHTML = `${dateNo} ${monthName} ${year}, ${day}`;
        weather.src = `https://openweathermap.org/img/wn/${response.data[0].weather[0].icon}@2x.png`
        flag.src = "https://flagcdn.com/"+ response.data[0].sys.country.toLowerCase() +".svg";
        const entityValues = [`${Math.round(response.data[0].main.temp*10)/10}\u00B0C`,`${response.data[0].main.humidity}%`,`${response.data[0].main.pressure} hPa`,`${response.data[0].visibility/1000}km`,`${response.data[0].clouds.all}%`,air[response.data[2].list[0].main.aqi]];
        for(w=0; w<6; w++){
            document.getElementById(entityNames[w]).getElementsByClassName("value m-0")[0].innerHTML = entityValues[w];
        }
        if (dataPoints.id === "id1"){
          cityname.innerHTML = dataPoints.city.charAt(0).toUpperCase() + dataPoints.city.slice(1).toLowerCase();
        }else{
          cityname.innerHTML = response.data[0].name;
        }
        makeChart(response);
        setTimeout(()=>{
            hide(wait,errorPage);
            dashboard.style.display = "flex";
            show(content1,content2);
        },2000);
    })
    .catch((error)=>{
        console.log(error);
        setTimeout(()=>{
            hide(wait,dashboard,content1,content2);
            show(errorPage);
        },2000);
    });
}

function makeChart(response){
    // console.log(response.data[1]);
    let chartPoints = [];
    let days = [];
    let pointImg = [];
    let description = [];
    let timePoints = response.data[1].list;
    for(const p of timePoints){
        let dt = new Date(p.dt_txt);
        if(dt.getHours() === 12){
            let img = new Image(50,50);
            img.src =  `https://openweathermap.org/img/wn/${p.weather[0].icon}@2x.png`;
            days.push(`${dt.getDate()} ${month[dt.getMonth()]}`);
            description.push(p.weather[0].description);
            chartPoints.push(p.main.temp);
            pointImg.push(img);
        }
    }
    lineChart.options.scales["x1"].labels = description;
    lineChart.options.scales["x"].labels = days;
    lineChart.data.datasets[0].data = chartPoints;
    lineChart.data.datasets[0].pointStyle = pointImg;
    lineChart.update();
}

