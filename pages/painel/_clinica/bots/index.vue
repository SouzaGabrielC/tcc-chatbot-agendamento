<template>
  <v-container grid-list-xs>
    <v-row>
      <v-col cols="10" offset="1">
        <v-card>
          <v-card-title primary-title class="pa-4">Bots</v-card-title>
          <v-divider></v-divider>
          <v-container grid-list-xs>
            <v-row>
              <v-col md="12">
                <v-container grid-list-xs>
                  <h3 class="title">Criar novo bot</h3>
                  <br />
                  <v-form>
                    <v-row>
                      <v-col md="10" offset="1">
                        <v-text-field
                          v-model="valoresForm.nm_bot"
                          outlined
                          rounded
                          clearable
                          counter="50"
                          name="nm_bot"
                          label="Nome do bot"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col md="10" offset="1">
                        <v-text-field
                          v-model="valoresForm.ds_bot"
                          outlined
                          rounded
                          clearable
                          counter="100"
                          name="ds_bot"
                          label="Descrição do Bot"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="10" offset="1">
                        <v-switch label="Habilitado?" v-model="valoresForm.ic_habilitado"></v-switch>
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
  layout: "painel",
  components: {
    Datagrid
  }
})
export default class BotsPage extends Vue {

  valoresForm = {
    nm_bot: "",
    ds_bot: "",
    ic_habilitado: false
  };

  cabecalhos = [
    {
      nome: "Id",
      valor: "id"
    },
    {
      nome: "Nome",
      valor: "nm_bot"
    },
    {
      nome: "Descrição",
      valor: "ds_bot"
    },
    {
      nome: "Habilitado",
      valor: "ic_habilitado"
    }
  ];

  itens =  [];

  async mounted() {
    const result = await this["$axios"].get(`/clinicas/${this.$route.params.clinica}/bots`);
    this.itens = result.data;
  }

  async criarBot() {
    const result = await this["$axios"].post(`/clinicas/${this.$route.params.clinica}/bots`, {
      ...this.valoresForm,
      "id_clinica": this.$route.params.clinica
    });
    const item = result.data;
    this.itens.push(item);
  }

  limparTudo() {
    
  }

  async deletarItem(id) {
    // console.log("Deletar Item", id);

    // const result = await this["$axios"].delete(this.urls.deletarUm + "/" + id);

    // this.itens.splice(
    //   this.itens.findIndex(item => item.id_categoria === id),
    //   1
    // );
  }
}
</script>

