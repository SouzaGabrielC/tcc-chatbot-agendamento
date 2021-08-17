<template>
  <div class="mensagem" :class="{'enviada': enviada, 'recebida': !enviada}" :data-id="id">
    <v-avatar v-if="!enviada" color="#f5f5f5">
      <v-icon light>mdi-robot</v-icon>
    </v-avatar>
    <v-card>
      <div class="text" v-html="textoTratado"></div>
      <br v-if="opcoes">
      <v-col class="pa-1" v-for="(opcao,index) of opcoes" :key="index">
        <v-btn :disabled="opcoesDisabled" color="success" @click="clicouOpcao($event, opcao.vl_opcao)">{{opcao.ds_opcao}}</v-btn>
      </v-col>
      <div class="infos">
        <div class="time">
          <small>{{time}}</small>
        </div>
        <div v-if="enviada" class="visualizacao">
          <v-icon size="16" :color="corVisualizado">mdi-eye</v-icon>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
  props: {
    enviada: {
      default: true,
      type: Boolean
    },
    id: {
      type: Number
    }
  }
})
export default class Mensagem extends Vue {
  @Prop({ type: Date, default: () => new Date() }) timestamp!: Date;
  @Prop({ type: Boolean }) visualizada!: boolean;
  @Prop({ type: Array, default: [] }) opcoes: {ds_opcao: string; vl_opcao: string}[];
  @Prop({ default: "", type: String }) texto: string;

  opcoesDisabled = false;

  get time() {
    return `${this.timestamp.getHours()}:${(
      "0" + this.timestamp.getMinutes()
    ).slice(-2)}`;
  }

  get corVisualizado() {
    if (this.visualizada) return "#03a9f4";

    return "#519657";
  }

  clicouOpcao(event, valor){
    this.$emit('clickOpcao', `Opção: ${valor}`);
    this.opcoesDisabled = true;
  }

  mounted() {
    if (this.$props.enviada || this.$store.state.isAtBottom) {
      this.$el.scrollIntoView({ behavior: "smooth" });
    }
  }

  get textoTratado(){
    return this.texto && typeof this.texto === 'string' ? this.texto.replace(/\n/g, '</br>') : '';
  }

}
</script>

<style lang="scss" scoped>
.mensagem {
  width: 100%;
  display: flex;
  margin: 1em 0.5em;

  .v-avatar {
    margin: 0 1em;
  }

  .v-card {
    max-width: 80%;
    padding: 1em 1em 0.3em 1.2em;
    font-size: 1.1em;
    margin: 0 0.3em;

    .text {
      margin: 0 1em 0 0;
    }
    .infos {
      position: relative;
      bottom: 0;
      display: flex;
      justify-content: flex-end;
    }
  }

  @media (max-width: 768px) {
    margin: 0 0 1.5em 0;
    .v-avatar {
      margin: 0 0.8em 0 0;
    }
  }
}

.mensagem.enviada {
  justify-content: flex-end;

  .v-card {
    background-color: #81c784;
    color: white;
    margin: 0 1.5em;

    .infos {
      .time {
        font-weight: 600;
        color: #519657;
      }
      .visualizacao {
        padding: 0 3px;
      }
    }
  }

  .v-card::before {
    content: "";
    position: absolute;
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;
    border-left: 10px solid #000;
    border-left-color: rgb(0, 0, 0);
    text-decoration: inherit;
    vertical-align: inherit;
    box-sizing: inherit;
    bottom: 5px;
    border-left-color: rgba(0, 0, 0, 0.12);
    left: 100%;
  }

  .v-card::after {
    content: "";
    position: absolute;
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;
    border-left: 10px solid #000;
    border-left-color: #81c784;
    bottom: 7px;
    text-decoration: inherit;
    vertical-align: inherit;
    box-sizing: inherit;
    left: 100%;
  }
}

.mensagem.recebida {
  .v-card {
    background-color: #f5f5f5;
    color: black;

    .infos {
      .time {
        font-weight: 600;
        color: #a3a3a3;
      }
    }
  }

  .v-card::before {
    content: "";
    position: absolute;
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;
    border-right: 10px solid #000;
    border-right-color: rgb(0, 0, 0);
    text-decoration: inherit;
    vertical-align: inherit;
    box-sizing: inherit;
    top: 12px;
    border-right-color: rgba(0, 0, 0, 0.12);
    right: 100%;
  }

  .v-card::after {
    content: "";
    position: absolute;
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;
    border-right: 10px solid #000;
    border-right-color: #f5f5f5;
    top: 10px;
    text-decoration: inherit;
    vertical-align: inherit;
    box-sizing: inherit;
    right: 100%;
  }
}
</style>


