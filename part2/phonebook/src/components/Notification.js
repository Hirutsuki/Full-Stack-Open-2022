const Notification = ({ message }) => {
  const basicStyle = {
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }

  return (
    Object.values(message).length > 0 && (
      <div
        style={
          message.type === 'error'
            ? { color: 'red', ...basicStyle }
            : { color: 'green', ...basicStyle }
        }>
        {message.content}
      </div>
    )
  )
}

export default Notification
