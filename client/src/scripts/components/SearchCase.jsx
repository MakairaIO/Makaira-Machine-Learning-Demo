import React from 'react'
import PropTypes from 'prop-types'

export default function SearchCase(props) {
  const { title, handleSearchParamChange, ...options } = props

  return (
    <button onClick={() => handleSearchParamChange({ ...options })}>
      {title}
    </button>
  )
}

SearchCase.propTypes = {
  title: PropTypes.string.isRequired,
  searchPhrase: PropTypes.string.isRequired,
  additionalConstraint: PropTypes.string,
  handleSearchParamChange: PropTypes.func.isRequired,
}
