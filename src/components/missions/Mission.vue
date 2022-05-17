<script>
export default {
  name: "Mision",

  props: {
    objet_mission: null,
    id_mission: null,
    num_mission: null,
    destination: null,
    date_depart: null,
    date_retour: null,
    statut_justifie: null,
    chef_mission: null,
  },
  methods: {
    showerMission(id) {
      this.$emit("show-mission", id);
    },
  },
};
</script>

<template>
  <div class="mission" style="padding: 0px; margin: 0px; color: #2f3640">
    <v-list-item class="mission" @click.prevent="showerMission(id_mission)">
      <v-list-item-content>
        <v-list-item-title style="font-size: 1rem">
          {{ objet_mission }}</v-list-item-title
        >
        <v-list-item-subtitle>
          Numéro : {{ num_mission }}
        </v-list-item-subtitle>
        <v-list-item-subtitle>
          Destinations :
          <span v-for="(item, i) in destination" :key="i">{{ item }} - </span>
        </v-list-item-subtitle>
        <v-list-item-subtitle>
          Chef de délégation : {{ chef_mission }}
        </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-action class="d-flex d-sm-none">
        <v-btn icon @click="alert('bonjour')">
          <v-icon color="#2f3640">mdi-stretch-to-page-outline</v-icon>
        </v-btn>
      </v-list-item-action>
    </v-list-item>
    <v-divider></v-divider>
  </div>
</template>

<style>
/*  */

p {
  margin: 0 !important;
}

.mission {
}
</style>
