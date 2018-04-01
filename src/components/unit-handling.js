import _ from 'lodash';

export default function convertKelvinValue(kelvinValue, unit) {
    return unit === 'C'
        ? kelvinToCelsius(kelvinValue)
        : kelvinToFahrenheit(kelvinValue);
}

export function kelvinToFahrenheit(kelvinValue) {
    return _.isNumber(kelvinValue) && (
        kelvinValue * 9/5 - 459.67
    );
}

export function kelvinToCelsius(kelvinValue) {
    return _.isNumber(kelvinValue) && (kelvinValue - 273.15);
}


