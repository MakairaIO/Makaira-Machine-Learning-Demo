import React from 'react'
import PropTypes from 'prop-types'

export default function SearchCase(props) {
  const { title, handleSearchParamChange, ...options } = props

  return (
    <label className={`searchcase searchcase--${options.type}`}>
      <input
        type="radio"
        name="searchCase"
        value={title}
        onChange={() =>
          handleSearchParamChange({
            ...options,
          })
        }
      />
      <span>{title}</span>
    </label>
  )
}

SearchCase.propTypes = {
  title: PropTypes.string.isRequired,
  searchPhrase: PropTypes.string.isRequired,
  additionalConstraint: PropTypes.string,
  handleSearchParamChange: PropTypes.func.isRequired,
}
