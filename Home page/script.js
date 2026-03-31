document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("booking-modal");
    const bookNowBtn = document.getElementById("book-now-btn");
    const closeBtn = document.querySelector(".close-btn");
    const fromInput = document.getElementById("from-station");
    const toInput = document.getElementById("to-station");
    let stationsData = [];

    fetch('stations.json')
        .then(response => response.json())
        .then(data => {
            stationsData = data;
        })
        .catch(err => console.error("Error loading stations data:", err));

    bookNowBtn.addEventListener("click", () => {
        modal.style.display = "block";
    });

    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    function autocomplete(inputElement, listElementId) {
        inputElement.addEventListener("input", function () {
            let val = this.value;
            let listContainer = document.getElementById(listElementId);
            listContainer.innerHTML = "";
            if (!val) { return false; }

            let count = 0;
            for (let i = 0; i < stationsData.length; i++) {
                let stationName = stationsData[i].name;
                let stationCode = stationsData[i].code;
                let searchStr = val.toUpperCase();

                if (stationName.toUpperCase().includes(searchStr) || stationCode.toUpperCase().includes(searchStr)) {
                    if (count >= 5) break;
                    count++;
                    let itemDiv = document.createElement("DIV");

                    itemDiv.innerHTML = `${stationName} (<strong>${stationCode}</strong>)`;

                    itemDiv.addEventListener("click", function () {
                        inputElement.value = `${stationName} (${stationCode})`;
                        listContainer.innerHTML = "";
                    });
                    listContainer.appendChild(itemDiv);
                }
            }
        });

        document.addEventListener("click", function (e) {
            if (e.target !== inputElement) {
                document.getElementById(listElementId).innerHTML = "";
            }
        });
    }

    autocomplete(fromInput, "from-autocomplete-list");
    autocomplete(toInput, "to-autocomplete-list");
    
    const submitBtn = document.getElementById("submitBtn");
    const dateInput = document.getElementById("journey-date");
    //convert user input to station code
    submitBtn.addEventListener("click", () => {
        const userData = {
            from: fromInput.value,
            to: toInput.value,
            date: dateInput.value
        };

        if(!userData.from || !userData.to || !userData.date) {
            alert("Please select both stations and a date.");
            window.location.href = "../Home page/index.html";
            return; 
        }
        else{
            window.location.href = "../rEsult pAge/result.html";
        }

        localStorage.setItem("JourneyAlpha", JSON.stringify(userData));

    });
});

