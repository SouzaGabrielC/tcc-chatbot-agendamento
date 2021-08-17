<template>
  <v-container fluid>
    <v-data-iterator
      :items="items"
      :items-per-page.sync="itemsPerPage"
      :page="page"
      :search="search"
      :sort-by="sortBy.toLowerCase()"
      :sort-desc="sortDesc"
      hide-default-footer
    >
      <template v-slot:header>
        <v-toolbar dark color="light-blue darken-2" class="mb-1">
          <v-text-field
            v-model="search"
            clearable
            flat
            solo-inverted
            hide-details
            prepend-inner-icon="mdi-magnify"
            label="Search"
          ></v-text-field>
          <template v-if="$vuetify.breakpoint.mdAndUp">
            <v-spacer></v-spacer>
            <v-select
              v-model="sortBy"
              flat
              solo-inverted
              hide-details
              :items="keysNome"
              prepend-inner-icon="mdi-sort"
              label="Sort by"
            ></v-select>
            <v-spacer></v-spacer>
            <v-btn-toggle v-model="sortDesc" mandatory>
              <v-btn large depressed color="blue" :value="false">
                <v-icon>mdi-arrow-up</v-icon>
              </v-btn>
              <v-btn large depressed color="blue" :value="true">
                <v-icon>mdi-arrow-down</v-icon>
              </v-btn>
            </v-btn-toggle>
          </template>
        </v-toolbar>
      </template>

      <template v-slot:default="props">
        <v-row>
          <v-col
            v-for="(item, itemIndex) in props.items"
            :key="itemIndex"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card>
              
              <v-card-title class="subheading font-weight-bold">{{ item[keys[1].valor] }}</v-card-title>

              <v-divider></v-divider>

              <v-list dense>
                <v-list-item
                  v-for="(key, index) in keys"
                  :key="index"
                  :color="sortBy === key ? `blue lighten-4` : `white`"
                >
                  <v-list-item-content>{{ key.nome }}:</v-list-item-content>
                  <v-list-item-content class="align-end">{{ item[key.valor] }}</v-list-item-content>
                </v-list-item>
              </v-list>

              <v-card-actions class="d-flex flex-row-reverse">
                <div align-self-end>
                  <v-btn color="error" @click="deletarItem(item[keys[0].valor])">
                    <v-icon>mdi-delete-outline</v-icon>
                  </v-btn>
                </div>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </template>

      <template v-slot:footer>
        <v-row class="mt-2" align="center" justify="center">
          <span class="grey--text">Items per page</span>
          <v-menu offset-y>
            <template v-slot:activator="{ on }">
              <v-btn dark text color="primary" class="ml-2" v-on="on">
                {{ itemsPerPage }}
                <v-icon>mdi-chevron-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="(number, index) in itemsPerPageArray"
                :key="index"
                @click="updateItemsPerPage(number)"
              >
                <v-list-item-title>{{ number }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <v-spacer></v-spacer>

          <span class="mr-4 grey--text">Page {{ page }} of {{ numberOfPages }}</span>
          <v-btn fab dark color="light-blue darken-2" class="mr-1" @click="formerPage">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn fab dark color="light-blue darken-2" class="ml-1" @click="nextPage">
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </v-row>
      </template>
    </v-data-iterator>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop } from "vue-property-decorator";

@Component
export default class DataGridComponent extends Vue {
  itemsPerPageArray = [4, 8, 12];
  search = "";
  filter = {};
  sortDesc = false;
  page = 1;
  itemsPerPage = 4;

  @Prop({
    required: true
  })
  sortBy;

  @Prop({
    required: true,
    type: Array
  })
  keys: {
    nome: string;
    valor: string;
  }[];

  @Prop({
    required: true,
    type: Array
  })
  items;

  get numberOfPages() {
    return Math.ceil(this.items.length / this.itemsPerPage);
  }

  // get filteredKeys () {
  //   return this.keys.filter(key => key !== `Name`)
  // }

  get keysNome() {
    return this.keys.map(key => key.valor);
  }

  nextPage() {
    if (this.page + 1 <= this.numberOfPages) this.page += 1;
  }

  formerPage() {
    if (this.page - 1 >= 1) this.page -= 1;
  }

  updateItemsPerPage(number) {
    this.itemsPerPage = number;
  }

  deletarItem(id){
    this.$emit('deletar', id);
    
  }
}
</script>
