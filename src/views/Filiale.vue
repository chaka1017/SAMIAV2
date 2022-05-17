<script>
import axios from "axios";
import { mapGetters } from "vuex";
import MonPole from "@/components/Pole/MonPole.vue";

export default {
  name: "Filiale",
  data: () => ({
    dialog: null,
    mes_poles: null,
    nom_filiale: null,
    mon_idpole: null,
    filiale_img: null,
    mes_filiales: null,
    new_filiale: true,
    the_id_entite: null,

    // REGLES
    filialerule: [(v) => !!v || "Ce champs est réquis"],
    polerule: [(v) => !!v || "Ce champs est réquis"],
    valid: true,

    page: 1,
    max_page: null,
  }),

  components: {
    MonPole,
  },

  created() {
    this.DownloadPole();
  },

  computed: {
    ...mapGetters(["entites"]),
  },

  methods: {
    NewFiliale() {
      this.new_filiale = true;
      this.mon_idpole = null;
      this.nom_filiale = null;
      this.filiale_img = null;
    },

    async PaginateIt() {
      const jeton = this.$store.state.user["token"];
      const url = "entitelist/?page=" + this.page;
      const entites = await axios.get(url, {
        headers: { Authorization: "Bearer " + jeton },
      });
      this.mes_filiales = entites.data.results;
      console.log(entites);
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

      this.max_page = Math.ceil(response.data.count / 10);
      console.log(this.max_page);
    },

    async post_filiale() {
      const jeton = this.$store.state.user["token"];

      let form = new FormData();
      if (
        this.filiale_img === null &&
        this.nom_filiale != null &&
        this.mon_idpole != null
      ) {
        form.append("nom_entite", this.nom_filiale);
        form.append("id_pole_id", this.mon_idpole);
      } else if (
        this.nom_filiale != null &&
        this.nom_filiale != null &&
        this.filiale_img != null
      ) {
        console.log("nom_entite", this.nom_filiale);
        console.log("id_pole_id", this.mon_idpole);
        console.log("logo", this.filiale_img);
        form.append("nom_entite", this.nom_filiale);
        form.append("id_pole_id", this.mon_idpole);
        form.append("logo", this.filiale_img);
      }
      // const data = {
      //   nom_entite: this.nom_filiale,
      //   id_pole_id: this.mon_idpole,
      //   logo: this.filiale_img,
      // };
      console.log(form);
      const url = "entitelist/";
      const response = await axios.post(url, form, {
        headers: { Authorization: "Bearer " + jeton },
      });
      console.log(response);
      this.mes_filiales = response.data;
      this.DownloadPole();

      this.mon_idpole = null;
      this.nom_filiale = null;
      this.filiale_img = null;
    },

    async EditPole(valeur) {
      console.log(valeur);
      console.log(this.mes_filiales);
      this.new_filiale = false;
      this.the_id_entite = valeur;

      this.id_pole_selected = valeur;

      for (let index = 0; index < this.mes_filiales.length; index++) {
        const element = this.mes_filiales[index].id_entite;

        if (element === valeur) {
          console.log(this.mes_filiales[index]);
          this.label_message =
            "Modifier le nom le nom de la filiale " +
            this.mes_filiales[index].nom_entite;
          this.nom_filiale = this.mes_filiales[index].nom_entite;
          this.mon_idpole = this.mes_filiales[index].id_pole_id;
        }
      }
    },

    async Modifierlafiliale() {
      console.log(this.the_id_entite);
      let form = new FormData();
      if (
        this.filiale_img === null &&
        this.nom_filiale != null &&
        this.mon_idpole != null
      ) {
        form.append("nom_entite", this.nom_filiale);
        form.append("id_pole_id", this.mon_idpole);
      } else if (
        this.nom_filiale != null &&
        this.nom_filiale != null &&
        this.filiale_img != null
      ) {
        form.append("nom_entite", this.nom_filiale);
        form.append("id_pole_id", this.mon_idpole);
        form.append("logo", this.filiale_img);
      }

      console.log(form);

      // const jeton = this.$store.state.user["token"];

      const resultat = await axios.put(
        `entitedetail/${this.the_id_entite}/`,
        form
      );
      console.log(resultat);
      this.DownloadPole();
    },

    async DeletePole(valeur) {
      console.log(valeur);
    },

    async ValideDelete(valeur) {
      console.log(valeur);
      const resultat = await axios.delete(`entitedetail/${valeur}/`);
      console.log(resultat);
      this.DownloadPole();
    },
  },
};
</script>

