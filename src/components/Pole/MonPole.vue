<script>
export default {
  name: "MonPole",
  data: () => ({
    dialog: false,
  }),
  props: {
    title: null,
    numero: null,
    attribution: null,
    image: null,
    nompole: null,
    titlepole: null,
    nompole_bis: null,
    titlepole_bis: null,
  },
  methods: {
    validedelete(numero) {
      this.dialog = false;
      this.$emit("valide-delete", numero);
    },
  },
};
</script>


<template>
  <v-card color="#21209C" dark dense>
    <v-img
      :src="image"
      class="align-end"
      gradient="to bottom, rgba(0,0,0,.6), rgba(0,0,0,.5)"
      style="font-size: 10px; color: white"
    >
      <v-card-title style="font-size: 15px; color: white" class="">
        {{ attribution }} {{ title }}
      </v-card-title>
      <v-card-subtitle style="font-size: 12px; color: white">{{
        numero
      }}</v-card-subtitle>
      <v-card-subtitle style="font-size: 17px; color: white">
        <span
          style="font-style: italic; color: white; text-decoration: underline"
          >{{ titlepole }}</span
        >
        : {{ nompole }}</v-card-subtitle
      >
      <v-card-subtitle
        style="font-size: 13px; color: white"
        v-if="titlepole_bis"
      >
        <span
          style="font-style: italic; color: white; text-decoration: underline"
          >{{ titlepole_bis }}</span
        >
        : {{ nompole_bis }}</v-card-subtitle
      >
    </v-img>
    <!-- <v-card-subtitle>{{attri1}} : {{ attri2 }}</v-card-subtitle> -->

    <v-card-actions>
      <v-btn
        style="font-size: 12px !important"
        text
        @click.prevent="$emit('edit-pole', numero)"
      >
        <v-icon>mdi-pencil-outline</v-icon>
        Modifier
      </v-btn>
      <v-dialog v-model="dialog" persistent max-width="790">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            text
            color="#F37121"
            v-bind="attrs"
            v-on="on"
            @click="$emit('delete-pole', numero)"
            style="font-size: 12px"
          >
            <v-icon>mdi-trash-can-outline</v-icon>
            Supprimer
          </v-btn>
        </template>
        <v-card>
          <!-- <v-card-title class="text-h5">
            Voulez vous supprimer &laquo; {{ title }} &raquo;?
          </v-card-title> -->
          <v-card-text class="pt-5"
            >Cliquez sur le bouton &laquo; OK &raquo; pour supprimer &laquo;
            ANNULER &raquo; pour annuler
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              style="font-size: 12px"
              color="red darken-1"
              text
              @click="dialog = false"
            >
              annuler
            </v-btn>
            <v-btn
              style="font-size: 12px"
              color="green darken-1"
              text
              @click="validedelete(numero)"
            >
              OK
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card-actions>
  </v-card>
</template>