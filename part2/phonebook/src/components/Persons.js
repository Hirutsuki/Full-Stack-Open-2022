const Persons = ({ persons, handleDelete }) =>
  persons.map(person => {
    const { name, number, id } = person
    return (
      <div key={id}>
        {name} {number}
        <button onClick={() => handleDelete(id, name)}>delete</button>
      </div>
    )
  })

export default Persons