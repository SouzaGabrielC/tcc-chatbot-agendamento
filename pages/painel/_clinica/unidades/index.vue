<template>
  <v-container grid-list-xs>
    <v-row>
      <v-col cols="10" offset="1">
        <v-card>
          <v-card-title primary-title class="pa-4">Unidades</v-card-title>
          <v-divider></v-divider>
          <v-container grid-list-xs>
            <v-row>
              <v-col md="12">
                <v-container grid-list-xs>
                  <h3 class="title">Criar nova unidade</h3>
                  <br />
                  <v-form>
                    <v-row>
                      <v-col md="10" offset="1">
                        <v-text-field
                          v-model="valoresForm.nm_unidade"
                          outlined
                          rounded
                          clearable
                          counter="50"
                          name="nm_unidade"
                          label="Nome da unidade"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="10" offset="1">
                        <v-switch label="Matriz?" v-model="valoresForm.ic_matriz"></v-switch>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col md="10" offset="1">
                        <v-text-field
                          v-model="valoresForm.cd_cep"
                          outlined
                          rounded
                          clearable
                          counter="10"
                          name="cd_cep"
                          label="CEP"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col md="10" offset="1">
                        <v-text-field
                          v-model="valoresForm.nm_rua"
                          outlined
                          rounded
                          clearable
                          counter="100"
                          name="nm_rua"
                          label="Rua"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col md="10" offset="1">
                        <v-text-field
                          v-model="valoresForm.cd_numero"
                          outlined
                          rounded
                          clearable
                          counter="10"
                          name="cd_numero"
                          label="Número"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col md="10" offset="1">
                        <v-text-field
                          v-model="valoresForm.ds_complemento"
                          outlined
                          rounded
                          clearable
                          counter="10"
                          name="ds_complemento"
                          label="Complemento"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col md="10" offset="1">
                        <v-text-field
                          v-model="valoresForm.nm_bairro"
                          outlined
                          rounded
                          clearable
                          counter="50"
                          name="nm_bairro"
                          label="Bairro"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col md="10" offset="1">
                        <v-text-field
                          v-model="valoresForm.nm_cidade"
                          outlined
                          rounded
                          clearable
                          counter="50"
                          name="nm_cidade"
                          label="Cidade"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col md="10" offset="1">
                        <v-text-field
                          v-model="valoresForm.nm_estado"
                          outlined
                          rounded
                          clearable
                          counter="50"
                          name="nm_estado"
                          label="Estado"
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
                          counter="16"
                          name="cd_cnpj"
                          label="CNPJ"
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
                          @click="criarBot"
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
                  <h3 class="title">Unidades cadastradas</h3>
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
  layout: "painel",
  components: {
    Datagrid
  }
})
export default class UnidadesPage extends Vue {

  valoresForm = { 
  };

  cabecalhos = [
    {
      nome: "Id",
      valor: "id_unidade"
    },
    {
      nome: "Nome",
      valor: "nm_unidade"
    },
    {
      nome: "Matriz",
      valor: "ic_matriz"
    },
    {
      nome: "Rua",
      valor: "nm_rua"
    },
    {
      nome: "Numero",
      valor: "cd_numero"
    },
    {
      nome: "Complemento",
      valor: "ds_complemento"
    }
  ];

  itens =  [];

  async mounted() {
    const result = await this["$axios"].get(`/clinicas/${this.$route.params.clinica}/unidades`);
    this.itens = result.data.unidades.map(unidade => {
      unidade.ic_matriz = unidade.ic_matriz ? "Sim" : "Não";
      return unidade;
    });
  }

  async criarBot() {
    const result = await this["$axios"].post(`unidades`, {
      ...this.valoresForm,
      "id_clinica": this.$route.params.clinica
    });
    const item = result.data;
    this.itens.push(item);
  }

  limparTudo() {
    
  }

  async deletarItem(id) {
    console.log("Deletar Item", id);

    const result = await this["$axios"].delete(`unidades/${id}`);

    this.itens.splice(
      this.itens.findIndex(item => item.id_categoria === id),
      1
    );
  }
}
</script>

