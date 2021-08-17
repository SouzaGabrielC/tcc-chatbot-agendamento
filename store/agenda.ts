
export const state = () => ({

  unidades: [],
  agendas: [],
  dataSelecionada: new Date(),
  consultasAgenda: [],
  unidadeSelecionada: null,
  agendaSelecionada: null,
  consultaSelecionada: null

});

export const mutations = {
  setUnidades(state, unidades) {
    state.unidades = [...unidades];
  },
  addUnidade(state, unidade){
    state.unidades.push(unidade);
  },
  setAgendas(state, agendas){
    state.agendas = [...agendas];
  },
  setDataSelecionada(state, data: Date){
    state.dataSelecionada = new Date(data.getTime());
  },
  setUnidadeSelecionada(state, idUnidade){
    state.unidadeSelecionada = state.unidades.find(unidade => unidade.id_unidade === idUnidade);
  },
  setAgendaSelecionada(state, idAgenda){
    state.agendaSelecionada = state.agendas.find(agenda => agenda.id === idAgenda);
  },
  setConsultasAgenda(state, consultas){
    state.consultasAgenda = [...consultas];
  },
  setConsultaSelecionada(state, idConsulta){
    state.consultaSelecionada = state.consultasAgenda.find(consulta => consulta.id === idConsulta);
  },
  trocarStatusConsultaSelecionada(state, status){
    state.consultaSelecionada.status = status;
  }
};

export const actions = {

  async getUnidades({commit}, clinicaId){

    try {

      const { data } = await this['$axios'].get(
        `/clinicas/${clinicaId}/unidades`
      );

      if(data.unidades){
        commit('setUnidades', data.unidades);
      }else{
        throw new Error('Erro ao buscar unidades da clinica');
      }

    } catch (e) {
      throw new Error('Erro ao buscar unidades da clinica');
    }

  },

  async getAgendasUnidade({ commit, state }){

    try {


      if(state.unidadeSelecionada){

        const { data } = await this['$axios'].get(
          `/unidades/${state.unidadeSelecionada.id_unidade}/agendas`
        );

        if(data){

          commit('setAgendas', data);

        }

      }else{
        throw new Error('Para buscar agendas precisa ser selecionado uma unidade');
      }


    } catch (e) {
      throw new Error('Erro ao buscar agendas da unidade');
    }

  },

  async getConsultasAgenda({commit, state}){

    try {

      if(state.agendaSelecionada){

        const agenda = state.agendaSelecionada;
        const dataSelecionada = state.dataSelecionada;

        const dia = ('0' + dataSelecionada.getDate()).slice(-2);
        const mes = ('0' + (dataSelecionada.getMonth()+1)).slice(-2);
        const ano = dataSelecionada.getFullYear();

        const { data } = await this['$axios'].get(
          `/unidades/${agenda.id_unidade}/agendas/${agenda.id}/consultas/data/${ano}-${mes}-${dia}`
        );

        console.log(data);

        if(data){

          const tempoDoDia = agenda.tempos.find(tempo => tempo.dia_semana === dataSelecionada.getDay());

          if(tempoDoDia){

            // possui agenda no dia

            const horaInicioAgenda = parseInt(tempoDoDia.hr_inicio_agenda.substr(0, 2));
            const minInicioAgenda = parseInt(tempoDoDia.hr_inicio_agenda.substr(3, 2));

            const horaFimAgenda = parseInt(tempoDoDia.hr_fim_agenda.substr(0, 2));
            const minFimAgenda = parseInt(tempoDoDia.hr_fim_agenda.substr(3, 2));

            const minTotalInicio = horaInicioAgenda * 60 + minInicioAgenda;
            const minTotalFim = horaFimAgenda * 60 + minFimAgenda;

            const totalMinAgenda = minTotalFim - minTotalInicio;

            const qtMaximoConsultas = totalMinAgenda / tempoDoDia.cd_tempo_consulta;

            const todasConsultas = [];

            for(let i = 0; i < qtMaximoConsultas; i++){

              const horarioEmMin = minTotalInicio + (i * tempoDoDia.cd_tempo_consulta);

              const horas = Math.trunc(horarioEmMin / 60);
              const minutos = horarioEmMin - (horas * 60);


              const horarioString = `${('0'+horas).slice(-2)}:${('0'+minutos).slice(-2)}:00`;

              const found = data.find(consulta => consulta.hr_consulta === horarioString);

              if(found){
                todasConsultas.push(found);
              } else {
                todasConsultas.push({
                  id: null,
                  dt_consulta: `${ano}-${mes}-${dia}`,
                  hr_consulta: horarioString,
                  cd_carteirinha: null,
                  id_agenda: agenda.id,
                  id_unidade: agenda.id_unidade,
                  paciente: null,
                  status: null
                })
              }

            }

            commit('setConsultasAgenda', todasConsultas);

          } else {

            if(data.length > 0){

              commit('setConsultasAgenda', data);

            } else {

              commit('setConsultasAgenda', []);

            }

          }

        }

      } else {
        throw new Error('Para buscar consultas precisa ser selecionada uma agenda');
      }

    } catch (e) {
      console.error(e);
      throw new Error('Erro ao buscar consultas da agenda');
    }

  },

  async aprovarConsulta({commit, state}){

    try {

      const consultaSelecionada = state.consultaSelecionada;

      const {data} = await this["$axios"].put(
        `/unidades/${consultaSelecionada.id_unidade}/agendas/${consultaSelecionada.id_agenda}/consultas/${consultaSelecionada.id}/aprovar`
      );

      if(data){
        commit('trocarStatusConsultaSelecionada', data.status);
        return data.status;
      } else {
        throw new Error('Não foi possivel aprovar consulta.');
      }


    } catch (e) {
      throw new Error('Não foi possivel aprovar consulta.');
    }

  }

}
