const options = {
	enableHighAccuracy: true,
	timeout: 5000,
	maximumAge: 0,
};

const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
const daysM = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];

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
		this.dayTemp = e.temp.max;
		this.nightTemp = e.temp.min;

		this.icon = e.weather[0].icon;

		this.parrent = document.querySelector(parrentSelector);
	}

	render() {
		const elem = document.createElement('div');
		elem.classList.add('weather__week__days');

		elem.innerHTML = `
			<div class="day__wrapper">
							<span class="day__name">${daysM[new Date(this.daily * 1000).getDay()]}</span>
							<div class="currentday__temperature-wrapper">
									<span class="day__temp">${
										this.dayTemp > 0 ? `+${Math.round(this.dayTemp)}` : Math.round(this.dayTemp)
									}</span>
							</div>
							<div class="currentday__temperature-wrapper">
									<span class="day__temp">${
										this.nightTemp > 0
											? `+${Math.round(this.nightTemp)}`
											: Math.round(this.nightTemp)
									}</span>
							</div>
							<div class="day__img">
									<img src=https://openweathermap.org/img/wn/${this.icon}@2x.png alt="day__icon" />
							</div>
			</div>
    `;
		this.parrent.append(elem);
	}
}

class HourlyCard {
	constructor(e, parrentSelector) {
		this.daily = e.dt;
		this.dayTemp = e.temp;
		this.parrent = document.querySelector(parrentSelector);
	}

	render() {
		const elem = document.createElement('div');
		elem.classList.add('hourly__items');

		elem.innerHTML = `
			<div class="hourly__wrapper">
					<div class="hourly__name">
					<span class="hourly__item">${new Date(this.daily * 1000).getHours()}</span>
					<span class="hourly__sep">ч</span>
					</div>
							<div class="currentday__temperature-wrapper">
									<span class="day__temp">${
										this.dayTemp > 0 ? `+${Math.round(this.dayTemp)}` : Math.round(this.dayTemp)
									}</span>
																										
							</div>
			</div>
		`;
		this.parrent.append(elem);
	}
}

const checkLocation = document.getElementById('check__location');
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
const preload = document.querySelector('.preload');

const appFirst = async () => {
	const cityIP = await fetch(
		`https://api.geoapify.com/v1/ipinfo?lang=ru&apiKey=5f52dceecbd046de9e150000ef5a2f4e`,
	);
	const cityIpData = await cityIP.json();

	const city = await fetch(
		`https://api.geoapify.com/v1/geocode/reverse?lat=${cityIpData.location.latitude}&lon=${cityIpData.location.longitude}&lang=ru&apiKey=5f52dceecbd046de9e150000ef5a2f4e`,
	);

	const cityData = await city.json();

	const getWeatherDate = async (latitude, longitude) => {
		try {
			const response = await fetch(
				`https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely&appid=11329a68c70484de9078f50717a0d4b7&units=metric&lang=ru`,
			).then((res) => res.json());

			return response;
		} catch (error) {
			console.error(error);
		}
	};

	const weather = await getWeatherDate(cityIpData.location.latitude, cityIpData.location.longitude);

	currentCity.innerHTML = cityData.features[0].properties.county;
	currentDateDay.innerHTML = ` ${days[new Date(weather.current.dt * 1000).getDay()]}`;
	currentTemp.innerHTML =
		weather.current.temp > 0
			? `+${Math.round(weather.current.temp)}`
			: Math.round(weather.current.temp);
	currentIcon.setAttribute(
		'src',
		`https://openweathermap.org/img/wn/${weather.current.weather[0].icon}@2x.png`,
	);
	currentDayInfo.innerHTML = weather.current.weather[0].description;

	currentPressure.innerHTML = ` ${weather.current.pressure} мм.рт.ст`;
	currentHumidity.innerHTML = ` ${weather.current.humidity} %`;
	currentWind.innerHTML = ` ${Math.round(weather.current.wind_speed * 10) / 10} м/с`;
	currentDirection.innerHTML = directionOfWind(weather.current.wind_deg);
	currentFeelsLike.innerHTML =
		weather.current.feels_like > 0
			? `+${Math.round(weather.current.feels_like)}`
			: Math.round(weather.current.feels_like);
	if (currentIcon.getAttribute('src') !== 0) {
		preload.setAttribute('style', 'visibility: hidden');
	}

	weather.daily.forEach((e, i) => {
		if (i < 6 && i !== 0) {
			new DayilyCard(e, '.weather__week').render();
		}
	});

	weather.hourly.forEach((e, i) => {
		if (i < 15 && i !== 0 && i % 2 === 0) {
			new HourlyCard(e, '.weather__hourly').render();
		}
	});

	console.log(cityData);
	console.log(weather);
	console.log(cityIpData);
};

