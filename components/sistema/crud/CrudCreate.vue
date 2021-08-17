<template>
  <v-container>
    <v-card>
      <v-card-title primary-title>
        <h2 class="display-1">Criar {{titulo}}</h2>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-form v-model="valid">
          <v-container grid-list-xs>
            <v-layout row wrap>
              <v-flex v-for="input of inputs" :key="input.nome" xs12>
                <crud-input
                  v-model="modelo[input.nome]"
                  :label="input.label"
                  :input-tipo="input.tipo"
                  :tamanho="input.tamanho"
                  :obrigatorio="input.obrigatorio"
                  :valor-padrao="input.valorPadrao"
                  :confirmar-senha="input.confirmarSenha"
                />
              </v-flex>
            </v-layout>
            <v-layout row wrap class="pt-5">
              <v-flex text-md-right md12>
                <v-btn rounded color="error" @click="limpar">Limpar</v-btn>
                <v-btn rounded color="primary" @click="criar">Criar</v-btn>
              </v-flex>
            </v-layout>
          </v-container>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

import { Crud, InputTipos } from "@/interfaces/sistema/crud/Crud";
import CrudInput from "@/components/sistema/crud/CrudInput.vue";

@Component({
  components: {
    CrudInput
  }
})
export default class CrudCreateComponent extends Vue {
  @Prop({
    required: true
  })
  ObjetoCrud: Crud;

  valid = true;

  modelo = {};

  get titulo() {
    return this.ObjetoCrud.titulo;
  }

  get inputs() {
    return this.ObjetoCrud.inputs;
  }

  criar(){

    
  }

  limpar(){

    for(const input of this.ObjetoCrud.inputs){
      this.modelo[input.nome] = input.valorPadrao || "";

    }
  }
}
</script>

<style lang="scss" scoped>
</style>
