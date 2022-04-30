import { useState, useEffect } from 'react'
import axios from 'axios'

const Weather = ({ city }) => {
  const [weather, setWeather] = useState({})
  const hook = () => {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.REACT_APP_API_KEY}`
      )
      .then((response) => setWeather(response.data))
  }
  useEffect(hook, [city])
  return (
    <>
      <h3>Weather in {city}</h3>
      {weather.hasOwnProperty('main') && (
        <>
          <div>temperature {weather.main.temp} Celcius</div>
          <img
            src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={`${city} weather`}
          />
          <div>wind {weather.wind.speed} m/s</div>
        </>
      )}
    </>
  )
}

export default Weather
