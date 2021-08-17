<template>
  <v-dialog v-model="openDialog" max-width="50%" transition="dialog-transition" class="glossario-desktop">
    <v-card>
      <v-card-title primary-title>
        <h2>Glossário</h2>
      </v-card-title>
      <v-card-text>
        <!-- <small>Esse é o glossario de palavras tecnicas com seus significados para auxiliar na conversa.</small> -->
        <v-text-field ref="glossarioSearch" v-model="search" label="Search" append-icon="mdi-magnify" single-line browser-autocomplete outline hide-details></v-text-field>
      </v-card-text>
      <v-data-table :headers="headers" :items="items" item-key="id" loading="true" :search="search">
        <template v-slot:items="props">
          <td @click="palavraClicada(props.item.palavra)" style="cursor: pointer">{{ props.item.palavra }}</td>
          <td>{{ props.item.descricao }}</td>
        </template>
      </v-data-table>
      <v-card-actions id="glossario-footer">
        
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component({})
export default class GlossarioDesktop extends Vue {
  @Prop({ required: true }) open;

  search = "";

  headers = [
    { text: "Palavra", align: "left", sortable: false, value: "palavra" },
    { text: "Descrição", align: "left", sortable: false, value: "descricao" }
  ];

  estavaFechado = true;

  get items() {
    return [
      {
        id: 1,
        palavra: "Teste",
        descricao: "Isso é um teste de palavra com sua descricao escrita aqui"
      },
      {
        id: 2,
        palavra: "lorem",
        descricao:
          "Lorem Ipsum é simplesmente uma simulação de texto da indústria tipográfica e de impressos, e vem sendo utilizado desde o século XVI, quando um impressor desconhecido pegou uma bandeja de tipos e os embaralhou para fazer um livro de modelos de tipos. Lorem Ipsum sobreviveu não só a cinco séculos, como também ao salto para a editoração eletrônica, permanecendo essencialmente inalterado. Se popularizou na década de 60, quando a Letraset lançou decalques contendo passagens de Lorem Ipsum, e mais recentemente quando passou a ser integrado a softwares de editoração eletrônica como Aldus PageMaker."
      },
      {
        id: 3,
        palavra: "Teste",
        descricao: "Isso é um teste de palavra com sua descricao escrita aqui"
      },
      {
        id: 4,
        palavra: "lorem",
        descricao:
          "Lorem Ipsum é simplesmente uma simulação de texto da indústria tipográfica e de impressos, e vem sendo utilizado desde o século XVI, quando um impressor desconhecido pegou uma bandeja de tipos e os embaralhou para fazer um livro de modelos de tipos. Lorem Ipsum sobreviveu não só a cinco séculos, como também ao salto para a editoração eletrônica, permanecendo essencialmente inalterado. Se popularizou na década de 60, quando a Letraset lançou decalques contendo passagens de Lorem Ipsum, e mais recentemente quando passou a ser integrado a softwares de editoração eletrônica como Aldus PageMaker."
      },
      {
        id: 5,
        palavra: "Teste",
        descricao: "Isso é um teste de palavra com sua descricao escrita aqui"
      },
      {
        id: 6,
        palavra: "lorem",
        descricao:
          "Lorem Ipsum é simplesmente uma simulação de texto da indústria tipográfica e de impressos, e vem sendo utilizado desde o século XVI, quando um impressor desconhecido pegou uma bandeja de tipos e os embaralhou para fazer um livro de modelos de tipos. Lorem Ipsum sobreviveu não só a cinco séculos, como também ao salto para a editoração eletrônica, permanecendo essencialmente inalterado. Se popularizou na década de 60, quando a Letraset lançou decalques contendo passagens de Lorem Ipsum, e mais recentemente quando passou a ser integrado a softwares de editoração eletrônica como Aldus PageMaker."
      }
    ];
  }

  get openDialog() {
    return this.open;
  }

  set openDialog(value) {
    if (!value) this.$emit("closed");
  }

  palavraClicada(palavra){
    this.$emit("closed");
    this.$emit("palavra:clicada", palavra);
  }

}
</script>

<style lang="scss" scoped>

</style>
