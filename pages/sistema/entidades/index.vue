<template>
  <v-container grid-list-xs>
    <v-row>
      <v-col cols="10" offset="1">
        <v-card>
          <v-card-title primary-title class="pa-4">Entidade do Sistema</v-card-title>
          <v-divider></v-divider>
          <v-container grid-list-xs>
            <v-row>
              <v-col md="12">
                <v-container grid-list-xs>
                  <h3 class="title">Criar nova entidade</h3>
                  <br />
                  <v-form>
                    <v-row>
                      <v-col md="10" offset="1">
                        <v-text-field
                          v-model="valoresForm.nm_entidade"
                          outlined
                          rounded
                          clearable
                          counter="50"
                          name="nm_entidade"
                          prefix="@"
                          label="Nome da entidade"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="10" offset="1">
                        <v-switch
                          label="Verificar por proximidade"
                          v-model="valoresForm.ic_proximidade"
                        ></v-switch>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="10" offset="1">
                        <v-switch label="Entidade metodo?" v-model="valoresForm.ic_metodo"></v-switch>
                      </v-col>
                      <v-col v-if="valoresForm.ic_metodo" cols="10" offset="1">
                        <v-text-field
                          v-model="valoresForm.nm_metodo"
                          outlined
                          rounded
                          clearable
                          counter="50"
                          name="nm_metodo"
                          label="Nome do metodo"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row v-if="!valoresForm.ic_metodo">
                      <v-col cols="10" offset="1">
                        <valores-entidade @valores="valoresEntidadeChange" />
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
                          @click="criarEntidade"
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
                  <h3 class="title">Entidades cadastradas</h3>
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
import ValoresEntidade from "@/components/geral/valoresEntidade.vue";
import Datagrid from "@/components/geral/datagrid.vue";

@Component({
  layout: "sistema",
  components: {
    valoresEntidade: ValoresEntidade,
    Datagrid
  }
})
export default class ConveniosPage extends Vue {
  valoresForm = {
    nm_entidade: "",
    ic_sistema: true,
    ic_proximidade: false,
    ic_metodo: false,
    nm_metodo: "",
    valores: null
  };

  cabecalhos = [
    {
      nome: "Id",
      valor: "id"
    },
    {
      nome: "Nome",
      valor: "nm_entidade"
    },
    {
      nome: "Sistema",
      valor: "ic_sistema"
    },
    {
      nome: "Proximidade",
      valor: "ic_proximidade"
    },
    {
      nome: "É metodo?",
      valor: "ic_metodo"
    },
    {
      nome: "Nome metodo",
      valor: "nm_metodo"
    }
  ];

  itens = [];

  async mounted() {
    const result = await this["$axios"].get("/entidades");
    this.itens = result.data;
  }

  async criarEntidade() {
    this.valoresForm.nm_entidade = "@" + this.valoresForm.nm_entidade;
    const result = await this["$axios"].post('/entidades', this.valoresForm);
    const item = result.data;

    this.itens.push(item);
    this.limparTudo();
  }

  limparTudo() {

    this.valoresForm.nm_entidade = "";
    this.valoresForm.ic_proximidade = false;
    this.valoresForm.ic_metodo = false;
    this.valoresForm.nm_metodo = "";

  }

  valoresEntidadeChange(valores) {
    this.valoresForm.valores = valores;
  }

  async deletarItem(id) {
    const result = await this["$axios"].delete("entidades/" + id);

    this.itens.splice(
      this.itens.findIndex(item => item.id === id),
      1
    );
  }
}
</script>

