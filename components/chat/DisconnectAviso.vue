<template>
  <v-dialog v-model="openDialog" persistent max-width="40%" transition="dialog-transition">
    <v-card color="blue-grey darken-2" class="white--text">
      <v-card-title primary-title>
        <div>
          <div class="headline">Chat desconectado</div>
        </div>
      </v-card-title>
      <v-card-text>
        <div>
          <span>Aparentemente tivemos um problema, aguarde alguns segundos, ou recarregue a pagina agora, para tentar conectar novamente.</span>
        </div>
        <br />
        <div>
          <span>Página irá recarregar automaticamente em {{segundos}} segundos...</span>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn flat dark @click="refreshPage">Recarregar agora</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component({})
export default class GlossarioDesktop extends Vue {
  @Prop({ required: true }) open;

  segundos = 0;

  private interval;

  get openDialog() {
    return this.open;
  }

  set openDialog(value) {
    if (!value) this.$emit("closed");
  }

  @Watch("open")
  onOpen(newValue, oldValue) {
    if (newValue) {
      this.startTimer(20);
    }else{
      this.stopTimer();
    }
  }

  startTimer(segundos) {
    this.segundos = segundos;
    this.interval = setInterval(
      () =>
        this.segundos > 0
          ? this.segundos--
          : (() => {
              this.stopTimer();
              this.refreshPage();
            })(),
      1000
    );
  }

  stopTimer(){
    if(this.interval)
      clearInterval(this.interval);
  }

  refreshPage() {
    window.location.reload();
  }
}
</script>

<style lang="scss" scoped>
</style>
