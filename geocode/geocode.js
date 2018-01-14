const request = require('request')

const encode = (address) => encodeURIComponent(address)
const makeURL = (enc_address) => `https://maps.googleapis.com/maps/api/geocode/json?address=${enc_address}&key=AIzaSyAFeOSTBrGh5dtWNv6LO8-F4oAuT3FCIXs`

function geocodeAddress(address, callback) {
    request({
        url: makeURL(encode(address)),
        json: true
    }, function(error, response, body) {
        if (!error) {
            if (body.status === 'OK') {
                callback(undefined, {
                    address: body.results[0].formatted_address,
                    lat: body.results[0].geometry.location.lat,
                    lgn: body.results[0].geometry.location.lng
                });
            } else {
                callback('Error to connect to Google Servers.')
            }
        } else {
            callback('Error to connect to Google Servers.')
        }
    })
}

module.exports = {
    geocodeAddress
}