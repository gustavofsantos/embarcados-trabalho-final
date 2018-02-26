const fs = require('fs')
const request = require('request')
const Twitter = require('twitter')
const NodeWebCam = require('node-webcam')

const geocode = require('./../geocode/geocode.js')
const weather = require('./../weather/weather.js')
const criptomon = require('./../criptomon/criptomon.js')
const arduino = require('./../arduino/arduino.js')

class Bot {
    constructor() {
        /* INICIALIZAÇÃO DAS DEPENDENCIAS DO PROJETO */
        this.admin = {
            id: [parseInt(process.env.ID_EMBARCADOS)], // ids dos utilizadores
            cep: 81540150
        }

        this.config = {
            modo_automatico: false,
            modo_erro: false
        }

        // const bot = new Telegraf(process.env.EMBARCADOS_BOT_TOKEN)
        this.telegBot = new Telegraf(process.env.EMBARCADOS_BOT_TOKEN)

        
        // inicializa a api do twitter
        this.twitter = new Twitter({
            consumer_key: process.env.TWITTER_CONSUMER_KEY,
            consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
            access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
            access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
        })

        if (this.twitter) {
            console.log('> Twitter inicializado.');
        } else {
            console.log('> Erro ao inicializar a api do twitter.');
        }

        this.WebCam = NodeWebCam.create({
            width: 1280,
            height: 720,
            quality: 100,
            delay: 0,
            saveShots: true,
            output: "jpeg",
        })
    }

    start() {
        this.telegBot.start((ctx) => { /* ctx: objeto contexto */
            console.log('[start] :', ctx.from.id)
        })
        console.log('> Telefraf inicializado.');
    }

    arduinoLerTemperatura() {
        
    }
}

