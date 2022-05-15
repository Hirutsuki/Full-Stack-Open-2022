import Header from './Header'
import Content from './Content'
import Total from './Total'

const Course = ({ course }) => {
  const { name, parts } = course

  const total = parts => {
    const exercises = parts.map(part => part.exercises)
    return exercises.reduce((sum, exercise) => sum + exercise)
  }

  return (
    <>
      <Header name={name} />
      <Content parts={parts} />
      <Total total={total(parts)} />
    </>
  )
}

export default Course