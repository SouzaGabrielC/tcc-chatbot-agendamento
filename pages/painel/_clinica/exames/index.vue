<template>
  <v-container grid-list-xs>
    <v-row>
      <v-col cols="10" offset="1">
        <v-card>
          <v-card-title primary-title class="pa-4">Exames Unidade</v-card-title>
          <v-divider></v-divider>
          <v-container grid-list-xs>
            <v-row>
              <v-col md="12">
                
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import SinonimosComponent from "@/components/geral/sinonimos.vue";
import Datagrid from "@/components/geral/datagrid.vue";

@Component({
  layout: "painel",
  components: {
    Datagrid
  }
})
export default class UnidadesPage extends Vue {

}
</script>

