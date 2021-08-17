<template>
  <v-app>
    <v-container fluid>
      <menu-side :itensMenu="itensMenu" :baseLink="baseLink"/>
      <v-content>
        <nuxt />
      </v-content>
    </v-container>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import MenuSide from "~/components/sistema/menu-side.vue";
import Menu from "~/interfaces/sistema/menu/Menu";

@Component({
  components: {
    MenuSide
  },
  head(){
    return {
      title: 'Painel Administrativo da Clinica'
    }
  }
})
export default class PainelLayout extends Vue {

  itensMenu: Menu[] = [
    {
      texto: "Inicio",
      icone: "mdi-home",
      link: "",
      subMenus: []
    },
    {
      texto: "Unidades",
      icone: "mdi-hospital-marker",
      link: "unidades",
      subMenus: []
    },
    {
      texto: "Exames",
      icone: "mdi-stethoscope",
      link: "exames",
      subMenus: []
    },
    {
      texto: "Bots",
      icone: 'mdi-robot',
      link: "bots",
      subMenus: []
    },
    {
      texto: "Agendas",
      icone: 'mdi-calendar-multiple',
      link: "agendas",
      subMenus: []
    }
  ];

  get baseLink(){
    return `/painel/${this.$route.params.clinica}`;
  }

}
</script>

