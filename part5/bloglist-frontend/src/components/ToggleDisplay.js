import { useState, forwardRef, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'

const ToggleDisplay = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility
    }
  })

  return (
    <>
      <div style={{ display: visible ? 'none' : '' }}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={{ display: visible ? '' : 'none' }}>
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </>
  )
})

ToggleDisplay.propTypes = {
  buttonLabel: PropTypes.string.isRequired
}

ToggleDisplay.displayName = 'ToggleDisplay'

export default ToggleDisplay