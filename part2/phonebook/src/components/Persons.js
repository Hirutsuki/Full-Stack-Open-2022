const Persons = ({ persons, handleDelete }) =>
  persons.map((person) => {
    const { name, number, id } = person
    return (
      <div key={id}>
        {name} {number}{' '}
        <button
          onClick={() => {
            window.confirm(`Delete ${name}?`) && handleDelete(id)
          }}>
          delete
        </button>
      </div>
    )
  })

export default Persons
