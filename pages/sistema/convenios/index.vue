<template>
  <v-container grid-list-xs>
    <v-row>
      <v-col cols="10" offset="1">
        <v-card>
          <v-card-title primary-title class="pa-4">Convenios</v-card-title>
          <v-divider></v-divider>
          <v-container grid-list-xs>
            <v-row>
              <v-col md="12">
                <v-container grid-list-xs>
                  <h3 class="title">Criar novo convenio</h3>
                  <br />
                  <v-form>
                    <v-row>
                      <v-col md="10" offset="1">
                        <v-text-field
                          v-model="valoresForm.nm_convenio"
                          outlined
                          rounded
                          clearable
                          counter="50"
                          name="nm_convenio"
                          label="Nome do convenio"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col md="10" offset="1">
                        <v-text-field
                          v-model="valoresForm.ds_email"
                          outlined
                          rounded
                          clearable
                          counter="100"
                          name="ds_email"
                          label="Email contato convenio"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col md="10" offset="1">
                        <v-text-field
                          v-model="valoresForm.cd_telefone"
                          outlined
                          rounded
                          clearable
                          counter="11"
                          name="cd_telefone"
                          label="Telefone contato convenio"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col md="10" offset="1">
                        <v-text-field
                          v-model="valoresForm.cd_cnpj"
                          outlined
                          rounded
                          clearable
                          counter="14"
                          name="nm_categoria"
                          label="CNPJ convenio"
                        ></v-text-field>
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
                  <h3 class="title">Convenios cadastrados</h3>
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
export default class ConveniosPage extends Vue {
  baseUrl = "http://localhost:1234/convenios";

  urls = {
    pegarTodos: this.baseUrl,
    criarUm: this.baseUrl,
    deletarUm: this.baseUrl
  };

  valoresForm = {
    nm_convenio: "",
    ds_email: "",
    cd_telefone: "",
    cd_cnpj: "",
    sinonimos: []
  };

  cabecalhos = [
    {
      nome: "Id",
      valor: "id_convenio"
    },
    {
      nome: "Nome",
      valor: "nm_convenio"
    },
    {
      nome: "E-mail",
      valor: "ds_email"
    },
    {
      nome: "Telefone",
      valor: "cd_telefone"
    },
    {
      nome: "CNPJ",
      valor: "cd_cnpj"
    },
    {
      nome: "Sinonimos",
      valor: "sinonimos"
    }
  ];

  itens =  [];

  async mounted() {
    const result = await this["$axios"].get(this.urls.pegarTodos);
    this.itens = result.data;
    this.itens.forEach(item => {
      item.sinonimos = item.sinonimos.map(sinonimo => sinonimo.nm_sinonimo_convenio).join(', ');
    });
  }

  changeValoresSinonimos(valores) {
    this.valoresForm.sinonimos = valores;
  }

  async criarCategoria() {
    const result = await this["$axios"].post(this.urls.criarUm, {
      nm_convenio: this.valoresForm.nm_convenio,
      ds_email: this.valoresForm.ds_email,
      cd_telefone: this.valoresForm.cd_telefone,
      cd_cnpj: this.valoresForm.cd_cnpj,
      sinonimos: this.valoresForm.sinonimos
    });
    const item = result.data;
    item.sinonimos = item.sinonimos.map(sinonimo => sinonimo.nm_sinonimo_convenio).join(', ');
    this.itens.push(item);
  }

  limparTudo() {
    this.valoresForm.nm_convenio = "";
    this.valoresForm.ds_email= "";
    this.valoresForm.cd_telefone= "";
    this.valoresForm.cd_cnpj= "";
  }

  async deletarItem(id) {
    console.log("Deletar Item", id);

    const result = await this["$axios"].delete(this.urls.deletarUm + "/" + id);

    this.itens.splice(
      this.itens.findIndex(item => item.id_convenio === id),
      1
    );
  }
}

</script>

