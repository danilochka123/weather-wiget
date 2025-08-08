import { useState, useEffect } from "react";
import "./index.css";

function App() {
  const KEY = 'c03a70e7b95e43799a4111233250708'

  const [city, setCity] = useState('')
  const [weatherInfo, setWeatherInfo] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [coords, setCoords] = useState(null)

  useEffect(() => {
    if(!navigator.geolocation){
      setError('Geolocation is not supported by your browser')
      return
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
      console.log(position)
      const {latitude, longitude} = position.coords
      setCoords({latitude, longitude})
    },
      () => {
        setError('Failed to get your position')
    })
  }, [])

  useEffect(() => {
    if(!city.trim() && !coords){
      setError(null)
      setWeatherInfo(null)
      return
    }

    async function getWeatherInfo() {
      try {
        const query = city.trim() ? city : `${coords.latitude},${coords.longitude}`

        setLoading(true)
        const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${KEY}&q=${query}`)
        const weatherInfo = await response.json()

        if(weatherInfo.error){
          setError(weatherInfo.error.message)
          return
        }
        setError(null)
        setWeatherInfo(weatherInfo)
      } catch (error){
        setError(error.message)
        setWeatherInfo(null)
      } finally {
        setLoading(false)
      }
    }
    getWeatherInfo()
  },[city, coords])

  function getLoading() {
    return <p>Loading...</p>
  }

  function getError() {
    return <p>{error}</p>
  }

  function getWeatherInfo() {
    return (
      <div className="weather-card">
        <h2>{`${weatherInfo?.location?.name}, ${weatherInfo?.location?.country}`}</h2>
        <img src={`https:${weatherInfo?.current?.condition?.icon}`} alt="icon" className="weather-icon" />
        <p className="temperature">{`${Math.round(weatherInfo?.current?.temp_c)}°С`}</p>
        <p className="condition">{weatherInfo?.current?.condition?.text}</p>
        <div className="weather-details">
          <p>Humidity: {weatherInfo?.current?.humidity}%</p>
          <p>Wind: {weatherInfo?.current?.wind_kph} km/h</p>
        </div>

      </div>
    )}

  return (
    <div className="app">
      <div className="widget-container">
        <div className="weather-card-container">
          <h1 className="app-title">Weather Widget</h1>
          <div className="search-container">
            <input
              type="text"
              value={city}
              placeholder="Enter city name"
              className="search-input"
              onChange={(event) => setCity(event.target.value)}
            />
            {loading && getLoading()}
            {error && getError()}
            {!error && !loading && weatherInfo && getWeatherInfo()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
