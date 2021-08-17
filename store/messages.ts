import Message from "~/interfaces/chat/Message";
import Socket from "~/classes/Socket";

export const state = () => ({
  messages: new Array<Message>()
})

export const mutations = {
  addMessage(state, message){
    const foundIndex = state.messages.findIndex(value => value._id === message._id);
    message.texto = message.texto.toString();
    if(foundIndex === -1)
      state.messages.push(message);
  },
  changeMessageToVisualizada(state, messageId){
    const message = state.messages.find(message => message._id === messageId);
    message.visualizada = true;
  }
};


export const actions = {
  sendMessage({commit}, message){
    new Socket().sendMessage(message, (msgObject) => {
      commit('addMessage', msgObject);
    });
  },
  receiveMessage({commit}, msgObject){
    commit('addMessage', msgObject);
  },
  changeToVisualizada({state, commit}, messageId){
    // todo reverse array to improve perform
    for(const message of state.messages){
      if(message._id === messageId){
        commit('changeMessageToVisualizada', messageId);
        break;
      }
    }
  } 
}