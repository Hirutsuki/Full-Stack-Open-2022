import { useState, useEffect } from 'react'
import axios from 'axios'
import CountryInfo from './components/CountryInfo'
import Country from './components/Country'
import Weather from './components/Weather'

const App = () => {
  const [countries, setCountries] = useState([])
  const [query, setQuery] = useState('')

  const hook = () => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => setCountries(response.data))
  }
  useEffect(hook, [])

  const handleQuery = event => {
    setQuery(event.target.value)
  }

  const filtered = countries.filter(country =>
    country.name.common.toUpperCase().match(query.toUpperCase())
  )

  const display = countries => {
    const len = countries.length
    if (query && len) {
      if (len === 1) {
        return (
          <>
            <CountryInfo country={countries[0]} />
            <Weather city={countries[0].capital} />
          </>
        )
      } else if (len < 10) {
        return countries.map((country, index) => (
          <Country key={index} country={country} />
        ))
      } else {
        return <div>Too many matches, specify another filter</div>
      }
    }
  }

  return (
    <>
      <div>
        find countries <input value={query} onChange={handleQuery} />
      </div>
      {display(filtered)}
    </>
  )
}

export default App