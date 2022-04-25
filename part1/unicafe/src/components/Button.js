const Button = ({ feedback }) => {
    const { text, count, setCount, score } = feedback
    
    const handleClick = (feedback) => () => {
        setCount(count + 1)
        // get prototypical method and property
        feedback.setScore(feedback.totalScore + score)
    }

    return <button onClick={handleClick(feedback)}>{text}</button>
}

export default Button