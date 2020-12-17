import React from 'react'
import PropTypes from 'prop-types'

import WeatherIndicatorComponent from './WeatherIndicatorComponent'

import { formApiRequestUrl } from '../util'

export default class MainContentCardComponent extends React.Component {
  static propTypes = {
    city: PropTypes.shape({
      friendlyName: PropTypes.string.isRequired,
      cityName: PropTypes.string.isRequired,
      stateCode: PropTypes.string,
      countryCode: PropTypes.string
    }).isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      currentResults: null,
      forecastResults: []
    }
  }

  componentDidMount() {
    this._updateWeatherData(this.props)
  }

  componentWillReceiveProps(newProps) {
    if (newProps.city !== this.props.city) {
      this._updateWeatherData(newProps)
    }
  }

  _filterForecastResults = (forecastResults) => {
    const { list } = forecastResults,
          NUM_DAYS = 4 /* number of days which to stop collecting results at */

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
            itemDate = new Date(itemYear, itemMonth, itemDay)

      if (itemDate.getTime() <= date.getTime()) {
        continue
      }

      date = itemDate

      results.push(item)

      if (results.length === NUM_DAYS) {
        break
      }
    }

    return results
  }

  _updateWeatherData = (props) => {
    const currentApiRequestUrl = formApiRequestUrl(props.city),
          forecastApiRequestUrl = formApiRequestUrl(props.city, false)


    this.setState({
      currentResults: null,
      forecastResults: []
    }, () => {
      Promise.all([
        fetch(currentApiRequestUrl),
        fetch(forecastApiRequestUrl)
      ])
        .then((results) => Promise.all(results.map((result) => result.json())))
        .then(([currentResults, forecastResults]) => {
          this.setState({
            currentResults,
            forecastResults: this._filterForecastResults(forecastResults)
          })
        })
        .catch((err) => {
          console.error('API request failed: ', err)
        })
    })
  }

  _renderCurrentWeather() {
    if (!this.state.currentResults) {
      return (
        <div className='c-main-content__current-weather'>
          Loading...
        </div>
      )
    }

    return (
      <div className='c-main-content__current-weather'>
        <WeatherIndicatorComponent
          city={this.props.city}
          weatherResult={this.state.currentResults}
        />
      </div>
    )
  }

  _renderForecast() {
    if (!this.state.forecastResults || this.state.forecastResults.length === 0) {
      return (
        <div className='c-main-content__forecast'>
          Loading...
        </div>
      )
    }

    return (
      <div className='c-main-content__forecast'>
        {this.state.forecastResults.map((result, index) => (
          <WeatherIndicatorComponent
            city={this.props.city}
            weatherResult={result}
            key={index}
          />
        ))}
      </div>
    )
  }
  
  render() {
    return (
      <div className='c-main-content'>
        <div className='c-main-content__card'>
          <div className='c-main-content__sections'>
            {this._renderCurrentWeather()}
            {this._renderForecast()}
          </div>
        </div>
      </div>
    )
  }
}
