import React from 'react'
import PropTypes from 'prop-types'

export default function Persona(props) {
  const { name, city, device, avatar, handlePersonaChange, ...options } = props

  return (
    <label className="persona">
      <input
        type="radio"
        name="persona"
        value={name}
        onChange={() =>
          handlePersonaChange({
            ...options,
          })
        }
      />
      <img src={`assets/icons/${avatar}.svg`} />
      <span>
        {name} aus {city}
      </span>
      <span>Device: {device}</span>
    </label>
  )
}

Persona.propTypes = {
  name: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  city: PropTypes.string.isRequired,
  ip: PropTypes.string.isRequired,
  device: PropTypes.string.isRequired,
  userAgent: PropTypes.string.isRequired,
  handlePersonaChange: PropTypes.func.isRequired,
}
