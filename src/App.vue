<script>
import Navbar from "@/components/navigation/Navbar";
// import Footer from "@/components/Footer";

import { mapGetters } from "vuex";
export default {
  name: "App",
  components: {
    Navbar,
    // Footer,
  },

  data: () => ({
    //
  }),
  computed: {
    ...mapGetters(["mobileView"]),
  },
};
</script>

<template>
  <v-app id="app">
    <Navbar />
    <div v-if="!mobileView"></div>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<style>
/* @import url("https://fonts.googleapis.com/css2?family=League+Spartan:wght@100&display=swap"); */
/* @import url('https://fonts.googleapis.com/css2?family=Ubuntu:wght@300&display=swap'); */
/* @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400&display=swap'); */
/* @import url('https://fonts.googleapis.com/css2?family=Arimo:wght@400;500&display=swap'); */
/* @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&display=swap'); */
/* @import url('https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@200;300;400&display=swap'); */
/* @import url('https://fonts.googleapis.com/css2?family=Slabo+27px&display=swap'); */
/* @import url('https://fonts.googleapis.com/css2?family=Antic+Slab&display=swap'); */
@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;700&display=swap');

#app {
  /* background: #f1f2f6; */
  /* font-family: "Open Sans", sans-serif; */
  /* font-family: "League Spartan", sans-serif; */
  /* font-family: 'Ubuntu', sans-serif; */
  /* font-family: 'Arimo', sans-serif; */
  /* font-family: 'Source Code Pro', monospace; */
  /* font-family: 'DM Sans', sans-serif; */
  /* font-family: 'Antic Slab', serif; */
  font-size: 10px;
  /* font-family: 'Slabo 27px', serif; */
  font-family: 'Baloo 2', cursive;
  /* position: relative; */
}
.ps {
  height: 650px;
}
</style>

