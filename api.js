// 11329a68c70484de9078f50717a0d4b7

const getWeatherDate = async (city, latitude = 53.8, longitude = 27.56) => {
	try {
		const response = await fetch(
			`https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,daily&appid=11329a68c70484de9078f50717a0d4b7`,
		);

		return await response.json;
	} catch (error) {
		console.error(error);
	}
};
