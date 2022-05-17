<script>
import axios from "axios";
import MonPole from "@/components/Pole/MonPole.vue";

export default {
  name: "Bareme",
  data: () => ({
    desserts: [
      {
        categorie: "Frozen Yogurt",
        zone: 9,
        perdiem: 1590000,
        hebergement: 1000559,
      },
      {
        categorie: "Ice cream sandwich",
        zone: 1,
        perdiem: 90000,
        hebergement: 50009,
      },
    ],
    page: 1,
    max_page: null,
    mes_baremes: null,
    mes_regimes: null,
    mes_process: null,
    mes_jour_min: null,
    mes_jour_max: null,
    mes_categories: null,
    mes_zones: null,
    e1: 1,
    categories: [],

    // detail_perdiem
    categorie: null,
    zone: null,
    perdiems: null,
    hebergements: null,
    // detail_perdiem

    id_bareme: null,
    details_perdiem: [],
    details_perdiem_send: [],

    new_bareme: false,
    data: {
      id_regime: null,
      id_processus: null,
      jour_min: null,
      jour_max: null,
    },
    statut_create: false,
    statut_erreur: false,
    incomplete_erreur: false,
  }),

  created() {
    this.DownloadInit();
  },

  methods: {
    async CreateDetail() {
      const jeton = this.$store.state.user["token"];
      const url = "Bareme_detailList/";
      const url1 = "Montant_zoneList/";
      for (let categorie of this.categories) {
        let data = new FormData();
        data.append("id_categorie", categorie);
        data.append("id_bareme", this.id_bareme);
        let response = await axios.post(url, data, {
          headers: { Authorization: "Bearer" + jeton },
        });
        let id_bareme_detail_id = response.data.id_bareme_detail;
        console.log(categorie);
        console.log(response);
        for (let detail of this.details_perdiem) {
          if (detail.id_categorie == categorie) {
            let data1 = new FormData();
            data1.append("perdiem", detail.perdiem);
            data1.append("hebergement", detail.hebergement);
            data1.append("hebergement", detail.hebergement);
            data1.append("id_bareme_detail", id_bareme_detail_id);
            data1.append("id_zone", detail.id_zone);

            let response1 = await axios.post(url1, data1, {
              headers: { Authorization: "Bearer" + jeton },
            });
            console.log(response1);
          }
        }
      }
      this.e1 = 1;
    },
    Ajouter() {
      if (
        this.categorie == null ||
        this.zone == null ||
        this.perdiems == null
      ) {
        this.incomplete_erreur = true;
        setTimeout(() => {
          this.incomplete_erreur = false;
        }, 10000);
      }
      {
        if (!this.categories.includes(this.categorie)) {
          // console.log(this.categorie);
          this.categories.push(this.categorie);
          console.log(this.categories);
        }
        console.log(this.categorie);
        for (let element of this.mes_categories) {
          if (this.categorie == element.id_categorie) {
            var nom_categorie = element.nom_categorie;
            console.log(nom_categorie);
          }
        }
        for (let element of this.mes_zones) {
          if (this.zone == element.id_zone) {
            var nom_zone = element.nom_zone;
            console.log(nom_zone);
          }
        }
        const perdiem = this.perdiems;
        const hebergement = this.hebergements;
        this.details_perdiem.push({
          categorie: nom_categorie,
          id_categorie: this.categorie,
          zone: nom_zone,
          id_zone: this.zone,
          perdiem: perdiem,
          hebergement: hebergement,
        });
        console.log(this.details_perdiem);
        this.perdiems = null;
        this.hebergements = null;
        this.zone = null;
        this.details_perdiem_send.push({});
      }
    },

    async UpdateFields() {
      const donnee = new FormData();
      donnee.append("id_regime", this.data.id_regime);
      donnee.append("id_processus", this.data.id_processus);
      donnee.append("jour_min", this.data.jour_min);
      donnee.append("jour_max", this.data.jour_max);
      const jeton = this.$store.state.user["token"];
      const url = "delais_bareme/";
      const bornes = await axios.post(url, donnee, {
        headers: { Authorization: "Bearer " + jeton },
      });
      this.mes_jour_min = bornes.data.jour_min;
      this.mes_jour_max = bornes.data.jour_max;
      this.data.jour_min = null;
      this.data.jour_max = null;
      // console.log(this.mes_jour_min);
      // console.log(this.mes_jour_max);
    },

    async CreateBareme() {
      if (this.data.jour_max < this.data.jour_min) {
        this.data.jour_min = null;
        this.data.jour_max = null;
        this.statut_erreur = true;
        setTimeout(() => {
          this.statut_erreur = false;
        }, 10000);
        console.log(this.data);
      }
      if (
        this.data.jour_max == null ||
        this.data.jour_min == null ||
        this.data.id_regime == null ||
        this.data.id_processus == null
      ) {
        this.incomplete_erreur = true;
        setTimeout(() => {
          this.incomplete_erreur = false;
        }, 10000);
        console.log(this.data);
      } else {
        console.log("share to backend");
        const jeton = this.$store.state.user["token"];
        console.log(this.data);
        const form = new FormData();
        form.append("jour_max", this.data.jour_max);
        form.append("jour_min", this.data.jour_min);
        form.append("id_processus", this.data.id_processus);
        form.append("id_regime", this.data.id_regime);
        const url = "BaremeList/";
        const response = await axios.post(url, form, {
          headers: { Authorization: "Bearer " + jeton },
        });
        console.log(response);
        this.id_bareme = response.data.id_bareme;
        this.DownloadInit();
        this.e1 = 2;
      }
    },

    removeProcc() {
      this.details_perdiem.pop();
    },

    async DownloadInit() {
      const jeton = this.$store.state.user["token"];

      const url = "BaremeList/";
      const baremes = await axios.get(url, this.data, {
        headers: { Authorization: "Bearer " + jeton },
      });
      this.mes_baremes = baremes.data.results;
      // console.log(baremes);
      this.max_page = Math.ceil(baremes.data.count / 10);
      // console.log(this.max_page);

      // Regimes
      const url1 = "RegimeList/";
      const categorie = await axios.get(url1, {
        headers: { Authorization: "Bearer " + jeton },
      });
      this.mes_regimes = categorie.data.results;

      // Processus
      const url2 = "processlist/";
      const mes_proce = await axios.get(url2, {
        headers: { Authorization: "Bearer " + jeton },
      });
      this.mes_process = mes_proce.data.results;

      const url3 = "delais_bareme/";
      const bornes = await axios.get(url3, {
        headers: { Authorization: "Bearer " + jeton },
      });
      this.mes_jour_min = bornes.data.jour_min;
      this.mes_jour_max = bornes.data.jour_max;

      const url4 = "CategorieList/";
      const categ = await axios.get(url4, {
        headers: { Authorization: "Bearer " + jeton },
      });
      this.mes_categories = categ.data.results;

      const url5 = "ZoneList/";
      const zones = await axios.get(url5, {
        headers: { Authorization: "Bearer " + jeton },
      });
      this.mes_zones = zones.data.results;
    },

    async PaginateIt() {
      const jeton = this.$store.state.user["token"];
      const url = "BaremeList/?page=" + this.page;
      const baremes = await axios.get(url, {
        headers: { Authorization: "Bearer " + jeton },
      });
      this.mes_baremes = baremes.data.results;
      // console.log(baremes);
      // this.nom_zone = null;
    },
  },
  components: {
    MonPole,
  },
};
</script>

