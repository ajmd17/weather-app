import React from 'react'
import PropTypes from 'prop-types'

export default class CitySelectorHeaderComponent extends React.Component {
  static propTypes = {
    cities: PropTypes.arrayOf(PropTypes.shape({
      friendlyName: PropTypes.string.isRequired,
      cityName: PropTypes.string.isRequired,
      stateCode: PropTypes.string,
      countryCode: PropTypes.string
    })).isRequired,
    selectedCityIndex: PropTypes.number.isRequired,
    onSelectedCityChange: PropTypes.func.isRequired
  }

  get _selectedCity() {
    if (this.props.selectedCityIndex === -1) {
      return null
    }

    return this.props.cities[this.props.selectedCityIndex]
  }

  _onCityOptionClick = (index) => {
    this.props.onSelectedCityChange(this._selectedCity, index)
  }

  _renderCityOption(city, index) {
    const isActive = index === this.props.selectedCityIndex

    let className = 'c-city-selector-header__option'

    if (isActive) {
      className += ' c-city-selector-header__option--active'
    }

    return (
      <div key={index}>
        <a href='#' className={className} onClick={() => this._onCityOptionClick(index)}>
          {city.friendlyName}
        </a>
      </div>
    )
  }

  render() {
    return (
      <div className='c-city-selector-header'>
        {this.props.cities.map(this._renderCityOption.bind(this))}
      </div>
    )
  }
}
