const Filter = ({ input }) => {
  const { label, value, name, onChange } = input
  return (
    <div>
      {label}
      <input value={value} name={name} onChange={onChange} />
    </div>
  )
}

export default Filter