<template>
  <div class="bareme">
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
          @click="new_bareme = !new_bareme"
        >
          Nouveau barème
          <v-icon style="font-size:15px">mdi-plus</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
    <v-container class="card" v-if="new_bareme">
      <v-alert dismissible dense v-if="statut_create" text type="success">
        Création effectuée avec succes
      </v-alert>
      <v-alert dismissible dense v-if="statut_erreur" text type="error">
        Attention !!! JOUR DEBUT doit toujours être inferieur à JOUR FIN
      </v-alert>
      <v-alert dismissible dense v-if="incomplete_erreur" text type="error">
        Completez tous les champs svp
      </v-alert>
      <v-stepper
        v-model="e1"
        elevation="0"
        style="border: none; font-size: 14px"
      >
        <v-stepper-header
          elevation="0"
          style="background: #f1f2f6; border-radius: 15px"
        >
          <v-stepper-step :complete="e1 > 1" step="1">
            Creation
          </v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step :complete="e1 > 2" step="2">
            Finalisation
          </v-stepper-step>
        </v-stepper-header>

        <v-stepper-items>
          <v-stepper-content step="1">
            <v-row>
              <v-col cols="12" sm="6" md="2">
                <v-subheader class="titres">Regime * :</v-subheader>
              </v-col>
              <v-col md="4" sm="6" cols="12">
                <v-autocomplete
                  style="font-weight: bold"
                  chips
                  dense
                  clearable
                  deletable-chips
                  :items="mes_regimes"
                  item-text="nom_regime"
                  item-value="id_regime"
                  v-model="data.id_regime"
                  @change="UpdateFields"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" sm="6" md="2">
                <v-subheader class="titres">Processus * :</v-subheader>
              </v-col>
              <v-col md="4" sm="6" cols="12">
                <v-autocomplete
                  style="font-weight: bold"
                  chips
                  dense
                  clearable
                  deletable-chips
                  :items="mes_process"
                  item-text="nom_processus"
                  item-value="id_process"
                  v-model="data.id_processus"
                  @change="UpdateFields"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" sm="6" md="2">
                <v-subheader class="titres">Jour début * :</v-subheader>
              </v-col>
              <v-col md="4" sm="6" cols="12">
                <v-select
                  :items="mes_jour_min"
                  item-value="jour"
                  item-text="jour"
                  item-disabled="enable"
                  v-model="data.jour_min"
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6" md="2">
                <v-subheader class="titres">Jour Fin * :</v-subheader>
              </v-col>
              <v-col md="4" sm="6" cols="12">
                <v-select
                  :items="mes_jour_min"
                  item-value="jour"
                  item-text="jour"
                  item-disabled="enable"
                  v-model="data.jour_max"
                ></v-select>
              </v-col>

              <v-col md="12" sm="12" class="d-flex justify-center" cols="12">
                <v-btn
                  style="text-transform: capitalize"
                  color="#21209C"
                  dark
                  @click.prevent="CreateBareme"
                >
                  Suivant
                </v-btn>
              </v-col>
            </v-row>
          </v-stepper-content>

          <v-stepper-content step="2">
            <v-row>
              <v-col cols="12" sm="6" md="2">
                <v-subheader class="titres">Categories :</v-subheader>
              </v-col>
              <v-col md="4" sm="6" cols="12">
                <v-autocomplete
                  style="font-weight: bold"
                  chips
                  dense
                  clearable
                  deletable-chips
                  v-model="categorie"
                  :items="mes_categories"
                  item-text="nom_categorie"
                  item-value="id_categorie"
                ></v-autocomplete>
              </v-col>

              <v-col cols="12" sm="6" md="2">
                <v-subheader class="titres">Zone :</v-subheader>
              </v-col>
              <v-col md="4" sm="6" cols="12">
                <v-autocomplete
                  style="font-weight: bold"
                  chips
                  dense
                  clearable
                  deletable-chips
                  v-model="zone"
                  :items="mes_zones"
                  item-text="nom_zone"
                  item-value="id_zone"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" sm="6" md="2">
                <v-subheader class="titres">Perdiem :</v-subheader>
              </v-col>
              <v-col md="3" sm="6" cols="12">
                <v-text-field
                  hint=" * Ce champs requière une valeur numérique"
                  v-model="perdiems"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="2">
                <v-subheader class="titres">Hebergement :</v-subheader>
              </v-col>
              <v-col md="3" sm="6" cols="12">
                <v-text-field
                  hint=" * Ce champs requière une valeur numérique"
                  v-model="hebergements"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="2" class="d-flex justify-center">
                <v-btn
                  @click.prevent="Ajouter"
                  dark
                  class="mr-2"
                  style="font-weight: 800"
                  color="#F37121"
                >
                  Ajouter</v-btn
                >
                <v-btn
                  @click.prevent="removeProcc"
                  dark
                  style="font-weight: 800"
                  color="red"
                >
                  <v-icon>mdi-add</v-icon>
                  Retirer</v-btn
                >
              </v-col>

              <v-col md="12" sm="12" class="d-flex justify-center" cols="12">
                <v-btn color="primary" @click="CreateDetail"> Continue </v-btn>
              </v-col>
              <v-col md="12" class="d-flex justify-center">
                <v-simple-table fixed-header height="300px">
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="text-left">Categories</th>
                        <th class="text-left">Zone</th>
                        <th class="text-left">Perdiem</th>
                        <th class="text-left">Hebergement</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in details_perdiem" :key="item.name">
                        <td>{{ item.categorie }}</td>
                        <td>{{ item.zone }}</td>
                        <td>{{ item.perdiem }}</td>
                        <td>{{ item.hebergement }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-col>
            </v-row>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </v-container>
    <v-container class="d-flex justify-center mt-5">
      <v-row dense>
        <v-col v-for="(item, i) in mes_baremes" :key="i" md="4">
          <MonPole
            :numero="item.id_bareme"
            :titlepole="'Processus'"
            :nompole="item.Bareme.Processus"
            :titlepole_bis="'Régime'"
            :nompole_bis="item.Bareme.Regime"
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