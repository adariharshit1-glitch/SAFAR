let selectedSeats = [];
let baseFare = 0;
let selectedClass = "Sleeper"; // default class

const data = JSON.parse(localStorage.getItem("selectedTrain"));
const searchData = JSON.parse(localStorage.getItem("searchData"));

document.getElementById("trainInfo").innerText =
    data.train.train_name + " (" + searchData.from + " → " + searchData.to + ")";

baseFare = data.fare;

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
        selectedSeats = selectedSeats.filter(function(s) {
            return s != num;
        });

        seat.classList.remove("selected");
    } else {
        selectedSeats.push(num);
        seat.classList.add("selected");
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

    let finalFare = baseFare * multiplier;

    if (selectedSeats.length === 0) {
        document.getElementById("seatList").innerText = "None";
    } else {
        document.getElementById("seatList").innerText = selectedSeats.join(", ");
    }
    document.getElementById("totalFare").innerText =
        finalFare * selectedSeats.length;
}

function confirmBooking() {

    if (selectedSeats.length === 0) {
        alert("Please select seats");
        return;
    }

    document.getElementById("popupSeats").innerText =
        "Seats: " + selectedSeats.join(", ");

    document.getElementById("popupClass").innerText =
        "Class: " + selectedClass;

    document.getElementById("popupFare").innerText =
        "Total Fare: ₹" + document.getElementById("totalFare").innerText;

    document.getElementById("popup").style.display = "flex";
}
function closePopup() {
    document.getElementById("popup").style.display = "none";
}