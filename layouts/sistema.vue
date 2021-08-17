<template>
  <v-app>
    <menu-side :itensMenu="itensMenu" :baseLink="baseLink"/>
    <v-content>
      <nuxt />
    </v-content>
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
      title: 'Sistema Administrativo Geral'
    }
  }
})
export default class SitemaLayout extends Vue {

  baseLink = "/sistema";

  itensMenu: Menu[] = [
    {
      texto: "Inicio",
      icone: "mdi-home",
      link: "",
      subMenus: []
    },
    {
      texto: "Clinicas",
      icone: "mdi-hospital-box-outline",
      link: "clinicas",
      subMenus: []
    },
    {
      texto: "Categorias Exames",
      icone: "mdi-package-variant",
      link: "categorias-exames",
      subMenus: []
    },
    {
      texto: "Exames",
      icone: "mdi-stethoscope",
      link: "exames",
      subMenus: []
    },
    {
      texto: "Convenios",
      icone: "mdi-account-card-details-outline",
      link: "convenios",
      subMenus: []
    },
    {
      texto: "Entidades",
      icone: "mdi-dictionary",
      link: "entidades",
      subMenus: []
    },
    {
      texto: "Dialogos",
      icone: "mdi-forum",
      link: "dialogos",
      subMenus: []
    }
  ];


}
</script>

