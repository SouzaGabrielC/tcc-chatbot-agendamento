<template>
  <v-container grid-list-xs>
    <v-row>
      <v-col cols="10" offset="1">
        <v-card>
          <v-card-title primary-title class="pa-4">Clinicas</v-card-title>
          <v-divider></v-divider>
          <v-container grid-list-xs>
            <v-row>
              <v-col md="12">
                <v-container grid-list-xs>
                  <h3 class="title">Criar nova clinica</h3>
                  <br />
                  <v-form>
                    <v-row>
                      <v-col md="10" offset="1">
                        <v-text-field
                          v-model="valoresForm.nm_clinica"
                          outlined
                          rounded
                          clearable
                          counter="100"
                          name="nm_clinica"
                          label="Nome da clinica"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col md="10" offset="1">
                        <v-text-field
                          v-model="valoresForm.ds_site"
                          outlined
                          rounded
                          clearable
                          counter="100"
                          name="ds_site"
                          label="Site clinica"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <br />
                    <v-row justify="end">
                      <v-col cols="2">
                        <v-btn
                          block
                          rounded
                          large
                          color="error"
                          dark
                          right
                          @click="limparTudo"
                        >Limpar</v-btn>
                      </v-col>
                      <v-col cols="2">
                        <v-btn
                          block
                          rounded
                          large
                          color="success"
                          dark
                          right
                          @click="criarCategoria"
                        >Criar</v-btn>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-container>
              </v-col>
            </v-row>
            <v-row>
              <v-col md="12">
                <v-container>
                  <h3 class="title">Clinicas cadastradas</h3>
                  <datagrid :keys="cabecalhos" :items="itens" sortBy="nome" @deletar="deletarItem" />
                </v-container>
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
  layout: "sistema",
  components: {
    Datagrid
  }
})
export default class ClinicasPage extends Vue {
  baseUrl = "http://localhost:1234/clinicas";

  urls = {
    pegarTodos: this.baseUrl,
    criarUm: this.baseUrl,
    deletarUm: this.baseUrl
  };

  valoresForm = {
    nm_clinica: "",
    ds_site: ""
  };

  cabecalhos = [
    {
      nome: "Id",
      valor: "id_clinica"
    },
    {
      nome: "Nome",
      valor: "nm_clinica"
    },
    {
      nome: "Site",
      valor: "ds_site"
    }
  ];

  itens =  [];

  async mounted() {
    const result = await this["$axios"].get(this.urls.pegarTodos);
    this.itens = result.data;
  }

  async criarCategoria() {
    const result = await this["$axios"].post(this.urls.criarUm, {
      nm_clinica: this.valoresForm.nm_clinica,
      ds_site: this.valoresForm.ds_site
    });
    const item = result.data;
    this.itens.push(item);
  }

  limparTudo() {
    this.valoresForm.nm_clinica = "";
    this.valoresForm.ds_site = "";
  }

  async deletarItem(id) {
    console.log("Deletar Item", id);

    const result = await this["$axios"].delete(this.urls.deletarUm + "/" + id);

    this.itens.splice(
      this.itens.findIndex(item => item.id_categoria === id),
      1
    );
  }
}
</script>

