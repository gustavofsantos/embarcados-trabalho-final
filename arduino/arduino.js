const SerialPort = require('serialport')
const serialPort = new SerialPort('/dev/ttyUSB0')

const enviarArduino = (codigo, callback) => {
  /* envia um comando para o arduino */
  serialPort.write(codigo, (erro) => {
    if (erro) {
      callback(`Erro na comunicação com o arduino ${erro}`)
    }
    else {
      callback('Comando enviado.')
    }
  })
}

const lerArduino = (codigo, callback) => {
  serialPort.write(codigo, (erro) => {
    if (erro) {
      callback(erro)
    }
    else {
      const resp = serialPort.read()
      if (!!resp) {
        callback(resp)
      }
      else {
        callback(undefined)
      }
    }
  })
}

module.exports = {
  enviarArduino,
  lerArduino
}