const request = require('request')

var config = {
  monitoramento: false,
  id_monitoramento: undefined
}

const requisitarValores = (moeda, callback) => {
  request(`https://api.coinmarketcap.com/v1/ticker/${moeda}/?convert=BRL`, (error, response, body) => {
    if (!error) {
      respJson = JSON.parse(body)

      respApi = {
        nome: respJson[0].name,
        brl: respJson[0].price_brl,
        ultima_atualizacao: respJson[0].last_updated,
        variacao_1h: respJson[0].percent_change_1h,
        variacao_24h: respJson[0].percent_change_24h,
        variacao_7d: respJson[0].percent_change_7d
      }
      
      callback(undefined,respApi)
    }
    else {
      console.log(error)
      callback(error, undefined)
    }
  })
}

const getValoresAtuais = (moeda, callback) => {
  requisitarValores(moeda, (erro, resposta) => {
    if (!erro) {
      callback(resposta)
    }
    else {
      callback(undefined)
    }
  })
  
}

const monitorarMoeda = (moeda, condicao, callback) => {
  config.id_monitoramento = setInterval(() => {
    requisitarValores(moeda, (erro, resposta) => {
      if (!erro) {
        if (condicao(resposta)) {
          callback(resposta)
        }
      }
      else {
        callback(undefined)
      }
    })
  }, 30000)

  config.monitoramento = true

}

const pararMonitorarMoeda = () => {
  if (config.monitoramento) {
    clearInterval(config.id_monitoramento)
    config.monitoramento = false
  }
}

module.exports = {
  getValoresAtuais,
  monitorarMoeda,
  pararMonitorarMoeda
}