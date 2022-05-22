const container = document.querySelector("#container"),
    inputPart = container.querySelector(".input"),
    inputField = inputPart.querySelector("input"),
    weatherrightPart = container.querySelector("#currentweatherdata-right"),
    weatherleftPart = container.querySelector("#currentweatherdata-left"),
    currenticon = weatherrightPart.querySelector("img"),
    locationbutton = document.querySelector("#locationbutton");

inputField.addEventListener("keyup", e => {
    if(e.key == "Enter" && inputField.value != "") {
        requestApi(inputField.value);
    }
});

locationbutton.addEventListener("click", e => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(OnSuccess, OnError);
    }
    else {
        notify("error","You browser does not support geolocation api.");
    }
});
function OnSuccess(position) {
    const{latitude, longitude} = position.coords;
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=35e5cd2607a3e7e5357cf3ee72284131`).then(response => response.json()).then(result => currentweatherDetails(result));
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=35e5cd2607a3e7e5357cf3ee72284131`).then(response => response.json()).then(result => weeklyweatherDetails(result));
}

function OnError(error){
    notify("error", "User denied Geolocation.")
}

function requestApi(city){
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=35e5cd2607a3e7e5357cf3ee72284131`).then(response => response.json()).then(result => currentweatherDetails(result));
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=35e5cd2607a3e7e5357cf3ee72284131`).then(response => response.json()).then(result => weeklyweatherDetails(result));
}

function notify(type,message){
    (()=>{
        if (window.innerWidth > 1000) {
            let n = document.createElement("div");
            let id = Math.random().toString(36).substr(2,10);
            n.setAttribute("id",id);
            n.classList.add("notification",type);
            n.innerText = message;
            document.getElementById("notification-area").appendChild(n);
            setTimeout(()=>{
                var notifications = document.getElementById("notification-area").getElementsByClassName("notification");
                for(let i=0;i<notifications.length;i++){
                    if(notifications[i].getAttribute("id") == id){
                        notifications[i].remove();
                        break;
                    }
                }
            },5000);
        }
    })();
}

function weeklyweatherDetails(info) {
    let desc = [0, 7, 15, 23, 31, 39];
    for (let i = 1; i < 6; i++) {
        document.getElementById("description" + i).innerHTML = info.list[desc[i]].weather[0].description;
        const id = info.list[desc[i]].weather[0].id;
        if (id == 800) {
            document.getElementById("icon" + (i)).src = "assets/clear-day.svg";
        } else if (id >= 200 && id <= 232) {
            document.getElementById("icon" + (i)).src = "assets/thunderstorms-extreme-rain.svg";
        } else if (id >= 300 && id <= 321) {
            document.getElementById("icon" + (i)).src = "assets/dizzle.svg";
        } else if (id >= 600 && id <= 622) {
            document.getElementById("icon" + (i)).src = "assets/snow.svg";
        } else if (id >= 701 && id <= 781) {
            document.getElementById("icon" + (i)).src = "assets/mist.svg";
        } else if (id >= 801 && id <= 804) {
            document.getElementById("icon" + (i)).src = "assets/cloudy.svg";
        } else if ((id >= 500 && id <= 531) || (id >= 300 && id <= 321)) {
            document.getElementById("icon" + (i)).src = "assets/rain.svg";
        }
    }
    const monthnumbers = ["01","02","03","04","05","06","07","08","09","10","11","12"];
    let dates = [];
    for (let i = 1; i < 6; i++) {
        let d = new Date();
        let tomorrow = new Date(d);
        tomorrow.setDate(tomorrow.getDate() + i);
        let date = tomorrow.getDate();
        if (date.toString().length == 1) {
            date = '0' + date;
        }
        dates.push(tomorrow.getFullYear() + '-' + monthnumbers[tomorrow.getMonth()] + '-' + date)
    }

    for (let i = 0; i < dates.length; i++) {
        currentdate = dates[i];
        let tempmax = 0;
        let tempmin = 100;
        for (let i = 0; i < info.list.length; i++) {
            if (info.list[i].dt_txt.includes(currentdate)) {
                if (info.list[i].main.temp_max > tempmax){
                    tempmax = info.list[i].main.temp_max;
                }
                if (info.list[i].main.temp_min < tempmin){
                    tempmin = info.list[i].main.temp_min;
                }

            }
        }
        tempmax = Math.floor(tempmax);
        tempmin = Math.floor(tempmin);
        document.getElementById("temp_max" + (i+1)).innerHTML = tempmax + '°<span id="temp_min1" class="templowest">/' + tempmin + '°';

    }
}
    let today = new Date();
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    function setWeekdays(day) {
        if (day + today.getDay() > 6) {
            return day + today.getDay() - 7;
        } else {
            return day + today.getDay();
        }
    }
    const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
    for (let i = 1; i < 6; i++) {
        document.getElementById("day" + (i)).innerHTML = days[setWeekdays(i)];
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + i)
        document.getElementById("date" + (i)).innerHTML = monthNames[tomorrow.getMonth()].toString() + " " +(tomorrow.getDate()).toString();
    }


    function currentweatherDetails(info) {
        if (info.cod == "404") {
            notify("error",`${inputField.value} isn't a valid city name`);
            inputField.value = "";
        } else {
            notify("success",`Succesfully searched: ${info.name}`);
            const city = info.name;
            const country = info.sys.country;
            const {description, id} = info.weather[0];
            const {temp, temp_max, temp_min} = info.main;

            let d = new Date();
            const monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"];
            let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

            function setWeekdays(day) {
                if (day + today.getDay() > 6) {
                    return day + today.getDay() - 7;
                } else {
                    return day + today.getDay();
                }
            }
            document.getElementById("day-time").innerHTML = days[setWeekdays(d.getDay())].toUpperCase() + ", " + monthNames[d.getMonth()].toUpperCase() + " " + d.getDate();
            let d2 = new Date(info.sys.sunrise*1000);
            document.getElementById("sunrise").innerHTML = d2.getHours() + ":" + d2.getMinutes() + " am"
            let d3 = new Date(info.sys.sunset*1000);
            document.getElementById("sunset").innerHTML = d3.getHours() + ":" + d3.getMinutes() + " pm"
            document.getElementById("sunsubtitle").innerHTML = "Today: "+ days[setWeekdays(d.getDay()+1)] + ", " + monthNames[d.getMonth()] + " " + d.getDate()
            if (id == 800) {
                currenticon.src = "assets/clear-day.svg";
            } else if (id >= 200 && id <= 232) {
                currenticon.src = "assets/thunderstorms-extreme-rain.svg";
            } else if (id >= 300 && id <= 321) {
                document.getElementById("icon" + (i)).src = "assets/dizzle.svg";
            } else if (id >= 600 && id <= 622) {
                currenticon.src = "assets/snow.svg";
            } else if (id >= 701 && id <= 781) {
                currenticon.src = "assets/mist.svg";
            } else if (id >= 801 && id <= 804) {
                currenticon.src = "assets/cloudy.svg";
            } else if ((id >= 500 && id <= 531) || (id >= 300 && id <= 321)) {
                currenticon.src = "assets/rain.svg";
            }
            weatherrightPart.querySelector("h5").innerText = Math.floor(temp) + '°';
            weatherleftPart.querySelector("h2").innerText = `${city}, ${country}`;
            inputField.value = "";
        }
    }
//Pagina Reload
    document.addEventListener('DOMContentLoaded', function () {
        requestApi('Geel');
    });

