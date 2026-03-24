let stationsData = [];
let trainsData = [];

async function loadData() {
   const stationsRes = await fetch("stations.json");
   const trainsRes = await fetch("trains.json");
   stationsData = await stationsRes.json();
   trainsData = await trainsRes.json();
   console.log(stationsData);
   console.log(trainsData);

}

loadData();



function searchTrains() {
   console.log("Button clicked")
   const from = document.getElementById("from").value.trim().toUpperCase();
   const to = document.getElementById("to").value.trim().toUpperCase();
   const dateValue = document.getElementById("dt").value;
   
   localStorage.setItem("from",from);
   localStorage.setItem("to",to);
   localStorage.setItem("date",dateValue);

   window.location.href ="result.html"}
   