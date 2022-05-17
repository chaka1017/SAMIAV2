<script>
import axios from "axios";
import MonPole from "@/components/Pole/MonPole.vue";

export default {
  name: "Categorie",
  data: () => ({
    libelle_btn: "Nouvelle zone",
    titre: "Création de zone",

    new_zone: true,
    nom_zone: null,
    list_pays: null,
    mes_pays: null,
    label_message: "Creer une nouvelle zone",

    mes_zones: null,
    id_zone_selected: null,
    id_zone_created: null,

    statut_create: false,

    regle: [(v) => !!v || "Ce champs est réquis"],
    regle1: [(v) => !!v || "Ce champs est réquis"],

    valid: true,
    max_page: null,
    alert_modifier: false,

    page: 1,
  }),
  components: {
    MonPole,
  },
  created() {
    this.DownloadInit();
  },

  methods: {
    NewCategorie() {
      this.new_zone = true;
      this.nom_zone = null;
      this.list_pays = null;
      this.label_message = "Creer une nouvelle zone";
    },

    async ModifierCategorie() {
      const resultat = await axios.put(
        `ZoneDetail/${this.id_zone_selected}/`,
        { nom_zone: this.nom_zone }
      );
      console.log(resultat);

      const resultat1 = await axios.put(
        "PaysDetail/",
        { zone_id: this.id_zone_selected, country: this.list_pays }
      );
      console.log(resultat1);
      this.DownloadInit();
      this.alert_modifier = true;
      setTimeout(() => {
        this.alert_modifier = false;
      }, 10000);
    },

    async EditCategorie(valeur) {
      console.log(valeur);
      console.log(this.items);
      this.new_zone = false;

      this.id_zone_selected = valeur;

      for (let categorie of this.mes_zones) {
        if (categorie.id_zone === valeur) {
          console.log(categorie.nom_zone);
          this.label_message =
            "Modifier le nom de la régime " + categorie.nom_zone;

          this.nom_zone = categorie.nom_zone;

          console.log(this.nom_zone);
        }
      }
      const jeton = this.$store.state.user["token"];

      const url = "PaysDetail/";
      const data = { zone_id: valeur };
      const pays = await axios.post(url, data, {
        headers: { Authorization: "Bearer " + jeton },
      });
      console.log(pays.data);

      const list_des_pays = [];
      for (let element of pays.data) {
        console.log(element);
        list_des_pays.push(element["country"]);
      }
      console.log(list_des_pays);
      this.list_pays = list_des_pays;
    },

    async PaginateIt() {
      const jeton = this.$store.state.user["token"];
      const url = "ZoneList/?page=" + this.page;
      const zones = await axios.get(url, {
        headers: { Authorization: "Bearer " + jeton },
      });
      this.mes_zones = zones.data.results;
      console.log(zones);
      // this.nom_zone = null;

      const url1 = "PaysList/";
      const pays = await axios.get(url1, {
        headers: { Authorization: "Bearer " + jeton },
      });
      this.mes_pays = pays.data.results;
    },

    async CreateZone() {
      this.$refs.form.validate();
      this.label_message = "Entrez le nom de la zone";
      this.new_zone = true;
      const jeton = this.$store.state.user["token"];
      const data = { nom_zone: this.nom_zone };
      const url = "ZoneList/";
      const response = await axios.post(url, data, {
        headers: { Authorization: "Bearer " + jeton },
      });
      console.log("clicked");
      console.log(response);
      this.id_zone_created = response.data.id_zone;
      console.log(this.id_zone_created);

      const url1 = "PaysList/";
      for (const element of this.list_pays) {
        console.log(element);
        const data = new FormData();
        data.append("country", element);
        data.append("zone_id", this.id_zone_created);
        console.log(data);
        const response = await axios.post(url1, data, {
          headers: { Authorization: "Bearer " + jeton },
        });
        console.log(response);
      }
      this.DownloadInit();
      this.nom_zone = null;
      this.list_pays = null;
      this.statut_create = true;
      setTimeout(() => {
        this.statut_create = false;
      }, 10000);
    },
    async DownloadInit() {
      const jeton = this.$store.state.user["token"];
      const url = "ZoneList/";
      const zones = await axios.get(url, {
        headers: { Authorization: "Bearer " + jeton },
      });
      this.mes_zones = zones.data.results;
      console.log(zones);
      this.max_page = Math.ceil(zones.data.count / 10);
      console.log(this.max_page);

      const url1 = "PaysList/";
      const pays = await axios.get(url1, {
        headers: { Authorization: "Bearer " + jeton },
      });
      this.mes_pays = pays.data;
    },

    async DeleteZone(valeur) {
      console.log(valeur);
    },

    async ValideDelete(valeur) {
      console.log(valeur);
      // const jeton = this.$store.state.user["token"];

      const resultat = await axios.delete(
        `ZoneDetail/${valeur}/`
      );
      console.log(resultat);
      this.DownloadInit();
      // const url1 = "ZoneList/";
      // const categorie = await axios.get(url1, {
      //   headers: { Authorization: "Bearer " + jeton },
      // });
      // //   console.log(poles.data.results);
      // this.mes_zones = categorie.data.results;
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
          {{ libelle_btn }}
          <v-icon style="font-size: 15px">mdi-plus</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
    <v-container>
      <v-alert dismissible dense v-if="statut_create" text type="success">
        Création effectuée avec succès
      </v-alert>
      <v-alert v-if="alert_modifier" dense text type="success" dismissible>
        <strong>Modification</strong> effectuée avec success
      </v-alert>
      <v-form ref="form" v-model="valid" lazy-validation style="margin: 0px">
        <v-row class="card">
          <v-col md="12" cols="12" sm="12">
            <h1 style="font-size: 35px">
              <span
                style="
                  font-size: 20px;
                  border-bottom: 3px solid black;
                  color: black;
                "
              >
                {{ titre }}
              </span>
            </h1>
          </v-col>
          <v-col cols="12" sm="6" md="2">
            <v-subheader class="titres mt-2">Zone :</v-subheader>
          </v-col>
          <v-col md="10" sm="6" cols="12">
            <v-text-field
              style="font-weight: bold"
              required
              clearable
              :rules="regle"
              :label="label_message"
              v-model="nom_zone"
              type="text"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="2">
            <v-subheader dense class="titres">Pays * :</v-subheader>
          </v-col>
          <v-col cols="12" sm="6" md="10">
            <v-autocomplete
              required
              dense
              height="30"
              chips
              clearable
              deletable-chips
              :rules="regle1"
              multiple
              :items="mes_pays"
              style="font-size: 12px"
              item-text="country"
              item-value="country"
              v-model="list_pays"
            ></v-autocomplete>
          </v-col>
          <v-col
            v-if="new_zone"
            md="12"
            sm="12"
            class="d-flex justify-center"
            cols="12"
          >
            <v-btn
              color="#21209C"
              class="mt-1"
              style="
                font-weight: bold;
                font-size: 16px;
                text-transform: capitalize;
              "
              :disabled="!valid"
              dark
              @click.prevent="CreateZone"
            >
              Creer
            </v-btn>
          </v-col>
          <v-col v-else md="12" class="d-flex justify-center" cols="12">
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
      </v-form>
    </v-container>
    <v-container class="d-flex justify-center">
      <v-row dense>
        <v-col v-for="(item, i) in mes_zones" :key="i" md="4">
          <MonPole
            :nompole="item.nom_zone"
            :numero="item.id_zone"
            :titlepole="'Zone'"
            @edit-pole="EditCategorie"
            @delete-pole="DeleteZone"
            @valide-delete="ValideDelete"
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