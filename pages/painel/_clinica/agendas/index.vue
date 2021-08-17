<template>
  <v-container grid-list-xs fluid id="agenda">
    <v-row>
      <v-col cols="12">
        <v-card color="#eeeeee">
          <v-container grid-list-xs>
            <v-col cols="12">
              <v-combobox
                hide-details
                solo
                v-model="unidadeSelecionada"
                :items="nomesUnidades"
                label="Unidade"
              ></v-combobox>
            </v-col>
            <v-col cols="12">
              <v-combobox
                :disabled="!!!unidadeSelecionada"
                hide-details
                solo
                v-model="agendaSelecionada"
                :items="nomesAgendas"
                label="Agenda"
              ></v-combobox>
            </v-col>
            <v-row>
              <v-date-picker
                :value="dataSelecionada"
                @input="setDataSelecionada"
                full-width
                :landscape="$vuetify.breakpoint.smAndUp"
                :show-current="false"
                class="mt-4"
                :color="color"
                locale="pt-br"
              ></v-date-picker>
            </v-row>
            <v-row>
              <v-col cols="1">
                <v-btn class="btn-agenda-nav mr-1" dark :color="color" @click="formerPage">
                  <v-icon>mdi-chevron-left</v-icon>
                </v-btn>
              </v-col>
              <v-col cols="10">
                <v-data-iterator
                  :items="items"
                  :items-per-page.sync="itemsPerPage"
                  :page="page"
                  :search="search"
                  :sort-by="sortBy.toLowerCase()"
                  :sort-desc="sortDesc"
                  hide-default-footer
                  :loading="carregandoAgenda"
                >
                  <template v-slot:header>
                    <v-text-field
                      v-model="search"
                      clearable
                      solo
                      hide-details
                      prepend-inner-icon="mdi-magnify"
                      label="Pesquisar"
                    ></v-text-field>
                  </template>

                  <template v-slot:default="props">
                    <v-row>
                      <v-col
                        v-for="(item, index) in props.items"
                        :key="index"
                        cols="12"
                        sm="6"
                        md="4"
                        lg="3"
                      >
                        <v-card @click="abrirEdicaoConsulta(item.id)">
                          <v-card-title class="subheading font-weight-bold">{{ item.status }}</v-card-title>

                          <v-divider></v-divider>

                          <v-list dense>
                            <v-list-item
                              v-for="(key, index) in filteredKeys"
                              :key="index"
                              :color="sortBy === key ? `blue lighten-4` : `white`"
                            >
                              <v-list-item-content>{{ key }}:</v-list-item-content>
                              <v-list-item-content class="align-end">{{ item[key.toLowerCase()] }}</v-list-item-content>
                            </v-list-item>
                          </v-list>
                        </v-card>
                      </v-col>
                    </v-row>
                  </template>
                  <template v-slot:no-data>
                    <v-col cols="12">
                      <div v-if="!!!unidadeSelecionada">Selecione a unidade</div>
                      <div v-else-if="!!!agendaSelecionada">Selecione a agenda a ser visualizada</div>

                      <div v-if="!!erroMsg">Erro! {{erroMsg}}</div>

                      <div v-if="!!informacaoAgenda">{{informacaoAgenda}}</div>
                    </v-col>
                  </template>

                  <template v-slot:loading>
                    <v-row align="center">
                      <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
                    </v-row>
                  </template>
                  <template v-slot:footer>
                    <v-row class="mt-2" align="center" justify="center">
                      <span class="grey--text">Items per page</span>
                      <v-menu offset-y>
                        <template v-slot:activator="{ on }">
                          <v-btn dark text color="teal darken-2" class="ml-2" v-on="on">
                            {{ itemsPerPage }}
                            <v-icon>mdi-chevron-down</v-icon>
                          </v-btn>
                        </template>
                        <v-list>
                          <v-list-item
                            v-for="(number, index) in itemsPerPageArray"
                            :key="index"
                            @click="updateItemsPerPage(number)"
                          >
                            <v-list-item-title>{{ number }}</v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-menu>

                      <v-spacer></v-spacer>

                      <span class="mr-4 grey--text">Page {{ page }} of {{ numberOfPages }}</span>
                    </v-row>
                  </template>
                </v-data-iterator>
              </v-col>
              <v-col cols="1">
                <v-btn class="btn-agenda-nav mr-1" dark :color="color" @click="nextPage">
                  <v-icon>mdi-chevron-right</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
    <consulta-dialogo
      :open="openConsulta"
      @closed="openConsulta = false"
    />
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { stringify } from "querystring";
import ConsultaDialogo from "@/components/painel/ConsultaDialogo.vue";

@Component({
  layout: "painel",
  async validate({ params, app }) {
    try {
      const result = await app.$axios.get(`/clinicas/${params.clinica}`);
      if (result.data.id_clinica) return true;
    } catch (err) {
      return false;
    }
  },
  components: {
    ConsultaDialogo
  }
})
export default class AgendasPage extends Vue {
  color = "teal";

  openConsulta = false;
  consultaSelecionada = null;

  examesAgenda = [];
  categoriasExamesAgenda = [];

  agendas = [];

  erroMsg = null;
  informacaoAgenda = null;


