document.addEventListener("DOMContentLoaded", () => {
    const searchDataRaw = localStorage.getItem("searchData");
    if (!searchDataRaw) {
        alert("No search constraints found. Redirecting to home.");
        window.location.href = "../Home page/index.html";
        return;
    }

    const searchData = JSON.parse(searchDataRaw);

    document.getElementById("from-name").textContent = searchData.fromName || searchData.from;
    document.getElementById("to-name").textContent = searchData.toName || searchData.to;

    fetch("../trains.json")
        .then(res => res.json())
        .then(data => {
            const trains = data.trains;
            const filteredTrains = [];

            const dateObj = new Date(searchData.date);
            const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            const searchDay = days[dateObj.getDay()];

            trains.forEach(train => {
                if (train.runs_on && train.runs_on.includes(searchDay)) {
                    let fromIndex = -1;
                    let toIndex = -1;

                    for (let i = 0; i < train.schedule.length; i++) {
                        if (train.schedule[i].station_code === searchData.from) fromIndex = i;
                        if (train.schedule[i].station_code === searchData.to) toIndex = i;
                    }

                    if (fromIndex !== -1 && toIndex !== -1 && fromIndex < toIndex) {
                        var startDetails = train.schedule[fromIndex];
                        var endDetails = train.schedule[toIndex];
                        var distanceDiff = endDetails.distance - startDetails.distance;
                        var fare = Math.max(50, Math.floor(distanceDiff * train.price_per_km));

                        var startParts = startDetails.time.split(':');
                        var endParts = endDetails.time.split(':');
                        var startMinsTotal = parseInt(startParts[0], 10) * 60 + parseInt(startParts[1], 10);
                        var endMinsTotal = parseInt(endParts[0], 10) * 60 + parseInt(endParts[1], 10);

                        if (endMinsTotal < startMinsTotal) {
                            endMinsTotal += 24 * 60;
                        }

                        var totalDurationMins = endMinsTotal - startMinsTotal;
                        var durationHrs = Math.floor(totalDurationMins / 60);
                        var durationMins = totalDurationMins % 60;

                        filteredTrains.push({
                            train_id: train.train_id,
                            train_name: train.train_name,
                            runs_on: train.runs_on,
                            schedule: train.schedule,
                            price_per_km: train.price_per_km,
                            startDetails: startDetails,
                            endDetails: endDetails,
                            distanceDiff: distanceDiff,
                            fare: fare,
                            durationHrs: durationHrs,
                            durationMins: durationMins,
                            totalDurationMins: totalDurationMins
                        });
                    }
                }
            });

            var currentSortedTrains = filteredTrains.slice();

            if (filteredTrains.length > 0) {
                document.getElementById("sort-filter-container").style.display = "flex";
            }

            renderTrains(currentSortedTrains);

            var sortSelect = document.getElementById("sortOptions");
            if (sortSelect) {
                sortSelect.addEventListener("change", function (e) {
                    var sortVal = e.target.value;
                    var sorted = filteredTrains.slice();

                    if (sortVal === "priceAsc") {
                        sorted.sort(function (a, b) { return a.fare - b.fare; });
                    } else if (sortVal === "priceDesc") {
                        sorted.sort(function (a, b) { return b.fare - a.fare; });
                    } else if (sortVal === "durationAsc") {
                        sorted.sort(function (a, b) { return a.totalDurationMins - b.totalDurationMins; });
                    } else if (sortVal === "durationDesc") {
                        sorted.sort(function (a, b) { return b.totalDurationMins - a.totalDurationMins; });
                    }

                    currentSortedTrains = sorted;
                    renderTrains(currentSortedTrains);
                });
            }
        })
        .catch(err => {
            console.error("Error fetching train data:", err);
        });


    function renderTrains(trains) {
        const container = document.getElementById("results-container");
        container.innerHTML = "";

        const countText = `${trains.length} trains found`;
        document.getElementById("search-date-display").innerText = `${searchData.date} · ${countText}`;

        if (trains.length === 0) {
            document.getElementById("no-results").style.display = "block";
            return;
        }

        trains.forEach((train, index) => {
            const card = document.createElement("div");
            card.className = "train-card";

            const fare = train.fare;
            const durationHrs = train.durationHrs;
            const durationMins = train.durationMins;

            card.innerHTML = `
                <div class="train-info">
                    <div class="train-title-wrapper">
                        <h2><i class="fa-solid fa-train" style="color: #ff9800; margin-right: 8px;"></i>${train.train_name}</h2>
                        <span class="train-id">Train #${train.train_id}</span>
                    </div>
                    <div class="train-timing">
                        <div class="time-box">
                            <div class="time">${train.startDetails.time}</div>
                        </div>
                        <div class="duration">
                            <span><i class="fa-regular fa-clock"></i> ${durationHrs}h ${durationMins}m</span>
                        </div>
                        <div class="time-box">
                            <div class="time">${train.endDetails.time}</div>
                        </div>
                    </div>
                </div>
                <div class="train-action">
                    <div class="fare">₹ ${fare}</div>
                    <button class="btn book-btn">Book Now</button>
                </div>
            `;

            card.querySelector(".book-btn").addEventListener("click", () => {
                const selectedTrain = {
                    train: train,
                    fare: train.fare,
                    fromTime: train.startDetails.time,
                    toTime: train.endDetails.time,
                    date: searchData.date
                };
                localStorage.setItem("selectedTrain", JSON.stringify(selectedTrain));
                window.location.href = "../seat selection/index.html";
            });

            container.appendChild(card);
        });
    }
});
