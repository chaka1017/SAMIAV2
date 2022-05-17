<script>
import axios from "axios";
import MonPole from "@/components/Pole/MonPole.vue";

export default {
  name: "Categorie",
  data: () => ({
    new_catgorie: true,
    nom_categorie: null,
    label_message: "Creer une nouvelle catégorie",

    mes_categories: null,
    id_categorie_selected: null,

    statut_create: false,
  }),
  components: {
    MonPole,
  },
  created() {
    this.DownloadInit();
  },
  methods: {
    NewCategorie() {
      this.new_catgorie = true;
    },

    async ModifierCategorie() {
      //   alert("bonjour");
      const jeton = this.$store.state.user["token"];

      const resultat = await axios.put(
        `CategorieDetail/${this.id_categorie_selected}/`,
        { nom_categorie: this.nom_categorie }
      );
      console.log(resultat);
      const url1 = "CategorieList/";
      const categorie = await axios.get(url1, {
        headers: { Authorization: "Bearer " + jeton },
      });
      this.mes_categories = categorie.data.results;
    },

    async EditCategorie(valeur) {
      console.log(valeur);
      console.log(this.items);
      this.new_catgorie = false;

      this.id_categorie_selected = valeur;

      for (let categorie of this.mes_categories) {
        if (categorie.id_categorie === valeur) {
          console.log(categorie.nom_categorie);
          this.label_message =
            "Modifier le nom de la régime " + categorie.nom_categorie;

          this.nom_categorie = categorie.nom_categorie;

          console.log(this.nom_categorie);
        }
      }
    },

    async CreateCategorie() {
      this.label_message = "Entrez le nom du pôle";
      this.new_catgorie = true;
      const jeton = this.$store.state.user["token"];

      const data = { nom_categorie: this.nom_categorie };
      const url = "CategorieList/";
      const response = await axios.post(url, data, {
        headers: { Authorization: "Bearer " + jeton },
      });
      console.log("clicked");
      console.log(response);

      const url1 = "CategorieList/";
      const poles = await axios.get(url1, {
        headers: { Authorization: "Bearer " + jeton },
      });
      console.log(poles);
      this.mes_categories = poles.data.results;
      this.nom_categorie = null;
    },
    async DownloadInit() {
      const jeton = this.$store.state.user["token"];
      const url1 = "CategorieList/";
      const poles = await axios.get(url1, {
        headers: { Authorization: "Bearer " + jeton },
      });
      //   console.log(poles.data.results);
      this.mes_categories = poles.data.results;
      this.nom_categorie = null;
    },

    async DeleteCategorie(valeur) {
      console.log(valeur);
    },

    async ValideDelete(valeur) {
      console.log(valeur);
      const jeton = this.$store.state.user["token"];

      const resultat = await axios.delete(
        `CategorieDetail/${valeur}/`
      );
      console.log(resultat);
      const url1 = "CategorieList/";
      const categorie = await axios.get(url1, {
        headers: { Authorization: "Bearer " + jeton },
      });
      //   console.log(poles.data.results);
      this.mes_categories = categorie.data.results;
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
          @click.prevent="NewCategorie"
        >
          Nouvelle Catégorie
          <v-icon style="font-size:15px">mdi-plus</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
    <v-container>
      <v-alert dismissible dense v-if="statut_create" text type="success">
        Création effectuée avec succès
      </v-alert>
      <v-row v-if="new_catgorie" class="card">
        <v-col md="12" cols="12" sm="12">
          <h1 style="font-size: 35px">
            <span
              style="
                font-size: 20px;
                border-bottom: 3px solid black;
                color: black;
              "
            >
              Création de catégorie
            </span>
          </h1>
        </v-col>
        <v-col cols="12" sm="6" md="2">
          <v-subheader class="titres mt-2">FILIALE :</v-subheader>
        </v-col>
        <v-col md="8" sm="6" cols="12">
          <v-text-field
            style="font-weight: bold"
            clearable
            :label="label_message"
            v-model="nom_categorie"
            type="text"
          ></v-text-field>
        </v-col>
        <v-col md="2" sm="12" class="d-flex justify-center" cols="12">
          <v-btn
            color="#21209C"
            class="mt-1"
            style="font-weight: bold; font-size: 12px"
            text
            @click.prevent="CreateCategorie"
          >
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
            v-model="nom_categorie"
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
            @click.prevent="ModifierCategorie"
          >
            Modifier
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
    <v-container class="d-flex justify-center">
      <v-row dense>
        <v-col v-for="(item, i) in mes_categories" :key="i" md="4">
          <MonPole
            :nompole="item.nom_categorie"
            :numero="item.id_categorie"
            :titlepole="'Catégorie'"
            @edit-pole="EditCategorie"
            @delete-pole="DeleteCategorie"
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