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

    const searchSubmit = document.getElementById("search-submit");
    const journeyDate = document.getElementById("journey-date");

    searchSubmit.addEventListener("click", () => {
        const fromVal = fromInput.value;
        const toVal = toInput.value;
        const dateVal = journeyDate.value;

        if (!fromVal || !toVal || !dateVal) {
            alert("Please fill all fields: From, To, and Date.");
            return;
        }

        const extractCode = (str) => {
            const match = str.match(/\(([^)]+)\)/);
            return match ? match[1] : str;
        };

        const fromCode = extractCode(fromVal);
        const toCode = extractCode(toVal);

        const searchData = {
            from: fromCode,
            fromName: fromVal.split(" (")[0],
            to: toCode,
            toName: toVal.split(" (")[0],
            date: dateVal
        };

        localStorage.setItem("searchData", JSON.stringify(searchData));
        window.location.href = "../result page/index.html";
    });
});