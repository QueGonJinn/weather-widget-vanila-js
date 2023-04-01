const options = {
	enableHighAccuracy: true,
	timeout: 5000,
	maximumAge: 0,
};

const days = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];

const currentTemperature = document.getElementById('current__temperature');
const currentInfo = document.getElementById('current__info');
const currentPressure = document.getElementById('current__pressure');
const currentHumidity = document.getElementById('current__humidity');
const currentFeelsLike = document.getElementById('current__feels__like');
const currentWind = document.getElementById('current__wind');
const currentDirection = document.getElementById('current__direction');
const currentIcon = document.getElementById('current__img');
const cityWrapper = document.querySelector('.weather__city');

const directionOfWind = (degree) => {
	if (degree > 337.5) {
		return 'С';
	}
	if (degree > 295.5) {
		return 'СЗ';
	}
	if (degree > 247.5) {
		return 'З';
	}
	if (degree > 202.5) {
		return 'ЮЗ';
	}
	if (degree > 157.5) {
		return 'Ю';
	}
	if (degree > 122.5) {
		return 'ЮВ';
	}
	if (degree > 67.5) {
		return 'В';
	}
	if (degree > 22.5) {
		return 'СВ';
	}
	return 'северный';
};

class HourlyCard {
	constructor(e, parrentSelector) {
		this.hourly = e.dt;
		this.temperature = e.temp;
		this.parrent = document.querySelector(parrentSelector);
	}

	render() {
		const elem = document.createElement('div');
		elem.classList.add('weather__hourly-item');

		elem.innerHTML = `				
					<div class="hourly">${new Date(this.hourly * 1000).getHours()} ч</div>
					<div class="hourly__temperature">
						<span>${Math.round(this.temperature * 10) / 10}</span>
						<span class="text_hourly">o</span>
					</div>				
		`;

		this.parrent.append(elem);
	}
}

class DayilyCard {
	constructor(e, parrentSelector) {
		this.dayli = e.dt;
		this.tMin = e.feels_like.night;
		this.tMax = e.feels_like.day;
		this.src = e.weather[0].icon;
		this.parrent = document.querySelector(parrentSelector);
	}

	render() {
		const elem = document.createElement('div');
		elem.classList.add('weather__daily-item');

		elem.innerHTML = `
					<div class="hourly">${days[new Date(this.dayli * 1000).getDay()]}</div>
					<div class="hourly__temperature">
							<span>${Math.round(this.tMin * 10) / 10}</span>
							<span class="text_hourly">o</span>
					</div>
					<div class="hourly__temperature">
							<span>${Math.round(this.tMax * 10) / 10}</span></span>
							<span class="text_hourly">o</span>
					</div>
					<img src=https://openweathermap.org/img/wn/${this.src}@2x.png alt="daily_icon" />					
		`;

		this.parrent.append(elem);
	}
}

function success(pos) {
	const crd = pos.coords;

	const getWeatherDate = async (latitude = 53.89, longitude = 27.56) => {
		try {
			const response = await fetch(
				`https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely&appid=11329a68c70484de9078f50717a0d4b7&units=metric&lang=ru`,
			).then((res) => res.json());

			return response;
		} catch (error) {
			console.error(error);
		}
	};

	const app = async () => {
		const weather = await getWeatherDate(crd.latitude, crd.longitude);

		const city = await fetch(
			`https://api.geoapify.com/v1/geocode/reverse?lat=${crd.latitude}&lon=${crd.longitude}&lang=ru&apiKey=5f52dceecbd046de9e150000ef5a2f4e`,
		);

		const cityData = await city.json();
		console.log(cityData);

		console.log(city);

		cityWrapper.innerHTML = cityData.features[0].properties.city;
		currentTemperature.innerHTML = Math.round(weather.current.temp * 10) / 10;
		currentInfo.innerHTML = weather.current.weather[0].description;
		currentPressure.innerHTML = weather.current.pressure;
		currentHumidity.innerHTML = weather.current.humidity;
		currentFeelsLike.innerHTML = Math.round(weather.current.feels_like * 10) / 10;
		currentWind.innerHTML = weather.current.wind_speed;
		currentDirection.innerHTML = directionOfWind(weather.current.wind_deg);

		currentIcon.setAttribute(
			'src',
			`https://openweathermap.org/img/wn/${weather.current.weather[0].icon}@2x.png`,
		);

		weather.hourly.forEach((e, i) => {
			if (i % 2 === 0 && i < 10) {
				new HourlyCard(e, '.weather__hourly').render();
			}
		});

		weather.daily.forEach((e, i) => {
			if (i < 5) {
				new DayilyCard(e, '.weather__daily').render();
			}
		});

		console.log(weather);
	};

	app();
}

function error(err) {
	const latitude = 53.89;
	const longitude = 27.56;
	console.warn(`ERROR(${err.code}): ${err.message}`);
	const getWeatherDate = async (latitude = 53.89, longitude = 27.56) => {
		try {
			const response = await fetch(
				`https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely&appid=11329a68c70484de9078f50717a0d4b7&units=metric&lang=ru`,
			).then((res) => res.json());

			return response;
		} catch (error) {
			console.error(error);
		}
	};

	const app = async () => {
		const weather = await getWeatherDate();

		const city = await fetch(
			`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&lang=ru&apiKey=5f52dceecbd046de9e150000ef5a2f4e`,
		);

		const cityData = await city.json();

		cityWrapper.innerHTML = cityData.features[0].properties.city;
		currentTemperature.innerHTML = Math.round(weather.current.temp * 10) / 10;
		currentInfo.innerHTML = weather.current.weather[0].description;
		currentPressure.innerHTML = weather.current.pressure;
		currentHumidity.innerHTML = weather.current.humidity;
		currentFeelsLike.innerHTML = Math.round(weather.current.feels_like * 10) / 10;
		currentWind.innerHTML = weather.current.wind_speed;
		currentDirection.innerHTML = directionOfWind(weather.current.wind_deg);

		currentIcon.setAttribute(
			'src',
			`https://openweathermap.org/img/wn/${weather.current.weather[0].icon}@2x.png`,
		);

		weather.hourly.forEach((e, i) => {
			if (i % 2 === 0 && i < 10) {
				new HourlyCard(e, '.weather__hourly').render();
			}
		});

		weather.daily.forEach((e, i) => {
			if (i < 5) {
				new DayilyCard(e, '.weather__daily').render();
			}
		});

		console.log(weather);
	};

	app();
}

navigator.geolocation.getCurrentPosition(success, error, options);
