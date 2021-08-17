export default interface Message {

  _id: string;
  texto: string;
  opcoes: Array<{}>;
  data: Date;
  visualizada: boolean;
  fromBot: boolean;
  fromUser: boolean;
  fromAtendente: boolean;

}