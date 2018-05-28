import React, { Component, Fragment } from 'react'
import FlipMove from 'react-flip-move'
import { buildRequestData } from './requestBuilder'
import { debounce, transformDaytimeToUtcOffset, formatPrice } from './helper'
import { userAgents, geolocations, daytimes } from './userParams'

// FIXME: Replace with endpoint once server is deployed
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
          <DaytimeSelect
            title="Daytime"
            options={daytimes}
            value={selectedOptions.daytime}
            onChange={event => this.handleOptionChange(event, 'daytime')}
          />
        </div>
        <FlipMove className="product-list">
          {products.map(product => (
            <div key={product.id} className="product-tile">
              <figure>
                <img
                  src={`https://static.sport-conrad.com/out/pictures//generated/product/1/80_80_100/${
                    product.oxpic1
                  }`}
                  alt=""
                />
              </figure>
              <p className="product-tile__title">{product.oxshortdesc}</p>
              <p className="product-tile__manufacturer">
                {product.marm_oxsearch_manufacturertitle}
              </p>
              <p className="product-tile__price">
                {formatPrice(product.oxprice)} €
              </p>
            </div>
          ))}
        </FlipMove>
      </div>
    )
  }
}

export default App
