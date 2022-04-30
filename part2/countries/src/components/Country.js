import { useState } from 'react'
import CountryInfo from './CountryInfo'

const Country = ({ country }) => {
  const [show, setShow] = useState(false)
  return (
    <>
      <div>
        {country.name.common}
        <button onClick={() => setShow(!show)}>{show ? 'hide' : 'show'}</button>
      </div>
      {show && <CountryInfo country={country} />}
    </>
  )
}

export default Country