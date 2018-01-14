const Telegraf = require('telegraf')
const Markup = require('telegraf/markup')
const fs = require('fs')
const request = require('request')

const geocode = require('./geocode/geocode.js')
const weather = require('./weather/weather.js')

TOKEN = "495259070:AAG4rzmq4Zq9Y-axKZWyVQ1DDT_V9evwVKY"

const admin = {
    id: [126383917], // ids dos utilizadores
    cep: 81540150
}

// const bot = new Telegraf(process.env.EMBARCADOS_BOD_TOKEN)
const bot = new Telegraf(TOKEN)
bot.start((ctx) => { /* ctx: objeto contexto */
    console.log('[start] :', ctx.from.id)
})

/************************* COMUNICAÇÃO COM O ARDUINO *************************/
bot.command('ler_temp', (ctx) => {
    console.log(`[ler temperatura do sensor] : ${ctx.message.from.username}`)
    if (admin.id.includes(ctx.from.id)) {
        ctx.reply('ler temperatura do sensor')
    }
    else {
        console.log('Usuário desconhecido')
        ctx.reply('Usuário não qualificado')
    }
})

bot.command('disparar_alarme', (ctx) => {
    console.log(`[disparar alarme] : ${ctx.message.from.username}`)
    if (admin.id.includes(ctx.from.id)) {
        ctx.reply('disparar alarme')
    }
    else {
        console.log('Usuário desconhecido')
        ctx.reply('Usuário não qualificado')
    }
})
/************************* COMUNICAÇÃO COM O ARDUINO *************************/

/************************* INTEGRAÇÃO COM PERIFÉRICOS ************************/
bot.command('capturar', (ctx) => {
    console.log(`[capturar imagem da camera] : ${ctx.message.from.username}`)
    if (admin.id.includes(ctx.from.id)) {
        ctx.reply('capturar imagem da camera')
    }
    else {
        console.log('Usuário desconhecido')
        ctx.reply('Usuário não qualificado')
    }
})
/************************* INTEGRAÇÃO COM PERIFÉRICOS ************************/

/**************************** INTEGRAÇÃO COM APIs ****************************/
bot.command('meteorologia', (ctx) => {
    console.log(`[busca pela previsão meteorologica] : ${ctx.message.from.username}`)
    if (admin.id.includes(ctx.from.id)) {
        ctx.reply('Buscando pela previsão meteorologica...')
        geocode.geocodeAddress(admin.cep, (errorMessage, results) => {
            if (errorMessage) {
                console.log(errorMessage)
            } else {
                weather.getWeather(results.lat, results.lgn, (err, info) => {
                    if (info) {
                        var msg = `Temperatura: ${info.tempC} °C\n`
                        msg += `Sensação térmica: ${info.tempA} °C\n`
                        msg += `Probabilidade de chuva: ${info.probC*100}%\n`
                        msg += `Pressão atmosférica: ${info.press} hPa\n`
                        msg += `Humidade do ar: ${info.humid}%\n`
                        msg += `Índice ultravioleta: ${info.ultrv}`
                        ctx.reply(msg)
                    } else {
                        console.log(err)
                    }
                })
            }
        })


        
    }
    else {
        console.log('Usuário desconhecido')
        ctx.reply('Usuário não qualificado')
    }
})
/**************************** INTEGRAÇÃO COM APIs ****************************/

/* envia os comandos disponíveis para o usuário */
bot.command('comandos', (ctx) => {
    if (admin.id.includes(ctx.from.id)) {
        ctx.reply('Comandos disponíveis', Markup
            .keyboard([
                ['/ler_temp', '/disparar_alarme'],
                ['/capturar'],
                ['/meteorologia']
            ])
            .oneTime()
            .resize()
            .extra()
        )
    }
    else {
        console.log('Usuário desconhecido')
        ctx.reply('Usuário não qualificado')
    }
})

/* inicia a execução do bot */
bot.startPolling()