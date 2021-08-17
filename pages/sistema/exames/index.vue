<template>
  <v-container grid-list-xs>
    <v-row>
      <v-col cols="10" offset="1">
        <v-card>
          <v-card-title primary-title class="pa-4">Exames do Sistema</v-card-title>
          <v-divider></v-divider>
          <v-container grid-list-xs>
            <v-row>
              <v-col md="12">
                <v-container grid-list-xs>
                  <h3 class="title">Criar novo exame</h3>
                  <br />
                  <v-form>
                    <v-row>
                      <v-col md="10" offset="1">
                        <v-text-field
                          v-model="valoresForm.nm_exame"
                          outlined
                          rounded
                          clearable
                          counter="50"
                          name="nm_exame"
                          label="Nome do exame"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col md="10" offset="1">
                        <v-combobox
                          outlined
                          rounded
                          v-model="valoresForm.categoria"
                          :items="categoriasExame"
                          label="Categorias exame"
                        ></v-combobox>
                      </v-col>
                    </v-row>
                    <v-row>
                      <sinonimos @valores="changeValoresSinonimos" />
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
                          @click="criarExame"
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
                  <h3 class="title">Exames cadastrados</h3>
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
    sinonimos: SinonimosComponent,
    Datagrid
  }
})
export default class ExamesPage extends Vue {

  valoresForm = {
    nm_exame: "",
    categoria: null,
    sinonimos: []
  };

  categoriasExame = [];

  cabecalhos = [
    {
      nome: "Id",
      valor: "id_exame"
    },
    {
      nome: "Nome",
      valor: "nm_exame"
    },
    {
      nome: "Categoria",
      valor: "categoria"
    },
    {
      nome: "Sinonimos",
      valor: "sinonimos"
    }
  ];

  itens = [];

  async mounted() {

    const result = await this["$axios"].get('/exames');
    this.itens = result.data;

    this.itens.forEach(item => {
      item.sinonimos = item.sinonimos
        .map(sinonimo => sinonimo.nm_sinonimo_exame)
        .join(", ");
      item.categoria = item.categoria.nm_categoria
    });

    const resultCategorias = await this["$axios"].get('/categorias');

    this.categoriasExame = resultCategorias.data.map(categoria => ({
      value: categoria.id_categoria,
      text: categoria.nm_categoria
    }));

  }

  changeValoresSinonimos(valores) {
    this.valoresForm.sinonimos = valores;
  }

  async criarExame() {
    const result = await this["$axios"].post('/exames', {
     nm_exame: this.valoresForm.nm_exame,
     id_categoria: this.valoresForm.categoria.value,
     sinonimos: this.valoresForm.sinonimos
    });
    const item = result.data;
    item.sinonimos = item.sinonimos
      .map(sinonimo => sinonimo.nm_sinonimo_exame)
      .join(", ");
    item.categoria = item.categoria.nm_categoria;
    this.itens.push(item);

  }

  limparTudo() {
    this.valoresForm.nm_exame = "";
    this.valoresForm.categoria = null;
    this.valoresForm.sinonimos = [];
  }

  async deletarItem(id) {

    const result = await this["$axios"].delete("/exames/" + id);

    this.itens.splice(this.itens.findIndex(item => item.id_exame === id), 1);
  }
}
</script>

