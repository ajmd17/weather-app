export function formApiRequestUrl(city, current = true) {
  let baseUrl = `https://api.openweathermap.org/data/2.5/weather`,
      components = []

  const cityComponents = [
    'cityName',
    'stateCode',
    'countryCode'
  ]

  for (let key of cityComponents) {
    if (!(key in city) || !city[key]) {
      break
    }

    components.push(city[key])
  }

  if (!current) {
    baseUrl = `https://api.openweathermap.org/data/2.5/forecast`
  }

  return `${baseUrl}?q=${components.join(',')}&units=metric&appid=${process.env.OPENWEATHERMAP_API_KEY}`
}


export function fahrenheitToCelsius(degrees) {
  return (degrees - 32) * 5 / 9
}
