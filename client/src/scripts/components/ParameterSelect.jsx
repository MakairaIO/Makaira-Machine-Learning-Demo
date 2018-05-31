import React from 'react'
import PropTypes from 'prop-types'

export default function ParameterSelect({ title, options, value, onChange }) {
  return (
    <label>
      {title}:
      <select value={value} onChange={onChange}>
        {options.map(o => (
          <option key={o.id ? o.id : o} value={o.id ? o.id : o}>
            {o.title ? o.title : o}
          </option>
        ))}
      </select>
    </label>
  )
}

ParameterSelect.propTypes = {
  title: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}
