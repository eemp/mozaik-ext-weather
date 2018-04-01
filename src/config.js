const convict = require('convict');


const config = convict({
    weather: {
        apiToken: {
            doc:     'The weather API token',
            default: '',
            format:  String,
            env:     'WEATHER_API_TOKEN'
        }
    }
});


module.exports = config;
