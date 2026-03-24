let trainsData = [];
const from = localStorage.getItem("from");
const to = localStorage.getItem("to");
const date=localStorage.getItem("date")

loadData();
async function loadData() {
   const stationsRes = await fetch("stations.json");
   const trainsRes = await fetch("trains.json");
   stationsData = await stationsRes.json();
   trainsData = await trainsRes.json();
   console.log(stationsData);
   console.log(trainsData);
searchTrains();
}




function getDayFromDate(dateString){
   const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
   const date = new
   Date(dateString);
   return days[date.getDay()];
}


function searchTrains() {
   
   const selectedDay = getDayFromDate(date);
   
   const resultDiv = document.getElementById("result");

   
   resultDiv.innerHTML = "";
   let found = false;
   trainsData.trains.forEach(train => {
      if(!train.runs_on.includes(selectedDay)){return;}
      let fromIndex = -1;
      let toIndex = -1;

      train.schedule.forEach((stop, index) => {
         if (stop.station_code === from) {
            fromIndex = index;
         }
         if (stop.station_code === to) {
            toIndex = index;
         }
      });



      if (fromIndex !== -1 && toIndex !== -1 && fromIndex < toIndex) {
         found = true;
      
   let fromStop = train.schedule[fromIndex];
   let toStop = train.schedule[toIndex];
   console.log(fromStop, toStop);
   const distance = toStop.distance - fromStop.distance;
   const price = distance * train.price_per_km;
   resultDiv.innerHTML += `
   <div style="border:1px solid black; padding:10px; margin: 10px;
   background: white;
padding: 20px;
margin: 20px 0;
border-radius: 10px;
box-shadow: 0 4px 10px rgba(0,0,0,0.1);
transition: 0.3s;">
   <h3>${train.train_name}</h3>
   <p><strong>From:</strong> ${from}(${fromStop.time})</p>
    <p><strong>To:</strong> ${to}(${toStop.time})</p>
    <p><strong>Date:</strong>${selectedDay}</p>
    <p><strong>Distance:</strong>${distance} km </p>
    <p><strong>Price:</strong>${price}</p>
    </div>
   
   `;
}
   });


   
if (!found) {
   resultDiv.innerHTML = "<p>No trains found</p>";
}


   }

