let name = document.getElementById("name");
let nextBtn = document.getElementById("nextBtn");

let step1 = document.getElementById("step1");
let step2 = document.getElementById("step2");

let userName = document.getElementById("userName");

let password = document.getElementById("password");
let loginBtn = document.getElementById("loginBtn");

let backBtn = document.getElementById("backBtn");

let showPass = document.getElementById("showPass");

name.addEventListener("keyup", () => {
    nextBtn.disabled = name.value === "";
});

nextBtn.onclick = () => {
    step1.classList.remove("active");
    step2.classList.add("active");
    userName.innerText = name.value;
};

backBtn.onclick = () => {
    step2.classList.remove("active");
    step1.classList.add("active");
};

let agree = document.getElementById("agree");

function validateLogin() {
    if (password.value !== "" && agree.checked) {
        loginBtn.disabled = false;
    } else {
        loginBtn.disabled = true;
    }
}

password.addEventListener("keyup", validateLogin);
agree.addEventListener("change", validateLogin);

showPass.addEventListener("change", () => {
    password.type = showPass.checked ? "text" : "password";
    password.focus();
});