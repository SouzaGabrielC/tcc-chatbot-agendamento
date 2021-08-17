<template>
  <v-container>
    <v-card>
      <v-card-title primary-title>
        <h2 class="display-1">Lista de {{titulo}}</h2>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-layout row wrap>
          <v-flex xs5 offset-xs7>
            <v-text-field
              v-model="search"
              append-icon="search"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-flex>
        </v-layout>
        <br>
        <v-layout row wrap>
          <v-flex xs12>
            <v-data-table :headers="headers" :items="objeto" :search="search">
              <template v-slot:items="props">
                <td
                  v-for="(header, index) of headersLessActions"
                  :key="index"
                >{{props.item[header.value]}}</td>
                <td class="justify-center layout px-0">
                  <v-icon small class="mr-2" @click="editItem(props.item[campoId])">edit</v-icon>
                  <v-icon small @click="removeItem(props.item[campoId])">delete</v-icon>
                </td>
              </template>
              <template v-slot:no-data>
                <v-btn color="primary" @click="initialize">Reset</v-btn>
              </template>
            </v-data-table>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
    <v-layout row justify-center>
      <v-dialog v-model="removerDialog" persistent max-width="400">
        <v-card>
          <v-card-title class="headline">Deseja realmente excluir?</v-card-title>
          <v-card-text>
            <p>
              Você deseja realmente excluir, todos os dados vinculados tambem deixaram de existir.
            </p>
            <p>
              <strong>Item a ser excluido:</strong> 
              <br>
              <br>
              <ul>
                <span v-html="informacoesItem"></span>
              </ul>
            </p>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" flat @click.native="removerDialog = false">Não</v-btn>
            <v-btn color="green" dark @click.native="removerDialog = false">Sim</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { ItemLista, Crud } from "../../../interfaces/sistema/crud/Crud";

@Component
export default class CrudList extends Vue {
  @Prop({
    required: true
  })
  objeto: any;

  @Prop({
    required: true
  })
  objetoCrud: Crud;

  search: string = "";

  removerDialog = false;

  itemSelecionado = null;

  get campoId(){
    return this.objetoCrud.campoId;
  }

  get padraoLista(): ItemLista[]{
    return this.objetoCrud.lista;
  }

  get titulo(){
    return this.objetoCrud.titulo;
  }

  get headers() {
    const headers = [];

    for (const padrao of this.padraoLista) {
      headers.push({
        text: padrao.titulo,
        value: padrao.campoObjeto
      });
    }

    headers.push({
      text: "Ações",
      value: this.padraoLista[0].campoObjeto,
      sortable: false
    });

    return headers;
  }

  get headersLessActions() {
    const headers = [...this.headers];
    headers.pop();
    return headers;
  }

  get informacoesItem(){

    if(this.itemSelecionado){
      
      let item = {};
  
      for(const objeto of this.objeto){
        if(objeto[this.objetoCrud.campoId] === this.itemSelecionado){
          item = objeto;
          break;
        }
      }
  
      let returnText = ``;
  
      for(const listaItem of this.objetoCrud.lista){
        if(item[listaItem.campoObjeto])
          returnText += `<li>${listaItem.titulo}: ${item[listaItem.campoObjeto]}</li>`;
      }
  
      return returnText;
    }

    return "";
  
  }

  editItem(id) {}

  removeItem(id) {
    console.log("Id:", id);
    this.itemSelecionado = id;
    this.removerDialog = true;
  }
}
</script>

