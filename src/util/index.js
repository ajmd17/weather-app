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


export function collectForecastResults(forecastResults, maxDays = 4) {
  const { list } = forecastResults

  let date = new Date() /* Date we'll use to iterate through the forecast results with */

  date.setHours(0, 0, 0, 0)

  let results = []

  for (let item of list) {
    const match = /^(\d+)-(\d+)-(\d+)/.exec(item.dt_txt)

    if (match === null) {
      throw Error(`Error parsing forecast datetime: ${item.dt_txt} could not be parsed with RegExp.`)
    }

    const itemYear = Number(match[1]),
          itemMonth = Number(match[2]),
          itemDay = Number(match[3]),
          itemDate = new Date(itemYear, itemMonth - 1, itemDay)

    itemDate.setHours(0, 0, 0, 0)
    console.log(itemYear, itemMonth, itemDay)

    if (itemDate.getTime() <= date.getTime()) {
      continue
    }

    date = itemDate

    results.push(item)

    if (results.length === maxDays) {
      break
    }
  }

  return results
}

export function weatherType(weatherResult) {
  switch (weatherResult.weather[0].main) {
    case 'Rain':
    case 'Snow':
    case 'Thunderstorm':
      return weatherResult.weather[0].main
  }

  if (weatherResult.clouds.all >= 50) {
    return 'Cloudy'
  } else if (weatherResult.clouds.all >= 20) {
    return 'Partially Cloudy'
  }

  return ''
}

export function snakeCase(str) {
  return str.toLowerCase().replace(/\s/g, '_')
}
