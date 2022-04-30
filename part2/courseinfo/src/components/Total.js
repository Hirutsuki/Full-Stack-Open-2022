const Total = ({ parts }) => {
  let exercises = parts.map((part) => part.exercises)
  let total = exercises.reduce((sum, exercise) => sum + exercise)
  return (
    <>
      <p>
        <b>total of {total} exercises</b>
      </p>
    </>
  )
}

export default Total