export function transformDaytimeToUtcOffset(selected) {
  const hours = new Date().getHours()

  let utc = '02' // UTC+2 == MESZ
  switch (selected) {
    case 'day':
      if (hours >= 5 && hours <= 15) {
        // intentionally left blank -> use default
      } else if (hours > 0 && hours < 5) {
        let tmp = `${6 - hours + 2}`
        utc = tmp.length === 1 ? `0${tmp}` : tmp
      } else {
        let tmp = `${24 + 6 + 2 - hours}`
        utc = tmp.length === 1 ? `0${tmp}` : tmp
      }
      break
    case 'night':
      if (hours < 5 && hours > 15) {
        // intentionally left blank -> use default
      } else if (hours > 5 && hours < 15) {
        let tmp = `${16 - hours + 2}`
        utc = tmp.length === 1 ? `0${tmp}` : tmp
      }
      break
    default:
      throw new Error('Unsupported selection for day time')
  }

  return utc
}

export function formatPrice(numberString) {
  return Number(numberString)
    .toFixed(2)
    .replace('.', ',')
}
