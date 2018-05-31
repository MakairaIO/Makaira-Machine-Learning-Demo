import React, { Component, Fragment } from 'react'
import FlipMove from 'react-flip-move'
import ParameterSelect from './components/ParameterSelect'
import ProductTile from './components/ProductTile'
import { buildRequestData } from './requestBuilder'
import { debounce, transformDaytimeToUtcOffset } from './helper'
import { userAgents, geolocations, daytimes } from './userParams'
import personas from './personas'

function Persona(props) {
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

class App extends Component {
  state = {
    products: [],
    selectedOptions: {
      type: 'search',
      searchPhrase: 'Ski',
      userAgent:
        'Mozilla/5.0 (Linux; Android 6.0.1; SM-G532G Build/MMB29T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.83 Mobile Safari/537.36', // Android (Chrome 63)
      ip: '178.203.234.0',
      daytime: 'night',
      additionalConstraint: '',
    },
  }

  constructor() {
    super()
    this.fetchProducts = debounce(this.fetchProducts, 200)
  }

  componentDidMount() {
    this.fetchProducts()
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

  handleOptionChange = (event, type) => {
    const value = event.target.value
    const { selectedOptions } = this.state

    selectedOptions[type] = value
    this.setState({ selectedOptions }, () => this.fetchProducts())
  }

  handlePersonaChange = options => {
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
      <div>
        <div className="parameter-selection">
          <label>
            Use Case:
            <select
              value={selectedOptions.type}
              onChange={event => this.handleOptionChange(event, 'type')}
            >
              <option value="search">Search</option>
              <option value="category">Category</option>
              <option value="manufacturer">Manufacturer</option>
            </select>
          </label>
          {selectedOptions.type === 'search' ? (
            <Fragment>
              <label>
                Search Phrase:
                <input
                  type="text"
                  value={selectedOptions.searchPhrase}
                  onChange={event =>
                    this.handleOptionChange(event, 'searchPhrase')
                  }
                />
              </label>
            </Fragment>
          ) : (
            <Fragment>
              <label>
                {selectedOptions.type === 'category'
                  ? 'Category-ID'
                  : 'Manufacturer-ID'}:
                <input
                  type="text"
                  value={selectedOptions.additionalConstraint}
                  onChange={event =>
                    this.handleOptionChange(event, 'additionalConstraint')
                  }
                />
              </label>
            </Fragment>
          )}
          <ParameterSelect
            title="User Agent"
            options={userAgents}
            value={selectedOptions.userAgent}
            onChange={event => this.handleOptionChange(event, 'userAgent')}
          />
          <ParameterSelect
            title="Geolocations"
            options={geolocations}
            value={selectedOptions.ip}
            onChange={event => this.handleOptionChange(event, 'ip')}
          />
          <ParameterSelect
            title="Daytime"
            options={daytimes}
            value={selectedOptions.daytime}
            onChange={event => this.handleOptionChange(event, 'daytime')}
          />
        </div>
        <div className="persona-list">
          {personas.map(persona => (
            <Persona
              key={persona.name}
              handlePersonaChange={this.handlePersonaChange}
              {...persona}
            />
          ))}
        </div>
        <FlipMove className="product-list">
          {products.map(product => (
            <ProductTile key={product.id} {...product} />
          ))}
        </FlipMove>
      </div>
    )
  }
}

export default App
