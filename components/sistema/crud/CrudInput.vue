<template>
  <v-flex xs12 sm12 md10 lg10>
    <div v-if="texto">
      <v-text-field
        :label="label"
        :counter="tamanhoMaximo"
        :required="obrigatorio"
        :rules="[rules.required]"
        v-model="inputValue"
      ></v-text-field>
    </div>
    <div v-if="numero">
      <v-text-field
        v-model="inputValue"
        :label="label"
        type="number"
        :counter="tamanhoMaximo"
        :rules="[rules.required]"
      ></v-text-field>
    </div>
    <div v-if="areaTexto">
      <v-textarea
        v-model="inputValue"
        :label="label"
        :counter="tamanhoMaximo"
        :rules="[rules.required]"
      ></v-textarea>
    </div>
    <div v-if="slider">
      <v-subheader class="pl-0">{{label}}</v-subheader>
      <v-slider v-model="inputValue" thumb-label="always" :max="tamanhoMaximo" :min="tamanhoMinimo"></v-slider>
    </div>
    <div v-if="email">
      <v-text-field
        v-model="inputValue"
        :label="label"
        :counter="tamanhoMaximo"
        :required="obrigatorio"
        :rules="[rules.required, rules.email]"
      ></v-text-field>
    </div>
    <div v-if="senha">
      <v-text-field
        v-model="inputValue"
        :label="label"
        :counter="tamanhoMaximo"
        :required="obrigatorio"
        :rules="[rules.required]"
        :append-icon="mostraSenha ? 'visibility' : 'visibility_off'"
        :type="mostraSenha ? 'text' : 'password'"
        @click:append="mostraSenha = !mostraSenha"
        @keyup="confirmarSenhaValidator"
        :error="isError"
      ></v-text-field>

      <v-text-field
        v-model="subInputValue"
        v-show="confirmarSenha"
        label="Confirmar senha"
        :counter="tamanhoMaximo"
        :required="obrigatorio"
        :rules="[rules.required]"
        :append-icon="mostraConfirmar ? 'visibility' : 'visibility_off'"
        :type="mostraConfirmar ? 'text' : 'password'"
        @click:append="mostraConfirmar = !mostraConfirmar"
        @keyup="confirmarSenhaValidator"
        :error="isError"
      ></v-text-field>
    </div>
    <div v-if="combobox"></div>
    <div v-if="radio"></div>
    <div v-if="switchInput"></div>
    <div v-if="checkbox"></div>
    <div v-if="dataInput">
      <v-menu
        v-model="abrirMenu"
        :close-on-content-click="false"
        :nudge-right="40"
        lazy
        transition="scale-transition"
        offset-y
        full-width
        min-width="290px"
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            v-model="dateFormatted"
            :label="label"
            hint="DD/MM/YYYY"
            persistent-hint
            readonly
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker v-model="inputValue" @input="abrirMenu = false"></v-date-picker>
      </v-menu>
    </div>
    <div v-if="telefone">
      <v-text-field :label="label" mask="(###)#####-####"></v-text-field>
    </div>
  </v-flex>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";

import { InputTipos } from "@/interfaces/sistema/crud/Crud";

@Component
export default class CrudComponent extends Vue {

  @Prop()
  value;

  @Prop({
    required: true
  })
  InputTipo: InputTipos;

  @Prop({
    required: true
  })
  label: string;

  @Prop()
  padrao: any;

  @Prop()
  tamanho?: {
    minimo?: number;
    maximo?: number;
  };

  @Prop({
    required: true
  })
  obrigatorio: boolean;

  @Prop()
  valorPadrao;

  @Prop()
  confirmarSenha;

  inputValue = this.valorPadrao || "";
  subInputValue = this.valorPadrao || "";

  mostraSenha = false;
  mostraConfirmar = false;

  isError = false;

  abrirMenu = false;

  // Computeds
  get texto() {
    return this.InputTipo === InputTipos.texto;
  }
  get numero() {
    return this.InputTipo === InputTipos.numero;
  }
  get areaTexto() {
    return this.InputTipo === InputTipos.areaTexto;
  }
  get slider() {
    return this.InputTipo === InputTipos.slider;
  }
  get email() {
    return this.InputTipo === InputTipos.email;
  }
  get senha() {
    return this.InputTipo === InputTipos.senha;
  }
  get combobox() {
    return this.InputTipo === InputTipos.combobox;
  }
  get radio() {
    return this.InputTipo === InputTipos.radio;
  }
  get switchInput() {
    return this.InputTipo === InputTipos.switch;
  }
  get checkbox() {
    return this.InputTipo === InputTipos.checkbox;
  }
  get dataInput() {
    return this.InputTipo === InputTipos.data;
  }

  get telefone() {
    return this.InputTipo === InputTipos.telefone;
  }

  get tamanhoMaximo() {
    if (this.tamanho && this.tamanho.maximo) return this.tamanho.maximo;

    if (this.slider) return 100;

    return false;
  }

  get tamanhoMinimo() {
    if (this.tamanho && this.tamanho.minimo) return this.tamanho.minimo;

    if (this.slider) return 0;

    return false;
  }

  get dateFormatted(){
    return this.formatDate(this.inputValue);
  }

  // Validators
  rules = {
    required: value => {
      if (this.obrigatorio)
        return !!value || `O campo '${this.label}' é obrigatorio`;

      return false;
    },

    email: value => {
      const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return !!!value || pattern.test(value) || "Email inválido.";
    }
  };

  confirmarSenhaValidator() {
    if (this.confirmarSenha)
      this.isError = this.inputValue !== this.subInputValue;
  }

  formatDate(date) {
    if (!date) return null;

    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  }

  @Watch('inputValue')
  onInputValueChanges(newValue){
    console.log("input");
    
    this.$emit('input', newValue);
  }

  @Watch('value')
  onValueChanges(newValue){
    console.log("value");
    this.inputValue = newValue;
  }
}
</script>

<style lang="scss" scoped>
</style>