  async mounted() {
      this.$store.dispatch('agenda/getUnidades', this.$route.params.clinica);
      this.$store.commit('agenda/setDataSelecionada', new Date());
      this.$store.commit('agenda/setConsultasAgenda', []);
  }

  get nomesUnidades(){

      const unidades = this.$store.state.agenda.unidades;

      return unidades.map(unidade => ({
          text: unidade.nm_unidade,
          value: unidade.id_unidade
      }));

  };

  get nomesAgendas(){

      const agendas = this.$store.state.agenda.agendas;

      return agendas.map(agenda => ({
          text: agenda.nm_agenda,
          value: agenda.id
      }));
  }


  get dataSelecionada(){

      const dataSelecionada = this.$store.state.agenda.dataSelecionada;

      const dia = ('0' + dataSelecionada.getDate()).slice(-2);
      const mes = ('0' + (dataSelecionada.getMonth()+1)).slice(-2);
      const ano = dataSelecionada.getFullYear();

      return `${ano}-${mes}-${dia}`;
  }

  setDataSelecionada(value){

      const dataSelecionada = new Date(value + 'T00:00:00');

      this.$store.commit('agenda/setDataSelecionada', dataSelecionada);

      if(this.agendaSelecionada && this.unidadeSelecionada){

          try{
              this.carregandoAgenda = true;
              this.$store.dispatch('agenda/getConsultasAgenda').then(() => { this.carregandoAgenda= false} );
          } catch (e) {
              console.error(e);
              this.erroMsg = 'Não foi possivel pegar as consultas da agenda.';
          }

      }


  }

  carregandoAgenda = false;

  unidadeSelecionada = null;
  agendaSelecionada = null;

  itemsPerPageArray = [8, 12, 24, 48];
  search = "";
  filter = {};
  sortDesc = false;
  page = 1;
  itemsPerPage = 8;
  sortBy = "horário";
  keys = ["Status", "Horário", "Nome", "Exame", "Convênio"];
  // items = [];

  get items(){

      const consultas = this.$store.state.agenda.consultasAgenda;

      if(consultas){

          if(consultas.length === 0 && this.unidadeSelecionada && this.agendaSelecionada){
              this.informacaoAgenda = 'A agenda não possui horários nesse dia';
          } else{
              this.informacaoAgenda = null;
              this.erroMsg = null;
          }

          return consultas.map(consulta => ({
              'id': consulta.id,
              'status': consulta.status ? consulta.status.nm_status : 'Vazio',
              'horário': consulta.hr_consulta.substr(0,5),
              'nome': consulta.paciente ? consulta.paciente.nm_paciente : '',
              'exame': consulta.exame ? consulta.exame.exame.nm_exame : '',
              'convênio': consulta.convenio ? consulta.convenio.nm_convenio : ''
          }));
      } else {
          this.erroMsg = 'Não foi possivel pegar as consultas.';
      }

  }

  get numberOfPages() {
    return Math.ceil(this.items.length / this.itemsPerPage);
  }

  get filteredKeys() {
    return this.keys.filter(key => key !== `Name`);
  }

  nextPage() {
    if (this.page + 1 <= this.numberOfPages) this.page += 1;
  }

  formerPage() {
    if (this.page - 1 >= 1) this.page -= 1;
  }

  updateItemsPerPage(number) {
    this.itemsPerPage = number;
  }

  abrirEdicaoConsulta(id) {
      console.log('abrir', id);
    if (id) {
      this.$store.commit('agenda/setConsultaSelecionada', id);
      // this.consultaSelecionada = this.arrayDeConsultas.find(
      //   consulta => consulta.id === id
      // );
      this.openConsulta = true;
    }
  }

  aprovarAgendamentoSelecionado(status){

    // this.consultaSelecionada.status = status;
    //
    // console.log('Status', status, this.consultaSelecionada, this.arrayDeConsultas);
    //
    // this.arrayDeConsultas = [].concat(this.arrayDeConsultas);
    //
    // const itemSelecionado = this.items.find(item => item.id === this.consultaSelecionada.id);
    // itemSelecionado.status = status.nm_status;
    //
    // this.items = [].concat(this.items);
  }

  @Watch("unidadeSelecionada")
  async onUnidadeSelectionaChange(novaUnidade) {

      console.log('NOVA UNIDADE SELECIONADA:', novaUnidade);

      this.$store.commit('agenda/setUnidadeSelecionada', novaUnidade.value);

      try {
          this.$store.dispatch('agenda/getAgendasUnidade');
      } catch (e) {
          console.error(e);
          this.erroMsg = 'Não foi possivel pegar as agendas da unidade.';
      }

  }

  @Watch("agendaSelecionada")
  async onAgendaSelecionada(novaAgenda) {

      console.log('NOVA AGENDA SELECIONADA:', novaAgenda);

      this.$store.commit('agenda/setAgendaSelecionada', novaAgenda.value);

      try{
          this.carregandoAgenda = true;
          this.$store.dispatch('agenda/getConsultasAgenda').then(() => { this.carregandoAgenda= false} );
      } catch (e) {
          console.error(e);
          this.erroMsg = 'Não foi possivel pegar as consultas da agenda.';
      }


  }

}
</script>

<style lang="scss">
#agenda {
  .btn-agenda-nav {
    height: 100%;
  }
}
</style>
