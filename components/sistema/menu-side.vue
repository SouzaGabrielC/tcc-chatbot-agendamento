<template>
  <v-navigation-drawer
    v-model="drawer"
    :mini-variant="mini"
    clipped
    fixed
    app
    class="light-blue darken-2"
    dark
  >
    <v-list class="pa-1">
      <v-list-item @click="avatarClick">
        <v-list-item-avatar color="grey lighten-2">
          <v-icon>mdi-account</v-icon>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>Gabriel Carvalho</v-list-item-title>
        </v-list-item-content>

        <v-list-item-action @click.stop="mini = !mini">
          <v-icon>mdi-chevron-left</v-icon>
        </v-list-item-action>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list class="pt-0" dense>
      <v-list-item v-for="item in itensMenu" :key="item.texto" @click="goTo(item.link)">
        <v-tooltip right nudge-right="25">
          <template v-slot:activator="{ on }">
              <v-list-item-action v-on="mini ? on : {}">
                <v-icon v-if="item.icone">{{ item.icone }}</v-icon>
              </v-list-item-action>

              <v-list-item-content>
                <v-list-item-title>{{ item.texto }}</v-list-item-title>
              </v-list-item-content>
          </template>
          <span>{{ item.texto }}</span>
        </v-tooltip>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

import Menu from "@/interfaces/sistema/menu/Menu";

@Component
export default class MenuSide extends Vue {
  mini = false;

  drawer = true;

  @Prop({ required: true })
  itensMenu: Menu[];

  @Prop({ required: true })
  baseLink: string;

  avatarClick() {
    if (this.mini === true) {
      this.mini = false;
    }
  }

  goTo(link) {
    this.$router.push(`${this.baseLink}/${link}`);
  }
}
</script>
