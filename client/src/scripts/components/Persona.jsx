import React from 'react'
import PropTypes from 'prop-types'

export default function Persona(props) {
  const { city, device, avatar, handleSearchParamChange, ...options } = props

  return (
    <label className="persona">
      <input
        type="radio"
        name="persona"
        value={city}
        onChange={() =>
          handleSearchParamChange({
            ...options,
          })
        }
      />
      <img src={`assets/images/${avatar}.svg`} />
      <span>
        {city} - {device}
      </span>
    </label>
  )
}

Persona.propTypes = {
  avatar: PropTypes.string.isRequired,
  city: PropTypes.string.isRequired,
  ip: PropTypes.string.isRequired,
  device: PropTypes.string.isRequired,
  userAgent: PropTypes.string.isRequired,
  handleSearchParamChange: PropTypes.func.isRequired,
}
