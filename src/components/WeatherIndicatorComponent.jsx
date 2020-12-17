import React from 'react'
import PropTypes from 'prop-types'

import WeatherIconComponent from './WeatherIconComponent'

import { weatherType } from '../util'

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
      'Sun',
      'Mon',
      'Tue',
      'Wed',
      'Thur',
      'Fri',
      'Sat'
    ]
  }

  get _dateObject() {
    if (this.props.weatherResult.dt_txt) {
      return new Date(this.props.weatherResult.dt_txt)
    }

    return new Date(this.props.weatherResult.dt * 1000)
  }

  get _dateString() {
    const dateObject = this._dateObject,
          today = new Date(),
          tomorrow = new Date()

    tomorrow.setDate(tomorrow.getDate() + 1)

    console.log('dateobject = ', dateObject)
    console.log('today = ', today)
    console.log(this.props.weatherResult.dt_txt)

    if (dateObject.getDate() === today.getDate()) {
      console.log('today')
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
    return (
      <WeatherIconComponent
        weatherResult={this.props.weatherResult}
      />
    )
  }

  _renderWeatherInfo() {
    return (
      <div className='c-weather-indicator__info'>
        <div className='c-weather-indicator__temperature'>
          {Math.round(this.props.weatherResult.main.temp)} °
        </div>
        <div className='c-weather-indicator__subtitle'>
          {weatherType(this.props.weatherResult)}
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
