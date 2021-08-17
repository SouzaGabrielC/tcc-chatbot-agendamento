<template>
  <v-col cols="10" offset="1">
    <v-row>
      <v-col cols="10" >
        <label class="subtitle-1" for="">{{label ? label : "Sinonimos:"}} </label>
      </v-col>
    </v-row>
    <v-row align="center" v-for="(input, index) of sinonimosInputs" :key="index">
      <v-col cols="8">
        <v-text-field outlined rounded clearable counter="100" name="nm_categoria" v-model="input.value" @input="inputChanged"></v-text-field>
      </v-col>
      <v-col cols="2" v-if="index == sinonimosInputs.length - 1 && sinonimosInputs.length > 1">
        <v-btn fab color="error" dark @click="removeInput">-</v-btn>
      </v-col>
      <v-col cols="2" v-if="index == sinonimosInputs.length - 1">
        <v-btn fab color="success" dark @click="addInput">+</v-btn>
      </v-col>
    </v-row>
    
  </v-col>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop } from "vue-property-decorator";

@Component
export default class SinonimosComponent extends Vue {

  sinonimosInputs = [
    {
      value: ""
    }
  ];

  @Prop()
  label: string;

  inputChanged(){

    this.$emit('valores', this.sinonimosInputs.map(input => input.value));
  
  }

  addInput(){
    this.sinonimosInputs.push({
      value: ""
    });
    this.inputChanged();
  }

  removeInput(){
    this.sinonimosInputs.pop();
    this.inputChanged();
  }


}
</script>

<style lang="scss" scoped>

</style>