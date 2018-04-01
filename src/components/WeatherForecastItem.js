import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types';
import { icon as iconHelper } from './WeatherCodeHelper';

import convertKelvinValue from './unit-handling';

import './Weather.css';

class WeatherForecastItem extends Component {
    render() {
        const {temp, unit, weather} = this.props;

        const icon      = iconHelper(weather[0].id);
        const iconClass = `weather__icon weather__icon--${icon}`;

        return (
            <div className="weather__weather__forecast__item">
                <i className={iconClass} />
                <span className="weather__weather__forecast__item__description">
                    {weather[0].description}
                </span>

                <span className="weather__weather__forecast__item__min-max">
                    <span className="weather__weather__forecast__item__min">
                        min.<br />
                        {Math.round(convertKelvinValue(temp.min, unit))}°{unit}
                    </span>
                    <span className="weather__weather__forecast__item__max">
                        max.<br />
                        {Math.round(convertKelvinValue(temp.max, unit))}°{unit}
                    </span>
                </span>
            </div>
        );
    }
}

WeatherForecastItem.displayName = 'WeatherForecastItem';

WeatherForecastItem.propTypes = {
    temp: PropTypes.shape({
        min: PropTypes.number.isRequired,
        max: PropTypes.number.isRequired
    }).isRequired,
    weather: PropTypes.arrayOf(
        PropTypes.shape({
            description: PropTypes.string.isRequired
        })
    ).isRequired,
    unit: PropTypes.oneOf(['C', 'F']).isRequired,
};

export default WeatherForecastItem;

