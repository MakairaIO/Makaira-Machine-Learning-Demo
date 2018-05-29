export function buildRequestData({
  type,
  searchPhrase,
  ip,
  id,
  userAgent,
  timezone,
  additionalConstraint,
}) {
  const requestTemplate = getRequestTemplate({
    isSearch: type === 'search',
    searchPhrase,
  })
  let constraints = getConstraints({ ip, id, userAgent, timezone })

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
  const fields = [
    '_score',
    'OXSHORTDESC',
    'MARM_OXSEARCH_MANUFACTURERTITLE',
    'OXPRICE',
    'OXPIC1',
  ]

  return {
    searchPhrase: isSearch ? searchPhrase : null,
    enableAggregations: true,
    isSearch: isSearch,
    aggregations: [],
    customFilter: [],
    sorting: [],
    fields: fields,
    count: 20,
    offset: 0,
    apiVersion: '2018.4',
  }
}

function getConstraints({ ip, userAgent, timezone }) {
  return {
    'query.shop_id': 1,
    'query.language': 'de',
    'query.use_stock': true,
    'oi.user.ip': ip,
    'oi.user.agent': userAgent,
    'oi.user.timezone': timezone,
  }
}
