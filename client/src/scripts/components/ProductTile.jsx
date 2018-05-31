import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { formatPrice } from '../helper'

const IMAGE_PREFIX =
  'https://static.sport-conrad.com/out/pictures/generated/product/1'

// this has to be a stateful component since its use inside <FlipMove>
class ProductTile extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    marm_oxsearch_manufacturertitle: PropTypes.string.isRequired,
    oxpic1: PropTypes.string.isRequired,
    oxprice: PropTypes.number.isRequired,
    oxshortdesc: PropTypes.string.isRequired,
  }

  render() {
    const {
      id,
      oxpic1,
      oxshortdesc,
      oxprice,
      marm_oxsearch_manufacturertitle,
    } = this.props

    return (
      <div className="product-tile">
        <figure>
          <img
            src={`${IMAGE_PREFIX}/80_80_100/${oxpic1}`}
            srcSet={`${IMAGE_PREFIX}/80_80_100/${oxpic1} 1x, ${IMAGE_PREFIX}/160_160_100/${oxpic1} 2x`}
            alt={oxshortdesc}
          />
        </figure>
        <p className="product-tile__title">{oxshortdesc}</p>
        <p className="product-tile__manufacturer">
          {marm_oxsearch_manufacturertitle}
        </p>
        <p className="product-tile__price">{formatPrice(oxprice)} €</p>
      </div>
    )
  }
}

export default ProductTile
