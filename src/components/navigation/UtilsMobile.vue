<script>
import { mapGetters } from "vuex";
export default {
  name: "Utils",
  computed: {
    ...mapGetters(["displayUtils", "displayForm", "permissions_user"]),
  },
  methods: {
    
  },
};
</script>

<template>
  <div class="utils">
    <v-flex xs12 md12 sm12>
      <v-btn
        color="#F37121"
        dark
        style="text-transform: capitalize"
      >
        Nouvelle mission
        <v-icon style="font-size: 15px">mdi-plus</v-icon>
      </v-btn>
    </v-flex>
  </div>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;800&display=swap");
.utils {
  font-family: "Open Sans", sans-serif;
  background: white;
  padding: 10px;
}
</style>