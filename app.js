const Telegraf = require('telegraf')
const Markup = require('telegraf/markup')
const fs = require('fs')
const request = require('request')
const Twitter = require('twitter')

const geocode = require('./geocode/geocode.js')
const weather = require('./weather/weather.js')
const criptomon = require('./criptomon/criptomon.js')


const admin = {
    id: [parseInt(process.env.ID_EMBARCADOS)], // ids dos utilizadores
    cep: 81540150
}

// const bot = new Telegraf(process.env.EMBARCADOS_BOT_TOKEN)
const bot = new Telegraf(process.env.EMBARCADOS_BOT_TOKEN)
bot.start((ctx) => { /* ctx: objeto contexto */
    console.log('[start] :', ctx.from.id)
})

console.log('> Telefraf inicializado.');

// inicializa a api do twitter
const twitter = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
})

if (twitter) {
    console.log('> Twitter inicializado.');
} else {
    console.log('> Erro ao inicializar a api do twitter.');
}


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

bot.command('bitcoin', (ctx) => {
    if (admin.id.includes(ctx.from.id)) {
        ctx.reply('Acessando a API do CriptCurrentyCap')
        criptomon.getValoresAtuais('bitcoin', (resp) => {
            if (!!resp) {
                msg = `Moeda: ${resp.nome}\n`
                msg += `Valor atual: R$ ${resp.brl}\n`
                msg += `Variação na última hora: ${resp.variacao_1h}\%\n`
                msg += `Variação no último dia: ${resp.variacao_24h}\%\n`
                msg += `Variação na última semana: ${resp.variacao_7d}\%`
            }
            else {
                msg = 'Erro.'
            }

            ctx.reply(msg)
        })
    }
    else {
        console.log('Usuário desconhecido')
        ctx.reply('Usuário não qualificado')
    }
})

bot.command('mon_bitcoin', (ctx) => {
    if (admin.id.includes(ctx.from.id)) {
        ctx.reply('Configurando bot.')

        var ultimoTimestamp = ''
        
        criptomon.monitorarMoeda('bitcoin',
            (resp) => {
                if (resp.ultima_atualizacao != ultimoTimestamp) {
                    ultimoTimestamp = resp.ultima_atualizacao
                    return true
                }
                else {
                    return false
                }
            },
            (resp) => {
                if (!!resp) {
                    msg = `Moeda: ${resp.nome}\n`
                    msg += `Valor atual: R$ ${resp.brl}\n`
                    msg += `Variação na última hora: ${resp.variacao_1h}\%\n`
                    msg += `Variação no último dia: ${resp.variacao_24h}\%\n`
                    msg += `Variação na última semana: ${resp.variacao_7d}\%`
                }
                else {
                    msg = 'Erro.'
                }
                ctx.reply(msg)
            }
        )

        ctx.reply('Bot configurado')
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
                ['/meteorologia', '/bitcoin'],
                ['/mon_bitcoin']
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
console.log('> Esperando por mensagens.');
bot.startPolling()