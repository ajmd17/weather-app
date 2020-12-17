import React from 'react'
import PropTypes from 'prop-types'

import WeatherIndicatorComponent from './WeatherIndicatorComponent'

import { formApiRequestUrl, collectForecastResults } from '../util'

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
            forecastResults: collectForecastResults(forecastResults)
          })
        })
        .catch((err) => {
          console.error('API request failed: ', err)
        })
    })
  }

  _renderCurrentWeather() {
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
    if (!this.state.currentResults) {
      return (
        <div className='c-main-content'>
          <div className='c-main-content__loading'>
            Loading...
          </div>
        </div>
      )
    }

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
