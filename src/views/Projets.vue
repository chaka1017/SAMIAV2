<script>
import axios from "axios";
export default {
  name: "Projets",
  data: () => ({
    mes_poles: null,
    mes_filiales: null,
    mes_typeprojet: null,
    v_typeprojet: null,

    filialerule: [(v) => !!v || "Ce champs est réquis"],
    polerule: [(v) => !!v || "Ce champs est réquis"],
    valid: true,
    dialog: false,

    nom_projet: null,
    date_debut: null,
    date_fin: null,
    id_entite: null,
    type_projet: null,
  }),
  created() {
    this.DownloadPole();
  },
  methods: {
    async CreateProjet() {
      const jeton = this.$store.state.user["token"];
      const url = "projetlist/";
      // console.log(this.date_debut.toString().split("/").join("/"));

      const form = new FormData();
      form.append("nom_projet", this.nom_projet);
      form.append("date_debut", this.date_debut);
      form.append("date_fin", this.date_fin);
      form.append("id_entite", this.id_entite);
      form.append("type_projet", this.type_projet);
      console.log(form);

      const response = await axios.post(url, form, {
        headers: { Authorization: "Bearer " + jeton },
      });
      console.log(response.data);
      this.mes_typeprojet = response.data;
    },
    async CreateTypeProjet() {
      this.dialog = false;
      const jeton = this.$store.state.user["token"];

      const url = "typeprojetlist/";
      const form = new FormData();
      form.append("nom_typeprojet", this.v_typeprojet);
      const response = await axios.post(url, form, {
        headers: { Authorization: "Bearer " + jeton },
      });
      console.log(response.data);
      this.mes_typeprojet = response.data;
    },

    async DownloadPole() {
      //   const user = this.$store.state.user["user_id"];
      const jeton = this.$store.state.user["token"];
      const url = "polelist/";
      const poles = await axios.get(url, {
        headers: { Authorization: "Bearer " + jeton },
      });
      //   console.log(poles.data.results);
      this.mes_poles = poles.data.results;
      // console.log(this.mes_poles);

      const url1 = "entitelist/";
      const response = await axios.get(url1, {
        headers: { Authorization: "Bearer " + jeton },
      });
      console.log(response.data.results);
      this.mes_filiales = response.data.results;

      const url2 = "typeprojetlist/";
      const response1 = await axios.get(url2, {
        headers: { Authorization: "Bearer " + jeton },
      });
      console.log(response1.data.results);
      this.mes_typeprojet = response1.data.results;
    },
  },
};
</script>

<template>
  <div id="projets">
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
      <v-flex xs12 md12 sm="12">
        <v-btn
          dark
          large
          color="#F37121"
          style="text-transform: capitalize"
          @click.prevent="NewProjet"
        >
          Nouveau Projet
          <v-icon style="font-size:15px">mdi-plus</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>

    <v-container>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-row class="card">
          <v-col md="12" sm="12" cols="12">
            <h1 style="font-size: 35px">
              <span
                style="
                  font-size: 35px;
                  border-bottom: 3px solid black;
                  color: black;
                "
              >
                Création d'un nouveau projet
              </span>
            </h1>
          </v-col>
          <v-col cols="12" sm="6" md="2">
            <v-subheader class="titres mt-2">NOM PROJET :</v-subheader>
          </v-col>
          <v-col md="10" sm="6" cols="12">
            <v-text-field
              placeholder="Entrez le nom du projet"
              style="font-weight: bold"
              clearable
              v-model="nom_projet"
              :rules="filialerule"
              type="text"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="2">
            <v-subheader class="titres mt-2">DATE DE DEBUT :</v-subheader>
          </v-col>
          <v-col md="10" cols="12" sm="6">
            <v-text-field
              placeholder="Entrez le nom de la filiale"
              style="font-weight: bold"
              clearable
              :rules="filialerule"
              type="date"
              v-model="date_debut"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="2">
            <v-subheader class="titres mt-2">DATE DE FIN :</v-subheader>
          </v-col>
          <v-col md="10" cols="12" sm="6">
            <v-text-field
              placeholder="Entrez le nom de la filiale"
              style="font-weight: bold"
              clearable
              :rules="filialerule"
              v-model="date_fin"
              type="date"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="2">
            <v-subheader class="titres mt-2">FILIALE :</v-subheader>
          </v-col>
          <v-col md="10" cols="12" sm="6">
            <v-autocomplete
              style="font-weight: bold"
              chips
              dense
              clearable
              deletable-chips
              v-model="id_entite"
              :items="mes_filiales"
              :rules="polerule"
              item-text="nom_entite"
              item-value="id_entite"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" sm="4" md="2">
            <v-subheader class="titres mt-2">TYPE DE PROJET :</v-subheader>
          </v-col>
          <v-col md="8" cols="7" sm="4">
            <v-autocomplete
              style="font-weight: bold"
              chips
              dense
              clearable
              deletable-chips
              v-model="type_projet"
              :items="mes_typeprojet"
              :rules="polerule"
              item-text="nom_typeprojet"
              item-value="id_typeprojet"
            ></v-autocomplete>
          </v-col>
          <v-col md="2" cols="5" sm="4">
            <v-dialog v-model="dialog" persistent max-width="600px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  x-large
                  text
                  class="mt-3"
                  color="#21209C"
                  dark
                  v-bind="attrs"
                  v-on="on"
                  style="text-transform: capitalize; font-weight: bold"
                  v-model="dialog"
                >
                  <v-icon>mdi-plus-circle-outline</v-icon>
                  Ajouter</v-btn
                >
              </template>
              <v-card>
                <v-card-title>
                  <span style="color: black; font-weight: bold"
                    >Type de projet</span
                  >
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col md="10" cols="12">
                        <v-form ref="form" v-model="valid" lazy-validation>
                          <v-text-field
                            placeholder="Nouveau type de projet"
                            style="font-weight: bold"
                            clearable
                            dense
                            v-model="v_typeprojet"
                            :rules="filialerule"
                          ></v-text-field>
                        </v-form>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    style="font-weight: bold"
                    color="green darken-1"
                    text
                    :disabled="!valid"
                    @click="CreateTypeProjet"
                  >
                    Enregistrer
                  </v-btn>
                  <v-btn
                    style="font-weight: bold"
                    color="red darken-1"
                    text
                    @click="dialog = false"
                  >
                    Annuler
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-col>

          <v-col md="12" cols="12" sm="12" class="d-flex justify-center">
            <v-btn
              x-large
              text
              class="mt-1"
              color="#21209C"
              dark
              :disabled="!valid"
              style="text-transform: capitalize; font-weight: bold"
              @click.prevent="CreateProjet"
            >
              <v-icon>mdi-pencil-outline</v-icon>
              Creer</v-btn
            >
          </v-col>
        </v-row>
      </v-form>
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