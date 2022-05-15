import Button from './Button'

const Buttons = ({ feedbacks }) => (
  <>
    {/* batch return components from array of objects in same format */}
    {feedbacks.map((feedback, index) => (
      <Button key={index} feedback={feedback} />
    ))}
  </>
)

export default Buttons