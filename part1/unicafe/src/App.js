import { useState } from 'react'
import Buttons from './components/Buttons'
import Statistics from './components/Statistics'

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [score, setScore] = useState(0)
  // create class for objects with same format
  class Feedback {
    constructor(text, count, setCount, score) {
      this.text = text
      this.count = count
      this.setCount = setCount
      this.score = score
    }
  }
  // create array of feedback objects for performing array methods
  const feedbacks = [
    new Feedback('good', good, setGood, 1),
    new Feedback('neutral', neutral, setNeutral, 0),
    new Feedback('bad', bad, setBad, -1)
  ]
  // prototypical property and method for shared data (score of all feedbacks and its accumulating method)
  Feedback.prototype.totalScore = score
  Feedback.prototype.setScore = setScore

  return (
    // fragments as root element
    <>
      <h1>give feedback</h1>
      <Buttons feedbacks={feedbacks} />
      <h1>statistics</h1>
      <Statistics feedbacks={feedbacks} />
    </>
  )
}

export default App