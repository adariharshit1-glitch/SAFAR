let allTrains = [];

fetch('trains.json')
    .then(response => response.json())
    .then(data => {
        allTrains = data;
    })
    .catch(error => console.error("Error loading trains data:", error));

let availaibleTrains = [];

function getDayName(dateStr){ 
    const dateObj = new Date(dateStr);

    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });

    return dayName;
}
function displayTrains(){
    let i,j,k;
    const userData = JSON.parse(localStorage.getItem("journeyAlpha"));
    for(i=0; i<allTrains.length; i++){
        const places = allTrains[i].schedule.length;
        for(j=0; j<places; j++){
            if(allTrains[i].schedule[j].station_code === userData.from || allTrains[i].schedule[j].station_code === userData.to){
                if(allTrains[i].schedule[j].station_code === userData.from){
                    for(let k=j+1; k<places; k++){
                        if(allTrains[i].schedule[k].station_code === userData.to){
                            //let a = parseInt(allTrains[i].schedule[j].time.replace(":", ""));
                            //let b = parseInt(allTrains[i].schedule[k].time.replace(":", ""));

                            //if(a < b){
                                ///
                            //}
                            for(let l=0; l<allTrains[i].runs_on.length; l++){
                                if(getDayName(userData.date)===allTrains[i].runs_on[l]){
                                    availaibleTrains.push(allTrains[i]);
                                }
                            }
                        }
                    }
                }
                
                else if(allTrains[i].schedule[j].station_code === userData.to){
                    for(k=j+1; k<places; k++){
                        if(allTrains[i].schedule[k].station_code === userData.from){
                            //let a = parseInt(allTrains[i].schedule[j].time.replace(":", ""));
                            //let b = parseInt(allTrains[i].schedule[k].time.replace(":", ""));
                            //if(a > b){
                                ///
                            for(let l=0; l<allTrains[i].runs_on.length; l++){
                                if(getDayName(userData.date)===allTrains[i].runs_on[l]){
                                    availaibleTrains.push(allTrains[i]);
                                }
                            }       
                        } 
                    }
                }
            }
        }
    }
    renderTrains();
}

function renderTrains(){
    const trainList = document.getElementById('trainList');
    const noResults = document.getElementById('noResults');
    const userData = JSON.parse(localStorage.getItem("journeyAlpha"));

    document.getElementById('fromLabel').textContent = userData.from;
    document.getElementById('toLabel').textContent = userData.to;
    document.getElementById('dateLabel').textContent = userData.date;

    if(availableTrains.length === 0){
        noResults.style.display = 'block';
        return;
    }

    trainList.innerHTML = availableTrains.map(train => {
        const fromStop = train.schedule.find(s => s.station_code === userData.from);
        const toStop = train.schedule.find(s => s.station_code === userData.to);
        const dist = Math.abs(toStop.distance - fromStop.distance);
        const price = Math.round(dist * train.price_per_km);

        return `
        <div class="trainCard">
            <div class="cardTop">
                <div class="trainIdBlock">
                    <span class="trainNum">${train.train_id}</span>
                    <span class="trainName">${train.train_name}</span>
                </div>
                <span class="runDays">${train.runs_on.join(' · ')}</span>
            </div>
            <div class="cardMid">
                <div class="stationBlock">
                    <span class="time">${fromStop.time}</span>
                    <span class="stationCode">${fromStop.station_code}</span>
                </div>
                <div class="journeyLine">
                    <span class="durationLabel">${dist} km</span>
                    <div class="lineTrack">
                        <div class="dot"></div>
                        <div class="track"></div>
                        <div class="arrowTip"></div>
                    </div>
                </div>
                <div class="stationBlock right">
                    <span class="time">${toStop.time}</span>
                    <span class="stationCode">${toStop.station_code}</span>
                </div>
            </div>
            <div class="cardBottom">
                <div class="priceBlock">
                    <span class="priceLabel">FROM</span>
                    <span class="priceValue">₹${price}</span>
                </div>
                <button class="bookBtn">Book Now</button>
            </div>
        </div>`;
    }).join('');
}