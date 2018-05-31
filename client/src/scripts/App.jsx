import React, { Component, Fragment } from 'react'
import FlipMove from 'react-flip-move'
import ParameterSelect from './components/ParameterSelect'
import ProductTile from './components/ProductTile'
import Persona from './components/Persona'
import SearchCase from './components/SearchCase'
import { buildRequestData } from './requestBuilder'
import { transformDaytimeToUtcOffset } from './helper'
import { userAgents, geolocations, daytimes } from './userParams'
import personas from './personas'
import searchCases from './searchCases'

class App extends Component {
  state = {
    products: [],
    selectedOptions: {
      type: 'search',
      searchPhrase: '',
      userAgent: '',
      ip: '',
      daytime: 'night',
      additionalConstraint: '',
    },
  }

  async fetchProducts() {
    const {
      type,
      searchPhrase,
      userAgent,
      ip,
      daytime,
      additionalConstraint,
    } = this.state.selectedOptions

    const data = buildRequestData({
      type,
      searchPhrase,
      ip,
      userAgent,
      timezone: transformDaytimeToUtcOffset(daytime),
      additionalConstraint,
    })

    // Check if we are in dev-environment or production
    const API_URL =
      window.location.hostname === 'localhost' ? 'http://localhost:4000' : ''

    const response = await fetch(`${API_URL}/search/`, {
      method: 'POST',
      body: JSON.stringify(data),
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const result = await response.json()

    this.setState({
      products: result.product.items.map(product => {
        return {
          id: product.id,
          ...product.fields,
        }
      }),
    })
  }

  handleSearchParamChange = options => {
    const { selectedOptions } = this.state

    this.setState(
      {
        selectedOptions: {
          ...selectedOptions,
          ...options,
        },
      },
      () => this.fetchProducts()
    )
  }

  render() {
    const { products, searchPhrase, selectedOptions } = this.state

    return (
      <Fragment>
        <nav className="search-case-list">
          {searchCases.map(searchCase => (
            <SearchCase
              key={searchCase.title}
              type="button"
              handleSearchParamChange={this.handleSearchParamChange}
              {...searchCase}
            />
          ))}
        </nav>
        <nav className="persona-list">
          {personas.map(persona => (
            <Persona
              key={persona.name}
              handleSearchParamChange={this.handleSearchParamChange}
              {...persona}
            />
          ))}
        </nav>
        <FlipMove className="product-list">
          {products.map(product => (
            <ProductTile key={product.id} {...product} />
          ))}
        </FlipMove>
      </Fragment>
    )
  }
}

export default App
