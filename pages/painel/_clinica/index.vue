<template>
  <h1>Inicio</h1>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component({
  layout: "painel",
  async validate({ params, app}){
    try{
      const result = await app.$axios.get(`/clinicas/${params.clinica}`);
      if(result.data.id_clinica)
        return true;
    } catch(err){
      return false;
    }
  }
})
export default class InicioPage extends Vue {}
</script>
