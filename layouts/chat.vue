<template>
  <v-app id="chat-app">
    <v-container grid-list-xs id="chat-container" fill-height>
      <nuxt />
    </v-container>
  </v-app>
</template>

<style lang="scss" scoped>
#chat-app {
  max-height: 100vh;
}

html, body{
  padding: 0;
  margin: 0;
}

@media (max-width: 700px) {
  #chat-container {
    padding: 0;
  }
}
</style>