<template>
  <div id="filiale">
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
            font-size: 11px;
            height: 30px;
            font-weight: 800;
          "
          @click.prevent="NewFiliale"
        >
          Nouvelle filiale
          <v-icon style="font-size: 15px">mdi-plus</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
    <v-container class="pt-10">
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-row class="card">
          <v-col md="12" cols="12">
            <h1 style="font-size: 35px">
              <span
                style="
                  font-size: 20px;
                  border-bottom: 3px solid black;
                  color: black;
                "
              >
                Création d'une filiale
              </span>
            </h1>
          </v-col>
          <v-col cols="12" sm="6" md="2">
            <v-subheader class="titres">FILIALE :</v-subheader>
          </v-col>
          <v-col md="10" sm="6" cols="12">
            <v-text-field
              dense
              placeholder="Entrez le nom de la filiale"
              style="font-size: 12px"
              clearable
              :rules="filialerule"
              type="text"
              v-model="nom_filiale"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="2">
            <v-subheader dense class="titres">POLE :</v-subheader>
          </v-col>
          <v-col md="10" cols="12" sm="6">
            <v-autocomplete
              style="font-size: 12px"
              dense
              chips
              clearable
              deletable-chips
              :items="mes_poles"
              :rules="polerule"
              item-text="nom_pole"
              item-value="id_pole"
              v-model="mon_idpole"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" sm="6" md="2">
            <v-subheader class="titres">LOGO DE LA FILIALE :</v-subheader>
          </v-col>
          <v-col md="10" cols="12" sm="6">
            <v-file-input
              dense
              style="font-size: 12px"
              clearable
              v-model="filiale_img"
              accept="image/png, image/jpeg"
            >
            </v-file-input>
          </v-col>
          <v-col md="12" cols="12" sm="12" class="d-flex justify-center">
            <v-btn
              v-if="new_filiale"
              class="mt-1"
              color="#21209C"
              dark
              :disabled="!valid"
              style="text-transform: capitalize; font-weight: bold"
              @click.prevent="post_filiale"
            >
              <!-- <v-icon>mdi-pencil-outline</v-icon> -->
              Creer</v-btn
            >
            <v-btn
              v-else
              text
              class="mt-1"
              color="#21209C"
              dark
              :disabled="!valid"
              style="text-transform: capitalize; font-weight: bold"
              @click.prevent="Modifierlafiliale"
            >
              <v-icon>mdi-check-outline</v-icon>
              Modifier</v-btn
            >
          </v-col>
        </v-row>
      </v-form>
      <v-row>
        <v-col
          cols="12"
          sm="6"
          v-for="(item, i) in mes_filiales"
          :key="i"
          md="4"
        >
          <MonPole
            class="mt-10"
            @edit-pole="EditPole"
            @delete-pole="DeletePole"
            @valide-delete="ValideDelete"
            :titlepole="'Filiale'"
            :nompole="item.nom_entite"
            :titlepole_bis="'Pôle'"
            :nompole_bis="item.nom_pole"
            :title="item.nom_entite"
            :numero="item.id_entite"
            :attribution="'Filiale'"
            :image="'http://192.168.0.37:8000' + item.url_logo"
          />
        </v-col>
      </v-row>
    </v-container>
    <div class="text-center">
      <v-pagination
        v-model="page"
        :length="max_page"
        prev-icon="mdi-menu-left"
        next-icon="mdi-menu-right"
        @input="PaginateIt"
      ></v-pagination>
    </div>
  </div>
</template>

<style scoped>
.card {
  background: white;
  border-radius: 15px;
  padding: 1rem;
  margin-left: 2px;

  box-shadow: rgba(136, 165, 191, 0.48) 0px 1px 2px,
    rgba(255, 255, 255, 0.8) 0px 1px 2px;
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