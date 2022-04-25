import Button from "./Button"

const Buttons = ({ feedbacks }) => (
    <>
        {/* batch return components from array of objects in same format */}
        {feedbacks.map((feedback, index) => <Button feedback={feedback} key={index} />)}
    </>
)

export default Buttons