const request = require('request')


function getWeather (lat, lng, callback) {
    request({
        url: `https://api.darksky.net/forecast/ba9006f1d9dbbe7c14d2e6921abca3f5/${lat},${lng}`,
        json: true
        }, function (error, response, body) {
            if (!error) {
                var info = {
                    tempC: ((body.currently.temperature - 32)/1.8).toFixed(2),
                    tempA: ((body.currently.apparentTemperature - 32)/1.8).toFixed(2),
                    probC: body.currently.precipProbability,
                    press: body.currently.pressure,
                    humid: body.currently.humidity,
                    ultrv: body.currently.uvIndex
                }
                callback(undefined, info)
            } else {
                callback('Erro na comunicação com o DarkSky.')
            }
    })
}


module.exports = {
    getWeather
}