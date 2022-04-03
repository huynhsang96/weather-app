let key = "9d7979d375f8bfd5645ef5d25219330d";
let endPoint;
const wrapper = document.querySelector(".wrapper");
const inputPart = document.querySelector(".input-part");
const infoTxt = document.querySelector(".info-txt");
const input = document.querySelector(".input-city");
const locationBtn = document.querySelector(".btn-city");
const backInput = document.querySelector("header i");
let inputValue = "";

input.addEventListener("keyup", function (e) {
	if (e.key == "Enter" && input.value != "") {
		requestApi(input.value);
		wrapper.classList.add("is-loading");
	}
});

input.addEventListener("change", function (e) {
	inputValue = e.target.value;
});

locationBtn.addEventListener("click", () => {
	if (navigator.geolocation && inputValue === "") {
		navigator.geolocation.getCurrentPosition(onSuccess, onError);
		wrapper.classList.add("is-loading");
	} else {
		requestApi(inputValue);
		wrapper.classList.add("is-loading");
	}
});

function onSuccess(position) {
	const { latitude, longitude } = position.coords;
	endPoint = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&units=metric&lon=${longitude}&appid=${key}`;
	fetchData();
}

function onError(error) {
	infoTxt.innerText = error.message;
	infoTxt.classList.add("error");
}

function requestApi(city) {
	endPoint = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${key}`;
	fetchData();
}

// Hàm này chỉ để fectch dữ liệu từ API
async function fetchData() {
	infoTxt.innerText = "Getting Weather Data...";
	infoTxt.classList.add("pending");
	const response = await fetch(endPoint);
	const data = await response.json();
	wetherDetails(data);
}

// lấy dữ liệu để render ra giao diện
function wetherDetails(infor) {
	if (infor.cod === "404") {
		infoTxt.innerText = `${input.value} is not a city`;
		infoTxt.classList.remove("pending");
		infoTxt.classList.add("error");
		wrapper.classList.remove("is-loading");
	} else {
		const city = infor.name;
		const country = infor.sys.country;
		const { description, icon, id, main } = infor.weather[0];
		const { feels_like, humidity, temp } = infor.main;

		infoTxt.classList.remove("pending", "error");
		wrapper.classList.add("active");

		document.querySelector(".temp-numb").innerText = Math.floor(temp);
		document.querySelector(".weather").innerText = description.toUpperCase();
		document.querySelector(".location-city").innerText = `${city}, ${country}`;
		document.querySelector(".temp-numb-2").innerText = Math.floor(feels_like);
		document.querySelector(".humidity").innerText = `${humidity}%`;
		document.querySelector(
			".weather-icon"
		).src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
	}
	console.log(infor);
}

backInput.addEventListener("click", () => {
	infoTxt.classList.remove("pending", "error");
	wrapper.classList.remove("active");
	infoTxt.innerText = "Please enter a valid city name";
	wrapper.classList.remove("is-loading");
	input.value = "";
	input.focus();
});
