<template>
  <v-layout fill-height>
    <v-flex xs12 md10 fill-height style="padding: 0">
      <v-card id="main-card">
        <v-toolbar color="primary" id="chat-top" dark>
          {{nomeAtendente}}
          <v-spacer></v-spacer>
          <!-- <v-menu bottom left>
            <template v-slot:activator="{ on }">
              <v-btn dark icon v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item>
                <v-list-item-title>Mais Informações</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Relatar um problema</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu> -->
        </v-toolbar>
        <v-container id="chat-body" @scroll="onMessagesScroll" fill-height>
          <div class="mensagens">
            <mensagem
              v-for="message of messages"
              :key="message._id"
              :enviada="message.fromUser"
              :texto="message.texto"
              :timestamp="new Date(message.data)"
              :visualizada="message.visualizada"
              :id="message._id"
              :opcoes="message.opcoes"
              @clickOpcao="enviarOpcao"
            />
          </div>
        </v-container>
        <v-footer id="chat-footer">
          <v-btn color="primary" dark medium absolute top right fab @click="showMore = true">
            <v-icon>mdi-plus</v-icon>
          </v-btn>

          <v-expand-transition>
            <div>
              <v-btn
                color="#adadad"
                @click="goBottom"
                transition="slide-x-transition"
                dark
                small
                absolute
                top
                right
                fab
                style="top: -80px; right: 25px;"
                v-show="showGoToBottom"
              >
                <v-icon size="22px">mdi-chevron-down</v-icon>
              </v-btn>
              <v-btn
                color="#81c784"
                transition="slide-x-transition"
                dark
                absolute
                top
                right
                fab
                style="top: -58px; right: 52px; width: 20px; height: 20px; font-size: 10px"
                v-show="showGoToBottom && showNewMessages"
              >{{newMessagesCount}}
              </v-btn>
            </div>
          </v-expand-transition>

          <textarea
            placeholder="Escreva algo...."
            v-model="messageText"
            @keypress.exact.prevent.enter="sendMessage"
          ></textarea>
        </v-footer>
      </v-card>
    </v-flex>

    <v-bottom-sheet v-model="showMore" id="chat-more-menu">
      <v-list>
        <v-subheader>Opções</v-subheader>
        <!-- <v-list-item @click="()=> { showMore = false }">
          <v-list-item-avatar>
            <v-avatar size="32px" tile>
              <v-icon>mdi-paperclip</v-icon>
            </v-avatar>
          </v-list-item-avatar>
          <v-list-item-title>Anexo</v-list-item-title>
        </v-list-item> -->
        <v-list-item @click="()=> { showMore = false; openGlossario = true }">
          <v-list-item-avatar>
            <v-avatar size="32px" tile>
              <v-icon>mdi-book</v-icon>
            </v-avatar>
          </v-list-item-avatar>
          <v-list-item-title>Glossario</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-bottom-sheet>

    <div v-if="windowWidth >= 1024">
      <glossario-desktop
        :open="openGlossario"
        @closed="() => { openGlossario = false}"
        @palavra:clicada="inserirPalavra"
        class="dialogo"
      />
    </div>

    <div v-if="windowWidth < 1024">
      <glossario-mobile
        :open="openGlossario"
        @closed="() => { openGlossario = false}"
        @palavra:clicada="inserirPalavra"
        class="dialogo"
      />
    </div>

    <disconnect-aviso :open="disconnected"/>
  </v-layout>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from "vue-property-decorator";

    import Socket from "@/classes/Socket";
    import Message from "@/interfaces/chat/Message";

    import Mensagem from "@/components/chat/Mensagem.vue";
    import GlossarioDesktop from "@/components/chat/GlossarioDesktop.vue";
    import GlossarioMobile from "@/components/chat/GlossarioMobile.vue";
    import DisconnectAviso from "@/components/chat/DisconnectAviso.vue";
    import {setTimeout} from "timers";

    let scrollTimeoutDebounce;

    @Component({
        name: "Chat",
        layout: "chat",
        components: {
            Mensagem,
            GlossarioDesktop,
            GlossarioMobile,
            DisconnectAviso
        },
        head(){
            return {
                title: this['pageTitle']
            }
        }
    })
    export default class Chat extends Vue {
        showMore: boolean = false;

        fab: boolean = false;

        showGoToBottom: boolean = false;

        messageText: string = "";

        newMessages: string[] = [];

        openGlossario: boolean = false;

        windowWidth: number = 0;

        nomeAtendente = "Encontrando atendente...";

        disconnected: boolean = false;

        pageTitle = "";

        async mounted() {

            const salaId = await this.$store.dispatch('chat/verifySalaId');

            console.log('Sala id from last call: ', salaId);

            const socket = new Socket("localhost", 1234, this.$route.params.id, salaId);

            socket.subscribeMessage(message => {
                this.$store.dispatch("messages/receiveMessage", message);
            });

            socket.subscribeMesagenVisualizada(messageId => {
                setTimeout(() => {
                    this.$store.dispatch("messages/changeToVisualizada", messageId);
                }, 100);
            });

            socket.subscribeRecuperaMensagens(mensagens => {
                mensagens.forEach(mensagem => this.$store.dispatch("messages/receiveMessage", mensagem));
            });

            socket.subscribeSocketDisconnect(() => {
                this.disconnected = true;
            });

            this.$store.commit("chat/setClinicaId", this.$route.params.id);

            socket.startConversation((infos) => {
                this.$store.dispatch('chat/setSalaId', infos.salaId);
                this.pageTitle = `Chat da clinica ${infos.nomeClinica}`;
                this.nomeAtendente = infos.nomeBot;
                console.log('infos', infos);
            });

            window.onresize = this.checkResize;
            this.windowWidth = window.innerWidth;

        }

        @Watch("messages")
        onMessages(newMessages, oldMessages) {
            if (this.showGoToBottom) {
                this.newMessages.push(newMessages[newMessages.length - 1]._id);
                // this.atualizaMensagensTitulo();
            } else {
                setTimeout(() => {
                    this.goBottom();

                }, 100)
            }
        }

        get messages(): Message[] {
            return this.$store.state.messages.messages;
        }

        get showNewMessages() {
            return this.newMessages.length > 0;
        }

        get newMessagesCount() {
            return this.newMessages.length;
        }

        get clinicaId() {
            return this.$store.state.chat.clinicaId;
        }

        onMessagesScroll(el) {
            let target;

            if (!el.target && el) target = el;
            else if (el.target) target = el.target;
            else return;

            const difference =
                target.scrollHeight - target.scrollTop - target.clientHeight;

            const differenceMargin = this.windowWidth >= 768 ? 150 : 250;

            if (difference > differenceMargin && !this.showGoToBottom) {
                this.showGoToBottom = true;
                this.$store.commit("chat/notAtBottom");
            } else if (difference <= 100 && this.showGoToBottom) {
                this.showGoToBottom = false;
                this.$store.commit("chat/atBottom");

                this.newMessages = [];
                // this.atualizaMensagensTitulo();
            }
        }

        checkResize() {
            this.onMessagesScroll(document.querySelector("#chat-body"));
            this.windowWidth = window.innerWidth;
        }

        sendMessage() {
            if (this.messageText.trim() !== "") {
                this.$store.dispatch("messages/sendMessage", this.messageText);
                this.messageText = "";
            }
        }

        enviarOpcao(valor) {
            this.$store.dispatch("messages/sendMessage", valor);
            this.messageText = "";
        }

        goBottom() {
            document
                .querySelector(".mensagem:last-child")
                .scrollIntoView({behavior: "smooth"});
            this.showGoToBottom = false;
            this.$store.commit("chat/atBottom");
        }

        // atualizaMensagensTitulo() {
        //     document.title = `${
        //         this.newMessagesCount > 0 ? `(${this.newMessagesCount})` : ""
        //     } Chat da clinica [[Nome da clinica]]`;
        // }

        inserirPalavra(palavra) {
            this.messageText = this.messageText.trim() + ` ${palavra}`;
        }
    }
</script>

<style lang="scss" scoped>
  #main-card {
    height: 100%;
    position: relative;

    #chat-top {
      height: 65px;
      color: white;
      position: absolute;
      top: 0;
      z-index: 200;
      width: 100%;
    }

    #chat-body {
      box-sizing: border-box;
      overflow-y: auto;
      padding: 0;
      position: absolute;
      top: 65px;
      bottom: 100px;
      height: calc(100% - 165px);
      margin: 0;

      .mensagens {
        padding: 2em 1em 2.5em 1em;
        width: 100%;
        min-height: 100%;
        position: absolute;
        top: 0;
        z-index: 0;
      }

      @media (max-width: 768px) {
        .mensagens {
          padding: 2em 0.4em 2.5em 0.4em;
        }
      }
    }

    #chat-footer {
      position: absolute;
      min-height: 100px;
      padding: 5px;
      width: 100%;
      bottom: 0;
      z-index: 200;

      textarea {
        height: 100%;
        resize: none;
        width: 90%;
        padding: 1em;
        font-size: 1.2em;
      }

      textarea:focus {
        outline: 0;
      }
    }

    @media (max-width: 768px) {
      box-shadow: none;
    }
  }

  #chat-more-menu {
    z-index: 201;
  }


</style>



