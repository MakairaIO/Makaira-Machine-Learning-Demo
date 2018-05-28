import React, { Component, Fragment } from 'react'
import { buildRequestData } from './requestBuilder'
import { debounce, transformDaytimeToUtcOffset } from './helper'
import { userAgents, geolocations, daytimes } from './userParams'

const API_URL = 'http://localhost:4000'

function DaytimeSelect({ title, options, value, onChange }) {
  return (
    <label>
      {title}:
      <select value={value} onChange={onChange}>
        {options.map(o => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  )
}

function ParameterSelect({ title, options, value, onChange }) {
  return (
    <label>
      {title}:
      <select value={value} onChange={onChange}>
        {options.map(o => (
          <option key={o.id} value={o.id}>
            {o.title}
          </option>
        ))}
      </select>
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

    const request = await fetch(`${API_URL}/search/`, {
      method: 'POST',
      body: JSON.stringify(data),
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const result = await request.json()

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

  render() {
    const { products, searchPhrase, selectedOptions } = this.state

    return (
      <div>
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
        <br />
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
            <br />
          </Fragment>
        ) : (
          <Fragment>
            <label>
              {selectedOptions.type === 'category'
                ? 'Category-ID (hint: 0c106ac5f7f96a97ad7261a125b5d89e)'
                : 'Manufacturer-ID (hint: scmarke175)'}:
              <input
                type="text"
                value={selectedOptions.additionalConstraint}
                onChange={event =>
                  this.handleOptionChange(event, 'additionalConstraint')
                }
              />
            </label>
            <br />
          </Fragment>
        )}
        <ParameterSelect
          title="User Agent"
          options={userAgents}
          value={selectedOptions.userAgent}
          onChange={event => this.handleOptionChange(event, 'userAgent')}
        />
        <br />
        <ParameterSelect
          title="Geolocations"
          options={geolocations}
          value={selectedOptions.ip}
          onChange={event => this.handleOptionChange(event, 'ip')}
        />
        <br />
        <DaytimeSelect
          title="Daytime"
          options={daytimes}
          value={selectedOptions.daytime}
          onChange={event => this.handleOptionChange(event, 'daytime')}
        />
        <br />
        <hr />
        <div className="product-list">
          {products.map(product => (
            <div key={product.id} className="product-tile">
              <p>{product.oxshortdesc}</p>
              <p>{product.marm_oxsearch_manufacturertitle}</p>
              <br />
              <p>Score: {product._score}</p>
              <br />
              <img
                src={`https://static.sport-conrad.com/out/pictures//generated/product/1/380_340_100/${
                  product.oxpic1
                }`}
                alt=""
              />
              <br />
              <p>Preis: {product.oxprice}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }
}

export default App
