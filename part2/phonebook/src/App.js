import { useState, useEffect } from 'react'
import personService from './services/persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  useEffect(() => {
    personService.getAll().then(initialPersons => setPersons(initialPersons))
  }, [])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const [message, setMessage] = useState({})
  const notify = (type, content) => {
    setMessage({ type, content })
    setTimeout(() => setMessage({}), 3000)
  }

  const nameCapitalise = name =>
    name
      .split(' ')
      .map(name => name.slice(0, 1).toUpperCase() + name.slice(1).toLowerCase())
      .join(' ')

  const addPerson = event => {
    event.preventDefault()

    const newPerson = {
      name: nameCapitalise(newName),
      number: newNumber
    }

    const foundMatch = persons.find(person => person.name === newPerson.name)
    if (foundMatch) {
      if (
        window.confirm(
          `${newPerson.name} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        updatePerson(foundMatch.id, newPerson)
      }
    } else {
      createPerson(newPerson)
    }
    setNewName('')
    setNewNumber('')
  }

  const createPerson = newPerson => {
    personService
      .create(newPerson)
      .then(createdPerson => {
        setPersons(persons.concat(createdPerson))
        notify('passed', `Added ${newPerson.name}`)
      })
      .catch(error => {
        const err = error.response.data.error
        if (err === 'existed name') {
          setMessage({
            type: 'error',
            content: `${newPerson.name} already in the phonebook, please refresh`
          })
        } else {
          notify('error', err)
        }
      })
  }

  const updatePerson = (id, newPerson) => {
    personService
      .update(id, newPerson)
      .then(returnedPerson => {
        setPersons(
          persons.map(person => (person.id !== id ? person : returnedPerson))
        )
        notify('passed', `Updated ${newPerson.name}'s number`)
      })
      .catch(error => {
        const data = error.response.data
        if (data === 'inexistent') {
          setMessage({
            type: 'error',
            content: `Information of ${newPerson.name} has already been removed from the server`
          })
          setPersons(persons.filter(person => person.id !== id))
        } else {
          notify('error', data.error)
        }
      })
  }

  const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService
        .deleteById(id)
        .then(setPersons(persons.filter(person => person.id !== id && person)))
      notify('passed', `Deleted ${name}`)
    }
  }

  const [query, setQuery] = useState('')

  const handleInput = event => {
    // concatenate the string to dynamically call the state setting method
    eval(`set${event.target.name}(event.target.value)`)
  }

  class Input {
    constructor(label, value, name) {
      this.label = label
      this.value = value
      this.name = name
    }
  }
  // create array of similar input object to map to input element
  const inputs = [
    new Input('filter shown with ', query, 'Query'),
    new Input('name: ', newName, 'NewName'),
    new Input('number: ', newNumber, 'NewNumber')
  ]
  // add event handler for all input object as onChange property
  inputs.map(input => Object.assign(input, { onChange: handleInput }))
  const [queryInput, nameInput, numberInput] = inputs

  const filtered = persons.filter(person => {
    return person.name.toUpperCase().startsWith(query.toUpperCase())
  })

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <Filter input={queryInput} />
      <h3>Add a new</h3>
      <PersonForm onSubmit={addPerson} inputs={[nameInput, numberInput]} />
      <h3>Numbers</h3>
      <Persons persons={filtered} handleDelete={deletePerson} />
    </div>
  )
}

export default App