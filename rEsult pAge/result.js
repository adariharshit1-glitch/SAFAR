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
const results = document.getElementById('results');
findTrains();
function findTrains(){
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
                                    createCard(allTrains[i],allTrains[i].schedule[j].station_code,allTrains[i].schedule[k].station_code,allTrains[i].schedule[j].time,allTrains[i].schedule[k].time,getDayName(userData.date));
                                    let pricePerPerson = allTrains[i].schedule[k].distance - allTrains[i].schedule[j].distance;
                                    pricePerPerson *= allTrains[i].price_per_km;
                                    if(pricePerPerson < 0){
                                        pricePerPerson *= -1;
                                    }
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
                                    //details i need from this>>
                                    //1)dist cost
                                    //2)time from and to
                                    //3)distance
                                    //4)both time end and start
                                    let pricePerPerson = allTrains[i].schedule[k].distance - allTrains[i].schedule[j].distance;
                                    pricePerPerson *= allTrains[i].price_per_km;
                                    if(pricePerPerson < 0){
                                        pricePerPerson *= -1;
                                    }
                                    createCard(allTrains[i],allTrains[i].schedule[k].station_code,allTrains[i].schedule[j].station_code,allTrains[i].schedule[k].time,allTrains[i].schedule[j].time,allTrains[i].distance,getDayName(userData.date), pricePerPerson);
                                    //next page >> what have: I from,to and date ;need: price per person,train id and train name
                                    
                                }
                                    
                            }
                        }       
                    } 
                }
            }
        }
    }
}

function createTrainCard(allTrains,from,to,timeFrom,timeTo, day, price){
    const trainCard = document.createElement("div");
    trainCard.className = "trainCard";

    trainCard.innerHTML = `
        <div class="trainCard-header">
            <span class="trainCard-name">${allTrains.train_name}</span>
            <span class="trainCard-code">${allTrains.train_number}</span>
            <span class="trainCard-day">${day}</span>
        </div>
        <div class="trainCard-route">
            <div class="trainCard-station">
                <span class="trainCard-station-code">${from}</span>
                <span class="trainCard-station-time">${timeFrom}</span>
            </div>
            <div class="trainCard-track"></div>
            <div class="trainCard-station">
                <span class="trainCard-station-code">${to}</span>
                <span class="trainCard-station-time">${timeTo}</span>
            </div>
        </div>
        <div class="trainCard-footer">
            <span class="trainCard-duration"><i class="fa-regular fa-clock"></i> ${allTrains.duration || "--"}</span>
            <div>
                <span class="trainCard-price">₹${allTrains.price_per_km}<span>/km</span></span>
                <span class="trainCard-price">₹${price}<span>/person</span></span>
            </div>
            <button class="trainCard-book">Book Now</button>
        </div>
    `;

    results.appendChild(trainCard);

}