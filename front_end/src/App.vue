<template>
  <v-app>
    <v-app-bar flat>
      <v-spacer />
      <v-btn icon :title="`Tema: ${theme.global.current.value.dark ? 'Dark' : 'Light'}`" @click="toggleTheme">
        <v-icon>mdi-theme-light-dark</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <Home />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import Home from '../src/views/Home.vue'
import { useTheme } from 'vuetify'
const theme = useTheme()
const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}
</script>