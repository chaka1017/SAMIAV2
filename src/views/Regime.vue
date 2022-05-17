<script>
import axios from "axios";
import MonPole from "@/components/Pole/MonPole.vue";

export default {
  name: "Regime",
  data: () => ({
    new_regime: true,
    nom_regime: null,
    label_message: "Creer un nouveau régime",

    mes_regimes: null,
    id_regime_selected: null,

    statut_create: false,

    id_zone_created : null,
  }),
  components: {
    MonPole,
  },
  created() {
    this.DownloadInit();
  },
  methods: {
    NewRegime() {
      this.new_regime = true;
    },

    async ModifierRegime() {
      //   alert("bonjour");
      const jeton = this.$store.state.user["token"];

      const resultat = await axios.put(
        `RegimeDetail/${this.id_regime_selected}/`,
        { nom_regime: this.nom_regime }
      );
      console.log(resultat);
      const url1 = "RegimeList/";
      const categorie = await axios.get(url1, {
        headers: { Authorization: "Bearer " + jeton },
      });
      this.mes_regimes = categorie.data.results;
    },

    async EditRegime(valeur) {
      console.log(valeur);
      this.new_regime = false;

      this.id_regime_selected = valeur;

      for (let regime of this.mes_regimes) {
        if (regime.id_regime === valeur) {
          console.log(regime.nom_regime);
          this.label_message =
            "Modifier le nom du regime " + regime.nom_regime;

          this.nom_regime = regime.nom_regime;

          console.log(this.nom_regime);
        }
      }
    },

    async CreateRegime() {
      this.label_message = "Entrez le nom du pôle";
      this.new_regime = true;
      const jeton = this.$store.state.user["token"];

      const data = { nom_regime: this.nom_regime };
      const url = "RegimeList/";
      const response = await axios.post(url, data, {
        headers: { Authorization: "Bearer " + jeton },
      });
      console.log("clicked");
      console.log(response);

      // const url1 = "RegimeList/";
      // const poles = await axios.get(url1, {
      //   headers: { Authorization: "Bearer " + jeton },
      // });
      // console.log(poles);
      // this.mes_regimes = poles.data.results;
      // this.nom_regime = null;
    },
    async DownloadInit() {
      const jeton = this.$store.state.user["token"];
      const url1 = "RegimeList/";
      const poles = await axios.get(url1, {
        headers: { Authorization: "Bearer " + jeton },
      });
      //   console.log(poles.data.results);
      this.mes_regimes = poles.data.results;
      this.nom_regime = null;
    },

    async DeleteRegime(valeur) {
      console.log(valeur);
    },

    async ValideDelete(valeur) {
      console.log(valeur);
      const jeton = this.$store.state.user["token"];

      const resultat = await axios.delete(
        `RegimeDetail/${valeur}/`
      );
      console.log(resultat);
      const url1 = "RegimeList/";
      const categorie = await axios.get(url1, {
        headers: { Authorization: "Bearer " + jeton },
      });
      //   console.log(poles.data.results);
      this.mes_regimes = categorie.data.results;
    },
  },
};
</script>

<template>
  <div class="categorie">
    <v-layout
      style="
        background: white;
        margin-bottom: 25px;
        margin-top: 0px;
        font-family: 'Open Sans', sans-serif;
      "
      class="utils py-2"
      row
      justify-space-between
      px-5
    >
      <v-flex xs12 md12 sm12>
        <v-btn
          dark
          large
          color="#F37121"
          style="
            text-transform: capitalize;
            font-size: 12px;
            height: 30px;
            font-weight: 600;
          "
          @click.prevent="NewRegime"
        >
          Nouveau regime
          <v-icon style="font-size:15px">mdi-plus</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
    <v-container>
      <v-alert dismissible dense v-if="statut_create" text type="success">
        Création effectuée avec succès
      </v-alert>
      <v-row v-if="new_regime" class="card">
        <v-col md="12" cols="12" sm="12">
          <h1 style="font-size: 35px">
            <span
              style="
                font-size: 20px;
                border-bottom: 3px solid black;
                color: black;
              "
            >
              Création de régime
            </span>
          </h1>
        </v-col>
        <v-col cols="12" sm="6" md="2">
          <v-subheader class="titres mt-2">REGION :</v-subheader>
        </v-col>
        <v-col md="8" sm="6" cols="12">
          <v-text-field
            style="font-weight: bold"
            clearable
            :label="label_message"
            v-model="nom_regime"
            type="text"
          ></v-text-field>
        </v-col>
        <v-col md="2" sm="12" class="d-flex justify-center" cols="12">
          <v-btn
            color="#21209C"
            class="mt-1"
            style="font-weight: bold; font-size: 12px"
            text
            x-large
            @click.prevent="CreateRegime"
          >
            <v-icon>mdi-send-outline</v-icon>
            Creer
          </v-btn>
        </v-col>
      </v-row>
      <v-row v-else class="card">
        <v-col cols="12" sm="6" md="2">
          <v-subheader class="titres mt-2">CATEGORIE :</v-subheader>
        </v-col>
        <v-col md="8">
          <v-text-field
            style="font-weight: bold"
            dense
            clearable
            :label="label_message"
            v-model="nom_regime"
            type="text"
            color="danger"
          ></v-text-field>
        </v-col>
        <v-col md="2" class="d-flex justify-center" cols="12">
          <v-btn
            color="#21209C"
            class="mt-1"
            style="font-weight: bold; font-size: 12px"
            text
            x-large
            @click.prevent="ModifierRegime"
          >
            <v-icon>mdi-check-outline</v-icon>
            Modifier
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
    <v-container class="d-flex justify-center">
      <v-row dense>
        <v-col v-for="(item, i) in mes_regimes" :key="i" md="4">
          <MonPole
            :nompole="item.nom_regime"
            :numero="item.id_regime"
            :titlepole="'Régime'"
            @edit-pole="EditRegime"
            @delete-pole="DeleteRegime"
            @valide-delete="ValideDelete"
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>
.card {
  background: white;
  border-radius: 15px;
  padding: 1rem;
  margin-left: 2px;

  box-shadow: rgba(136, 165, 191, 0.48)  0px 1px 2px,
    rgba(255, 255, 255, 0.8)  0px 1px 2px;
}

.titres {
  /* box-shadow: rgba(0, 0, 0, 0.1) -4px 9px 25px -6px; */
  /* box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px; */
  box-shadow: rgba(0, 0, 0, 0.35) 0px 1px 2px;
  background: #f1f1f1;
  /* color:white; */
  /* box-shadow: 0 5px 10px 0 rgba(31, 38, 135, 0.37); */
  backdrop-filter: blur(13px);
  -webkit-backdrop-filter: blur(13px);
  border-radius: 10px;
  color: black;
  cursor: default;
  font-size: 11px;
  height: 35px;
  font-weight: 800;
}
</style>