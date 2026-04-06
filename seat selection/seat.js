let selectedSeats = [];
let baseFare = 0;
let selectedClass = "Sleeper"; // default class

const data = JSON.parse(localStorage.getItem("selectedTrain"));
const searchData = JSON.parse(localStorage.getItem("searchData"));

if (data && searchData) {
    document.getElementById("trainInfo").innerText = "Seat Selection";

    // Populate layout refs
    document.getElementById("train-name-display").innerText = data.train.train_name;
    document.getElementById("train-num-display").innerText = "Train #" + data.train.train_id;
    document.getElementById("route-from").innerText = searchData.fromName || searchData.from;
    document.getElementById("route-from-time").innerText = data.fromTime || "00:00";
    document.getElementById("route-to").innerText = searchData.toName || searchData.to;
    document.getElementById("route-to-time").innerText = data.toTime || "00:00";
    document.getElementById("route-date").innerText = searchData.date;
    document.getElementById("base-fare-display").innerText = "₹" + data.fare;

    baseFare = data.fare;

    // Initialize default class and UI which also updates the summary properly
    selectClass(selectedClass);
} else {
    document.getElementById("trainInfo").innerText = "Seat Selection";
}

function generateSeats(rows, cols) {
    const container = document.getElementById("seatContainer");
    container.innerHTML = "";

    let count = 1;

    for (let i = 0; i < rows; i++) {
        let row = document.createElement("div");
        row.className = "row";

        for (let j = 0; j < cols; j++) {
            let seat = document.createElement("button");
            seat.className = "seat";
            seat.innerText = count;

            if (Math.random() < 0.2) {
                seat.classList.add("booked");
                seat.disabled = true;
            }

            seat.onclick = function () {
                toggleSeat(seat);
            };

            row.appendChild(seat);
            count++;
        }

        container.appendChild(row);
    }
}

function selectClass(type) {
    selectedSeats = [];
    selectedClass = type;

    if (type === "1AC") {
        generateSeats(10, 2);
    }
    else if (type === "2AC") {
        generateSeats(10, 3);
    }
    else {
        generateSeats(10, 4);
    }

    updateSummary();
}

function toggleSeat(seat) {
    let num = seat.innerText;

    if (selectedSeats.includes(num)) {
        selectedSeats = selectedSeats.filter(function (s) {
            return s != num;
        });

        seat.classList.remove("selected");
        const formRow = document.getElementById("pass-form-" + num);
        if (formRow) {
            formRow.remove();
        }

    } else {
        selectedSeats.push(num);
        seat.classList.add("selected");

        const passengerForms = document.getElementById("passengerForms");
        const formDiv = document.createElement("div");
        formDiv.className = "passenger-form";
        formDiv.id = "pass-form-" + num;
        formDiv.innerHTML = `
            <p>Passenger for Seat ${num}</p>
            <div class="inputs-row">
                <input type="text" id="pass-name-${num}" placeholder="Full Name">
                <input type="number" id="pass-age-${num}" placeholder="Age" min="1" max="120">
            </div>
        `;
        passengerForms.appendChild(formDiv);
    }

    updateSummary();
}

function updateSummary() {

    let multiplier = 1;

    if (selectedClass === "General") {
        multiplier = 0.25;
    }
    else if (selectedClass === "Sleeper") {
        multiplier = 1;
    }
    else if (selectedClass === "3AC") {
        multiplier = 1.5;
    }
    else if (selectedClass === "2AC") {
        multiplier = 2.5;
    }
    else if (selectedClass === "1AC") {
        multiplier = 4.5;
    }

    let finalFare = Math.round(baseFare * multiplier);

    if (selectedSeats.length === 0) {
        document.getElementById("seatListSummary").innerText = "None";
    } else {
        document.getElementById("seatListSummary").innerText = selectedSeats.length + " (" + selectedSeats.join(", ") + ")";
    }

    // Update base fare display so the math makes sense for the user
    document.getElementById("fare-label").innerText = selectedClass + " fare";
    document.getElementById("base-fare-display").innerText = "₹" + finalFare;
    document.getElementById("summaryClass").innerText = selectedClass;
    document.getElementById("totalFare").innerText = finalFare * selectedSeats.length;
}

function confirmBooking() {

    if (selectedSeats.length === 0) {
        alert("Please select seats");
        return;
    }

    let passengersText = "";
    let allFilled = true;

    selectedSeats.forEach(num => {
        const nameInput = document.getElementById("pass-name-" + num);
        const ageInput = document.getElementById("pass-age-" + num);
        if (!nameInput.value.trim() || !ageInput.value.trim()) {
            allFilled = false;
        }
        passengersText += `Seat ${num}: ${nameInput.value.trim()} (${ageInput.value.trim()})<br>`;
    });

    if (!allFilled) {
        alert("Please fill in all passenger details.");
        return;
    }

    document.getElementById("popupSeats").innerText =
        "Seats: " + selectedSeats.join(", ");

    document.getElementById("popupPassengers").innerHTML = passengersText;

    document.getElementById("popupClass").innerText =
        "Class: " + selectedClass;

    document.getElementById("popupFare").innerText =
        "Total Fare: ₹" + document.getElementById("totalFare").innerText;

    document.getElementById("popup").style.display = "flex";
}
function closePopup() {
    document.getElementById("popup").style.display = "none";
}