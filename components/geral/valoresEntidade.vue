<template>
  <v-col cols="12">
    <v-card flat outlined v-for="(input, index) of valoresInputs" :key="index">
      <v-row>
        <v-col cols="10">
          <v-row>
            <v-col cols="9" offset="1">
              <label class="subtitle-1" for>Valor Entidade:</label>
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col cols="9" offset="1">
              <v-text-field
                outlined
                rounded
                clearable
                counter="100"
                name="nm_valor"
                v-model="input.nm_valor"
                @input="inputChanged"
              ></v-text-field>
            </v-col>
            <v-col cols="9" offset="1">
              <v-switch label="Expressão Regular?" v-model="valoresInputs.ic_expressao"></v-switch>
            </v-col>
            <sinonimos :label="valoresInputs.ic_expressao ? 'Expressões Regulares:' : null" @valores="changeValoresSinonimos($event, index)" />
          </v-row>
        </v-col>
        <v-col cols="2" class="d-flex flex-row-reverse">
          <v-btn
            color="error"
            class="mr-1"
            height="100%"
            dark
            @click="removeInput"
            v-if="index == valoresInputs.length - 1 && valoresInputs.length > 1"
          >
            <v-icon>mdi-minus-circle</v-icon>
          </v-btn>
          <v-btn
            color="primary"
            class="mr-1"
            height="100%"
            dark
            @click="addInput"
            v-if="index == valoresInputs.length - 1"
          >
            <v-icon>mdi-plus-circle</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
  </v-col>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import Sinonimos from "./sinonimos.vue";

@Component({
  components: {
    Sinonimos
  }
})
export default class ValoresEntidadeComponent extends Vue {
  valoresInputs = [
    {
      nm_valor: "",
      ic_expressao: false,
      sinonimos: []
    }
  ];

  inputChanged() {
    this.$emit("valores", this.valoresInputs);
  }

  addInput() {
    this.valoresInputs.push({
      nm_valor: "",
      ic_expressao: false,
      sinonimos: []
    });
    this.inputChanged();
  }

  removeInput() {
    this.valoresInputs.pop();
    this.inputChanged();
  }

  changeValoresSinonimos(valores, index) {
    this.valoresInputs[index].sinonimos = valores;
    this.inputChanged();
  }
}
</script>

<style lang="scss" scoped>
</style>