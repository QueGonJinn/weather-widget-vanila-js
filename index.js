const options = {
	enableHighAccuracy: true,
	timeout: 5000,
	maximumAge: 0,
};

const days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];
const daysM = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];

const month = [
	'Января',
	'Февраля',
	'Марта',
	'Апреля',
	'Мая',
	'Июня',
	'Июля',
	'Августа',
	'Сентября',
	'Октября',
	'Ноября',
	'Декабря',
];

const directionOfWind = (degree) => {
	if (degree > 337.5) {
		return 'Северное';
	}
	if (degree > 295.5) {
		return 'Северо-западное';
	}
	if (degree > 247.5) {
		return 'Западное';
	}
	if (degree > 202.5) {
		return 'Юго-западное';
	}
	if (degree > 157.5) {
		return 'Южное';
	}
	if (degree > 122.5) {
		return 'Юго-восточное';
	}
	if (degree > 67.5) {
		return 'Восточное';
	}
	if (degree > 22.5) {
		return 'Северо-восточное';
	}
	return 'Северное';
};

class DayilyCard {
	constructor(e, parrentSelector) {
		this.daily = e.dt;
		this.dayTemp = e.temp.day;
		this.nightTemp = e.temp.night;
		this.dayInfo = e.weather[0].description;
		this.icon = e.weather[0].icon;
		this.humidity = e.humidity;
		this.wind = e.wind_speed;
		this.direction = e.wind_deg;
		this.pressure = e.pressure;
		this.clouds = e.clouds;
		this.sunrise = e.sunrise;
		this.sunset = e.sunset;
		this.parrent = document.querySelector(parrentSelector);
	}

	render() {
		const elem = document.createElement('div');
		elem.classList.add('weather__week__days');

		elem.innerHTML = `
				<div class="day__wrapper">
						<span class="day__name">${daysM[new Date(this.daily * 1000).getDay()]}</span>
						<div class="currentday__temperature-wrapper">
							<span class="day__temp">${Math.round(this.dayTemp * 10) / 10}</span>
							<span class="day__separator">o</span>
							<span class="day__units">C</span>
						</div>
						<div class="day__img">
							<img src=https://openweathermap.org/img/wn/${this.icon}@2x.png alt="day__icon" />
						</div>
				</div>
		`;
		this.parrent.append(elem);
	}
}

const currentDateDay = document.querySelector('.current__day');
const currentCity = document.querySelector('.current__location');
const currentTemp = document.querySelector('.current__temp');
const currentIcon = document.querySelector('.current__img img');
const currentDayInfo = document.getElementById('current__date_param');
const currentPressure = document.getElementById('current__pressure_param');
const currentHumidity = document.getElementById('current__humidity_param');
const currentWind = document.getElementById('current__wind_param');
const currentDirection = document.getElementById('current__wind_degree_param');
const currentFeelsLike = document.querySelector('.current__feels__like');

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

		currentCity.innerHTML = cityData.features[0].properties.city;
		currentDateDay.innerHTML = `${days[new Date(weather.current.dt * 1000).getDay() - 1]}`;
		currentTemp.innerHTML = Math.round(weather.current.temp * 10) / 10;
		currentIcon.setAttribute(
			'src',
			`https://openweathermap.org/img/wn/${weather.current.weather[0].icon}@2x.png`,
		);
		currentDayInfo.innerHTML = weather.current.weather[0].description;

		currentPressure.innerHTML = `${weather.current.pressure} мм.рт.ст`;
		currentHumidity.innerHTML = `${weather.current.humidity} %`;
		currentWind.innerHTML = `${weather.current.wind_speed} м/с`;
		currentDirection.innerHTML = directionOfWind(weather.current.wind_deg);
		currentFeelsLike.innerHTML = Math.round(weather.current.feels_like * 10) / 10;

		weather.daily.forEach((e, i) => {
			if (i < 6) {
				new DayilyCard(e, '.weather__week').render();
			}
		});

		console.log(cityData);
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

		currentCity.innerHTML = cityData.features[0].properties.city;
		currentDateDay.innerHTML = `${days[new Date(weather.current.dt * 1000).getDay() - 1]}`;
		currentTemp.innerHTML = Math.round(weather.current.temp * 10) / 10;
		currentIcon.setAttribute(
			'src',
			`https://openweathermap.org/img/wn/${weather.current.weather[0].icon}@2x.png`,
		);
		currentDayInfo.innerHTML = weather.current.weather[0].description;
		currentPressure.innerHTML = `${weather.current.pressure} мм.рт.ст`;
		currentHumidity.innerHTML = `${weather.current.humidity} %`;
		currentWind.innerHTML = `${weather.current.wind_speed} м/с`;
		currentDirection.innerHTML = directionOfWind(weather.current.wind_deg);
		currentFeelsLike.innerHTML = Math.round(weather.current.feels_like * 10) / 10;

		weather.daily.forEach((e, i) => {
			if (i < 6) {
				new DayilyCard(e, '.weather__week').render();
			}
		});

		console.log(cityData);
		console.log(weather);
	};

	app();
}

navigator.geolocation.getCurrentPosition(success, error, options);