appFirst();

checkLocation.addEventListener('click', () => {
	const wetherHoyrly = document.querySelector('.weather__hourly');
	const weatherWeek = document.querySelector('.weather__week');
	wetherHoyrly.innerHTML = '';
	weatherWeek.innerHTML = '';

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
			currentDateDay.innerHTML = ` ${days[new Date(weather.current.dt * 1000).getDay()]}`;
			currentTemp.innerHTML =
				weather.current.temp > 0
					? `+${Math.round(weather.current.temp)}`
					: Math.round(weather.current.temp);
			currentIcon.setAttribute(
				'src',
				`https://openweathermap.org/img/wn/${weather.current.weather[0].icon}@2x.png`,
			);
			currentDayInfo.innerHTML = weather.current.weather[0].description;

			currentPressure.innerHTML = ` ${weather.current.pressure} мм.рт.ст`;
			currentHumidity.innerHTML = ` ${weather.current.humidity} %`;
			currentWind.innerHTML = ` ${Math.round(weather.current.wind_speed * 10) / 10} м/с`;
			currentDirection.innerHTML = directionOfWind(weather.current.wind_deg);
			currentFeelsLike.innerHTML =
				weather.current.feels_like > 0
					? `+${Math.round(weather.current.feels_like)}`
					: Math.round(weather.current.feels_like);
			if (currentIcon.getAttribute('src') !== 0) {
				preload.setAttribute('style', 'visibility: hidden');
			}

			weather.daily.forEach((e, i) => {
				if (i < 6 && i !== 0) {
					new DayilyCard(e, '.weather__week').render();
				}
			});

			weather.hourly.forEach((e, i) => {
				if (i < 15 && i !== 0 && i % 2 === 0) {
					new HourlyCard(e, '.weather__hourly').render();
				}
			});
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
			currentDateDay.innerHTML = `${days[new Date(weather.current.dt * 1000).getDay()]}`;
			currentTemp.innerHTML =
				weather.current.temp > 0
					? `+${Math.round(weather.current.temp)}`
					: Math.round(weather.current.temp);
			currentIcon.setAttribute(
				'src',
				`https://openweathermap.org/img/wn/${weather.current.weather[0].icon}@2x.png`,
			);
			currentDayInfo.innerHTML = weather.current.weather[0].description;
			currentPressure.innerHTML = `${weather.current.pressure} мм.рт.ст`;
			currentHumidity.innerHTML = `${weather.current.humidity} %`;
			currentWind.innerHTML = ` ${Math.round(weather.current.wind_speed * 10) / 10} м/с`;
			currentDirection.innerHTML = directionOfWind(weather.current.wind_deg);
			currentFeelsLike.innerHTML =
				weather.current.feels_like > 0
					? `+${Math.round(weather.current.feels_like)}`
					: Math.round(weather.current.feels_like);

			if (currentIcon.getAttribute('src') !== 0) {
				preload.setAttribute('style', 'visibility: hidden');
			}

			weather.daily.forEach((e, i) => {
				if (i < 6 && i !== 0) {
					new DayilyCard(e, '.weather__week').render();
				}
			});

			weather.hourly.forEach((e, i) => {
				if (i < 15 && i !== 0 && i % 2 === 0) {
					new HourlyCard(e, '.weather__hourly').render();
				}
			});
		};

		app();
	}

	navigator.geolocation.getCurrentPosition(success, error, options);
});
