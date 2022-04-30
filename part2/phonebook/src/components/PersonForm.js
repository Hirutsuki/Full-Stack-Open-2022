const PersonForm = ({ onSubmit, inputs }) => (
  <form onSubmit={onSubmit}>
    {inputs.map((input) => {
      const { label, value, name, onChange } = input
      return (
        <div key={name}>
          {label}
          <input value={value} name={name} onChange={onChange} required />
        </div>
      )
    })}
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)

export default PersonForm