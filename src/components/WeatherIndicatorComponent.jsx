import React from 'react'
import PropTypes from 'prop-types'

import { fahrenheitToCelsius } from '../util'

export default class WeatherIndicatorComponent extends React.Component {
  static propTypes = {
    city: PropTypes.shape({
      friendlyName: PropTypes.string.isRequired,
      cityName: PropTypes.string.isRequired,
      stateCode: PropTypes.string,
      countryCode: PropTypes.string
    }).isRequired,
    weatherResult: PropTypes.object
  }

  get _daysOfWeek() {
    return [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday'
    ]
  }

  get _dateObject() {
    return new Date(this.props.weatherResult.dt * 1000)
  }

  get _dateString() {
    const dateObject = this._dateObject,
          today = new Date(),
          tomorrow = new Date()

    tomorrow.setDate(tomorrow.getDate() + 1)

    if (dateObject.getDate() === today.getDate()) {
      return 'Today'
    }

    if (dateObject.getDate() === tomorrow.getDate()) {
      return 'Tomorrow'
    }

    return this._daysOfWeek[dateObject.getDay()]
  }

  _renderDate() {
    return (
      <h3 className='c-weather-indicator__date'>
        {this._dateString}
      </h3>
    )
  }

  _renderIcon() {
    return null
  }

  _renderWeatherInfo() {
    return (
      <div className='c-weather-indicator__info'>
        <div className='c-weather-indicator__temperature'>
          {Math.round(this.props.weatherResult.main.temp)} °
        </div>
      </div>
    )
  }

  _renderWeatherResult() {
    if (!this.props.weatherResult) {
      return null
    }

    return (
      <div className='c-weather-indicator__result'>
        {this._renderIcon()}
        {this._renderWeatherInfo()}
      </div>
    )
  }

  render() {
    return (
      <div className='c-weather-indicator'>
        {this._renderDate()}
        {this._renderWeatherResult()}
      </div>
    )
  }
}
