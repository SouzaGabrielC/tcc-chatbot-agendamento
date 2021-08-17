import Cookie from "js-cookie";

export const state = () => ({
  clinicaId: '',
  salaId: '',
  isAtBottom: true
})

export const mutations = {
  setClinicaId(state, id) {
    state.clinicaId = id;
  },
  setSalaId(state, id) {
    state.salaId = id;
  },
  notAtBottom(state){
    state.isAtBottom = false;
  },
  atBottom(state){
    state.isAtBottom = true;
  }
};

export const actions = {
  setSalaId({ commit }, id){
    Cookie.set('salaId', id);
    commit('setSalaId', id);
  },
  verifySalaId({commit}){
    const salaId = Cookie.get('salaId');
    if(salaId){
      commit('setSalaId', salaId);
      return salaId;
    }else{
      return null;
    }
  }
}
