export function buildRequestData({
  type,
  searchPhrase,
  ip,
  id,
  userAgent,
  timezone,
  additionalConstraint,
  isRainy
}) {
  const requestTemplate = getRequestTemplate({
    isSearch: type === 'search',
    searchPhrase,
  })
  let constraints = getConstraints({ ip, id, userAgent, timezone, isRainy })

  switch (type) {
    case 'search':
      break // nothing to do since we only need the defaults
    case 'category':
      constraints = {
        ...constraints,
        'query.category_id': additionalConstraint
          .split(',')
          .map(el => el.trim()),
      }
      break
    case 'manufacturer':
      constraints = {
        ...constraints,
        'query.manufacturer_id': additionalConstraint,
      }
      break
    default:
      throw new Error('Unsupported type received in requestBuilder')
  }

  return {
    ...requestTemplate,
    constraints: {
      ...constraints,
    },
  }
}

function getRequestTemplate({ isSearch, searchPhrase }) {
  return {
    searchPhrase: isSearch ? searchPhrase : null,
    enableAggregations: true,
    isSearch: isSearch,
    aggregations: [],
    customFilter: [],
    sorting: [],
    count: 20,
    offset: 0,
    apiVersion: '2018.4',
  }
}

function getConstraints({ ip, userAgent, timezone, isRainy }) {
  return {
    'query.shop_id': 1,
    'query.language': 'de',
    'query.use_stock': true,
    'oi.user.ip': ip,
    'oi.user.agent': userAgent,
    'oi.user.timezone': timezone,
    'weather_groups': [isRainy ? 'rgroup1' : 'rgroup0']
  }
}
