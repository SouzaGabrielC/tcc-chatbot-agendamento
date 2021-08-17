
import * as io from "socket.io-client";

let instance = null;

export default class Socket {

  private _socket;
  private _host: string;
  private _port: number;

  private _receivedMessagesFunctions: Function[];
  private _mensagemVisualizadaFunctions: Function[];
  private _recuperaMensagensFunctions: Function[];
  private _socketDisconnectFunctions: Function[];

  constructor(host?: string, port?: number, namespace?: string, salaId?: string) {

    if(instance)
      return instance;

    this._host = host;
    this._port = port;
    if (salaId)
      this._socket = io(`http://${this._host}:${this._port}/${namespace}`, {
        query: {
          sala_id: salaId
        },
      
      });

    else
      this._socket = io(`http://${this._host}:${this._port}/${namespace}`,
      );


    this._receivedMessagesFunctions = [];
    this._mensagemVisualizadaFunctions = [];
    this._recuperaMensagensFunctions = [];
    this._socketDisconnectFunctions = [];

    this._socket.on("mensagem", (message) => {
      this._receivedMessagesFunctions.forEach(func => func(message));
    });

    this._socket.on("mensagemVisualizada", (messageId) => {
      //console.log(messageId);
      this._mensagemVisualizadaFunctions.forEach(func => func(messageId))
    });

    this._socket.on('recuperaMensagens', (mensagens) => {

      this._recuperaMensagensFunctions.forEach(func => func(mensagens));

    });

    this._socket.on('disconnect', () => {
      this._socketDisconnectFunctions.forEach(func => func());
    });

    instance = this;

  }

  startConversation(cb) {
    this._socket.on("comecar-conversa", function (infosObject) {
      cb(infosObject);
    });
  }

  sendMessage(message, cb) {
    this._socket.emit("mensagem", message, (mensagem) => {
      //console.log(mensagem);
      cb(mensagem);
    });
  }

  subscribeMessage(cb: Function) {
    this._receivedMessagesFunctions.push(cb);
  }

  subscribeMesagenVisualizada(cb: Function) {
    this._mensagemVisualizadaFunctions.push(cb);
  }

  subscribeRecuperaMensagens(cb: Function) { 
    this._recuperaMensagensFunctions.push(cb);
  }

  subscribeSocketDisconnect(cb: Function){
    this._socketDisconnectFunctions.push(cb);
  }

}