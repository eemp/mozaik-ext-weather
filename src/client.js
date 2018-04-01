const _ = require('lodash');
const request = require('superagent');
const Promise = require('bluebird');
//const cache = require('memory-cache');
const config = require('./config');
require('superagent-bluebird-promise');

const cacheManager = require('cache-manager');
const cacheStore = require('cache-manager-fs');
const cacheOptions = {
    maxsize: 1000 * 1000, // bytes, 1 mb
    path: 'tmp/cache',
    preventfill: false,
    ttl: 60 * 60, // seconds, 1 hr
};
const cache = cacheManager.caching({store: cacheStore, options: cacheOptions});

const API_BASE_URL = 'http://api.openweathermap.org/data/2.5';


/**
 * @param {Mozaik} mozaik
 */
const client = mozaik => {
    mozaik.loadApiConfig(config);

    const token = config.get('weather.apiToken');

    const methods = {
        current(params) {
            const { city, country, lang } = params;

            const apiUrl = `${API_BASE_URL}/weather?lang=${lang}&q=${city},${country}&appid=${token}`;

            const cacheKey = `weather.current.${city}.${country}.${lang}`;
            return cache.wrap(cacheKey, function() {
                return request.get(apiUrl).promise()
                    .then(res => _.get(res, 'body'));
            });
        },

        forecast(params) {
            const { city, country, lang, limit } = params;

            const apiUrl = `${API_BASE_URL}/forecast?mode=json&cnt=${limit}&lang=${lang}&q=${city},${country}&appid=${token}`;

            const cacheKey = `weather.forecast.${city}.${country}.${lang}.${limit}`;

            return cache.wrap(cacheKey, function() {
                return request.get(apiUrl).promise()
                    .then(res => _.get(res, 'body.list'));
            });
        },

        combined(params) {
            const { city, country, lang, limit } = params;

            return Promise.props({
                current:  methods.current(params),
                forecast: methods.forecast(params)
            }).catch(err => {
                return Promise.resolve({});
            });
        },
    };

    return methods;
};

module.exports = client;


function isNil(data) {
    return data == null
        || data == undefined;
}

