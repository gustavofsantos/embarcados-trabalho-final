const SerialPort = require('serialport')

class Arduino {
  constructor(caminhoArduino) {
    this.serialPort = new SerialPort(caminhoArduino)
  }

  enviarArduino(codigo, callback) {
    /* envia um comando para o arduino */
    this.serialPort.write(codigo, (erro) => {
      if (erro) {
        callback(`Erro na comunicação com o arduino ${erro}`)
      }
      else {
        callback('Comando enviado.')
      }
    })
  }
  
  lerArduino(codigo, callback) {
    this.serialPort.write(codigo, (erro) => {
      if (erro) {
        callback(erro)
      }
      else {
        const resp = this.serialPort.read()
        if (resp) {
          callback(resp)
        }
        else {
          callback(undefined)
        }
      }
    })
  }
  
  verificarArduino(callback) {
    this.serialPort.write('i', erro => {
      if (erro) {
        callback(undefined, erro)
      }
      else {
        const resp = this.serialPort.read()
        if (!!resp) {
          callback(resp)
        }
        else {
          callback(undefined, 'Sem resposta.')
        }
      }
    })
  }
}

module.exports = Arduino