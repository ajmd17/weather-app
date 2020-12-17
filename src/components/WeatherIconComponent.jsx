import React from 'react'
import PropTypes from 'prop-types'

import { weatherType, snakeCase } from '../util'

export default class WeatherIconComponent extends React.Component {
  static propTypes = {
    isNight: PropTypes.bool,
    weatherResult: PropTypes.object.isRequired
  }

  static defaultProps = {
    isNight: false
  }
  
  get _isSunny() {
    return this.props.weatherResult.clouds.all < 20
  }

  get _bestIcon() {
    let baseIconName = '',
        components = []

    baseIconName = snakeCase(weatherType(this.props.weatherResult))

    if (this.props.isNight) {
      components.push('night')
    } else if (this._isSunny) {
      components.push('sunny')
    }

    if (baseIconName !== '') {
      components = [baseIconName].concat(components)
    }

    return components.join('_')
  }
  
  render() {
    return (
      <div className='c-weather-icon'>
        <img src={`img/${this._bestIcon}.png`} />
      </div>
    )
  }
}
