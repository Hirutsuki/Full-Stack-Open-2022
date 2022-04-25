const Total = ({ parts }) => {
    let exercises = parts.map(part => part.exercises);
    let total = exercises.reduce((sum, exercise) => sum + exercise)
    return (
        <>
            <p>Number of exercises {total}</p>
        </>
    )
}

export default Total;