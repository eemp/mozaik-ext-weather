import _ from 'lodash';
import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types';
import { Widget, WidgetHeader, WidgetBody } from '@mozaik/ui'
import WeatherForecastItem from './WeatherForecastItem.js';
import { icon as iconHelper } from './WeatherCodeHelper';
import InfoCircleIcon from 'react-icons/lib/fa/info-circle'

import convertKelvinValue from './unit-handling';

import './Weather.css';

// see http://openweathermap.org/weather-conditions for `weather.id` meaning

class Weather extends Component {
    static getApiRequest(props) {
        const { city, country, lang, limit } = props;
        const params = {
            city,
            country,
            lang,
            limit
        };

        return {
            id: `weather.combined.${city}.${country}.${lang}.${limit}`,
            //id: 'weather.combined',
            params: params
        };
    }

    render() {
        const { apiData={}, city, country, unit } = this.props;
        const { current, forecast } = apiData;

        let descriptionNode = null;
        let tempNode        = null;
        let iconNode        = null;

        if (current && current.weather) {
            if (current.weather.length > 0) {
                descriptionNode = (
                    <div className="weather__weather__description">{current.weather[0].description}</div>
                );

                const iconClass = `weather__icon weather__icon--${iconHelper(current.weather[0].id)}`;
                iconNode = <i className={iconClass} />;
            }

            tempNode = (
                <span className="weather__weather__temp">
                    <span className="weather__weather__temp__value">{Math.round(convertKelvinValue(current.main.temp, unit))}</span>
                    <span className="weather__weather__temp__unit">°{unit}</span>
                </span>
            );
        }

        const forecastItemNodes = _.map(forecast, (data, i) => (
            <WeatherForecastItem key={i}
                temp={{max: _.get(data, 'main.temp_max'), min: _.get(data, 'main.temp_min')}}
                unit={_.get(this.props, 'unit')}
                weather={_.get(data, 'weather')}
            />
        ));

        return (
            <Widget>
                <WidgetHeader title={`${city} - ${country}`} icon={InfoCircleIcon} />
                <WidgetBody>
                    <div className="weather__weather__current">
                        {iconNode}
                        {tempNode}
                        {descriptionNode}
                    </div>
                    <div className="weather__weather__forecast">
                        {forecastItemNodes}
                    </div>
                </WidgetBody>
            </Widget>
        );
    }
}

Weather.displayName = 'Weather';

Weather.propTypes = {
    city:    PropTypes.string.isRequired,
    country: PropTypes.string.isRequired,
    limit:   PropTypes.number.isRequired,
    lang:    PropTypes.oneOf([
        'en',          // English
        'ru',          // Russian
        'it',          // Italian
        'es', 'sp',    // Spanish
        'uk', 'ua',    // Ukrainian
        'de',          // German
        'pt',          // Portuguese
        'ro',          // Romanian
        'pl',          // Polish
        'fi',          // Finnish
        'nl',          // Dutch
        'fr',          // French
        'bg',          // Bulgarian
        'sv', 'se',    // Swedish
        'zh_tw',       // Chinese Traditional
        'zh', 'zh_cn', // Chinese Simplified
        'tr',          // Turkish
        'hr',          // Croatian
        'ca'           // Catalan
    ]).isRequired,
    unit: PropTypes.oneOf(['C', 'F']).isRequired,
};

Weather.defaultProps = {
    lang:  'en',
    limit: 3
};

export default Weather;
