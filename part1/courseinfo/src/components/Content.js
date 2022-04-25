import Part from "./Part";

const Content = ({ parts }) => (
        <>
            {parts.map(part => <Part part={part} />)}
        </>
    )

export default Content;