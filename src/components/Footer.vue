<script>
export default {
  name: "Footer",
  data: () => ({
    icons: ["mdi-facebook", "mdi-twitter", "mdi-linkedin", "mdi-instagram"],
  }),
};
</script>

<template>
  <v-footer dark padless>
    <v-card flat tile class="text-center" color="#ecf0f1">
      <v-divider></v-divider>
      <v-card-text style="color: black">
        {{ new Date().getFullYear() }} —
        <strong>SAMIA - Systeme d'Administration et de Gestion des Missions</strong>
      </v-card-text>
    </v-card>
  </v-footer>
</template>