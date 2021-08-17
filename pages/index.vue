<template>
  <v-layout row wrap>
    <h1>Test</h1>
    <v-container grid-list-xs>
      <v-alert type="primary" :value="true">
        teste
      </v-alert>
    </v-container>
  </v-layout>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({})
export default class Index extends Vue {

}

</script>

