import { useState } from 'react'

const Anecdote = ({ anecdote, point }) => (
  <>
    <div>{anecdote}</div>
    <div>has {point} votes</div>
  </>
)

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients'
  ]

  const random = () => Math.floor(Math.random() * anecdotes.length)
  // display random quote as page (re)rendered
  const [selected, setSelected] = useState(random())
  // fill point-tracking array with 0
  const [points, setPoints] = useState(Array(anecdotes.length).fill(0))
  const handleVote = () => {
    const newPoints = [...points]
    newPoints[selected]++
    setPoints(newPoints)
  }

  const handleNext = () => {
    let newSelected = random()
    while (newSelected === selected) {
      newSelected = random()
    }
    setSelected(newSelected)
  }
  const totalPoint = points.reduce((sum, point) => sum + point)
  // find the largest point
  const max = Math.max.apply(this, points)
  // find the first index of the largest point
  const maxIndex = points.findIndex(point => point === max)

  return (
    <>
      <h1>Anecdote of the day</h1>
      <Anecdote anecdote={anecdotes[selected]} point={points[selected]} />
      <button onClick={handleVote}>vote</button>
      <button onClick={handleNext}>next anecdote</button>

      <h1>Anecdote with most votes</h1>
      {/* conditionally render best quote when at least 1 vote has been made */}
      {totalPoint > 0 && (
        <Anecdote anecdote={anecdotes[maxIndex]} point={points[maxIndex]} />
      )}
    </>
  )
}

export default App