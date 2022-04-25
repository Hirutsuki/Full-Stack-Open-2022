import StatisticLine from './StatisticLine'

const Statistics = ({ feedbacks }) => {
    // get array of only the counts
    const counts = feedbacks.map(feedback => feedback.count)
    // reduce counts array to a sum
    const totalCount = counts.reduce((sum, count) => sum + count)
    const [good] = feedbacks
    // get prototypical property
    const average = good.totalScore / totalCount
    const positive = (good.count / totalCount) * 100 + " %"
    
    return (
        // ternary operator for conditional rendering
        totalCount ?
            <table><tbody>
                {/* added index as key to fix error for simpler project */}
                {feedbacks.map((feedback, index) => <StatisticLine text={feedback.text} value={feedback.count} key={index} />)}
                {/* StatisticLine serve as display template */}
                <StatisticLine text="all" value={totalCount} />
                <StatisticLine text="average" value={average} />
                <StatisticLine text="positive" value={positive} />
            </tbody></table> :
            <p>No feedback given</p>
    )
}

export default Statistics