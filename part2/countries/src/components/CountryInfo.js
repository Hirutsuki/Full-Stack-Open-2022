const CountryInfo = ({ country }) => {
  const { name, capital, population, languages, flags } = country
  return (
    <>
      <h2>{name.common}</h2>
      <div>capital {capital}</div>
      <div>population {population}</div>
      <h4>Spoken languages</h4>
      <ul>
        {Object.values(languages).map((language, index) => (
          <li key={index}>{language}</li>
        ))}
      </ul>
      <img src={flags.png} width="150" alt={`${name.common} flag`} />
    </>
  )
}

export default CountryInfo