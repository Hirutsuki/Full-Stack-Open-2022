const LoginForm = ({ handleLogin, loginInputs }) => (
  <form onSubmit={handleLogin}>
    {loginInputs.map((input, index) => {
      const { label, type, value, name, onChange } = input
      return (
        <div key={index}>
          {label}
          <input id={label} type={type} value={value} name={name} onChange={onChange} />
        </div>
      )
    })}
    <button type="submit">login</button>
  </form>
)

export default LoginForm