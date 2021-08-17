<template>
  <v-dialog v-model="openDialog" transition="dialog-bottom-transition" fullscreen>
    <v-card>
      <v-toolbar dark color="teal">
        <v-btn icon dark @click="openDialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>

        <v-toolbar-title>Consulta {{dataConsulta}} - {{horaConsulta}} / {{paciente.nm_paciente}}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn dark text>Salvar Alterações</v-btn>
          <v-btn @click="aprovarAgendamento" v-if="status.id === 9" dark color="primary">Aprovar</v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-container grid-list-xs height="60">
        <v-row>
          <v-col md="7">
            <v-text-field
              v-model="paciente.nm_paciente"
              outlined
              rounded
              disabled
              name="nm_paciente"
              label="Nome paciente"
            ></v-text-field>
          </v-col>
          <v-col lg="3" md="4">
            <v-text-field
              v-model="paciente.cd_cpf"
              outlined
              rounded
              disabled
              name="cd_cpf"
              label="CPF paciente"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col lg="4" md="5">
            <v-text-field
              v-model="paciente.cd_telefone"
              outlined
              rounded
              disabled
              name="cd_telefone"
              label="Telefone paciente"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4">
            <v-combobox v-model="categoriaSelecionada" outlined rounded :items="categoriasCombo" label="Categoria Exame"></v-combobox>
          </v-col>
          <v-col>
            <v-combobox v-model="exameSelecionado" outlined rounded :items="examesCombo" label="Exame"></v-combobox>
          </v-col>
        </v-row>
        <v-row>
          <v-col lg="4" md="5">
            <v-combobox
              outlined
              rounded
              v-model="convenio.nm_convenio"
              :items="['Unimed', 'Santa Casa']"
              label="Convenio utilizado"
            ></v-combobox>
          </v-col>
          <v-col lg="4" md="5">
            <v-text-field
              v-model="carteirinha"
              outlined
              rounded
              name="cd_carteirinha"
              label="Carteirinha"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component({})
export default class ConsultaDialogo extends Vue {
  @Prop({ required: true }) open;
  // @Prop() consulta;
  // @Prop() exames;
  // @Prop() categorias;

  categoriaSelecionada: any = null;
  exameSelecionado: any = null;

  async aprovarAgendamento(){

      this.$store.dispatch('agenda/aprovarConsulta');

  }

  get consulta(){
      return this.$store.state.agenda.consultaSelecionada;
  }

  get openDialog() {
    return this.open;
  }

  set openDialog(value) {
    if (!value) this.$emit("closed");
  }

  get paciente() {
    return this.consulta && this.consulta.paciente
      ? this.consulta.paciente
      : {};
  }

  get convenio() {
    return this.consulta && this.consulta.convenio
      ? this.consulta.convenio
      : {};
  }

  get status() {
    return this.consulta && this.consulta.status ? this.consulta.status : {};
  }

  get carteirinha() {
    return this.consulta ? this.consulta.cd_carteirinha : "";
  }

  get dataConsulta() {
    if (!this.consulta) {
      return "";
    }

    const dataQuebrada = this.consulta.dt_consulta.split("-");

    return `${dataQuebrada[2]}/${dataQuebrada[1]}/${dataQuebrada[0]}`;
  }

  get horaConsulta() {
    return this.consulta ? this.consulta.hr_consulta.substr(0, 5) : "";
  }

  get exame() {
    if (!this.consulta) {
      return {};
    }

    return {
      id: this.consulta.exame.id_exame,
      nm_exame: this.consulta.exame.exame.nm_exame,
      id_categoria: this.consulta.exame.exame.categoria.id_categoria
    };
  }

  get examesCombo(){

    // if(this.categoriaSelecionada)
    //   return this.exames
    //     .filter(exame => exame.id_categoria === this.categoriaSelecionada.value)
    //     .map(exame => ({ value: exame.id_exame, text: exame.nm_exame })
    //   );

    return [];
  }

  get categoriasCombo(){
    // return this.categorias.map(categoria => ({ value: categoria.id_categoria, text: categoria.nm_categoria }));
    return [];
  }

  @Watch('consulta')
  onChangeConsulta(consulta, oldConsulta){

    if(consulta){
      this.categoriaSelecionada = {
        value: consulta.exame.exame.categoria.id_categoria,
        text: consulta.exame.exame.categoria.nm_categoria
      };

      this.exameSelecionado = {
        value: consulta.exame.exame.id_exame,
        text: consulta.exame.exame.nm_exame
      };
    }

  }

}
</script>

<style lang="scss" scoped>
</style>
