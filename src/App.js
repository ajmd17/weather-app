import React from 'react'

import CitySelectorHeaderComponent from './components/CitySelectorHeaderComponent'
import MainContentCardComponent from './components/MainContentCardComponent'

import cities from './data/cities'

export default class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedCityIndex: 0
    }
  }

  _onSelectedCityChange = (city, index) => {
    this.setState({
      selectedCityIndex: index
    })
  }

  get _currentCity() {
    if (this.state.selectedCityIndex === -1) {
      return null
    }

    return cities[this.state.selectedCityIndex]
  }

  render() {
    return (
      <div className="App">
        <CitySelectorHeaderComponent
          cities={cities}
          selectedCityIndex={this.state.selectedCityIndex}
          onSelectedCityChange={this._onSelectedCityChange}
        />

        <MainContentCardComponent
          city={this._currentCity}
        />
      </div>
    )
  }
}

