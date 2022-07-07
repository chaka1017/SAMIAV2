<script>
import axios from "axios";
import { mapGetters } from "vuex";

export default {
  name: "FormMission",
  data: () => ({
    // INITIALISATION
    mes_villes: null,
    mes_employes: null,
    mes_entites: null,
    mes_processus: null,
    mes_regimes: null,
    // INITIALISATION

    states: null,
    employes: null,
    entities: null,
    dialog: false,
    dialog1: false,
    overlay: true,
    switch1: false,
    processuss: null,
    mission_a_valider: null,
    mesprocedure: null,
    picker: null,
    dialog3: false,
    zIndex: 5,
    // user: null,
    procedures: null,
    id_zones: null,
    e6: 1,
    notifications: false,
    sound: true,
    widgets: false,

    // alert
    alert: false,

    // FORMULAIRE
    chef_delegation: null,
    cpte_entite: null,
    objet: null,
    destinations: [],
    membres: null,
    date_mission: null,
    objectif: null,
    contexte: null,
    divers: null,
    procc: 1,
    procedu: 108,
    billet: false,
    message: null,
    logic_message: false,
    couleur_message: null,

    valid: true,
    regle: [(v) => !!v || "Ce champs est réquis"],
  }),
  computed: {
    ...mapGetters([
      "villes",
      "employees",
      "entites",
      "processus",
      "procedure",
      "zonelist",
    ]),
  },

  created() {
    // this.downloadCities();
    // this.getAllCities();
    // this.Initialize();
    console.log(this.$store.state.processus);
    this.mes_villes = this.$store.state.villes;
  },

  methods: {
    alerteur() {
      alert("bonjour");
    },

    async updteProccesList() {
      const url = "processlist/";

      const data = { entite: this.cpte_entite };

      const response = await axios.post(url, data);
      this.mesprocedure = response.data;
    },

    async updateCities() {
      console.log(this.id_zones);
      const data = { zone: this.id_zones };
      const update_villes = await axios.post("WorldcitiesList/", data);
      console.log(update_villes);

      this.mes_villes = update_villes.data;
    },

    async ValiderMission() {
      const user = this.$store.state.user["user_id"];
      if (this.membres.filter((membre) => membre != this.chef_delegation)) {
        this.membres.push(this.chef_delegation);
      }
      const data = {
        chef_delegation: this.chef_delegation,
        cpte_entite: this.cpte_entite,
        objet: this.objet,
        destinations: this.destinations,
        membres: this.membres,
        date_depart: this.date_mission[0],
        date_retour: this.date_mission[1],
        objectif: this.objectif,
        contexte: this.contexte,
        billet: this.billet,
        divers: this.divers,
        regimebareme: this.procc,
        processus: this.procedu,
        user: user,
        id_zone: this.id_zones,
      };
      console.log("Données", data);
      try {
        let response = await axios.post("mes-missionlist/", data);
        console.log(response);
        this.message = response.data;
        this.couleur_message = response.status;
        this.logic_message = true;
        this.DownloadMissions();
        this.dialog = false;
      } catch (error) {
        console.log(error.response.data);
        this.message = error.response.data;
        this.couleur_message = error.response.status;
        this.logic_message = true;
        this.dialog = false;
      }
    },

    async DownloadMissions() {
      const user = this.$store.state.user["user_id"];

      const url5 = "mes-missionlist/traitement/" + user + "/";
      const url6 = "mes-missionlist/" + user + "/";

      const missions_valider = await axios.get(url5);
      const missions = await axios.get(url6);

      this.$store.dispatch("missions", missions.data);
      this.$store.dispatch("missions_val", missions_valider.data);
    },
  },
};
</script>

<template>
  <div class="form" style="border-top: 4px #21209c solid">
    <v-alert
      dismissible
      :color="couleur_message == 201 ? 'green' : 'red'"
      text
      v-model="logic_message"
    >
      {{ message }}
    </v-alert>
    <v-stepper
      v-model="e6"
      elevation="0"
      outlined
      vertical
      style="border: 1px #dfe4ea solid"
    >
      <v-row>
        <v-col md="6" class="mx-5" style="font-size: 1.5rem; font-weight: 600">
          Formulaire de création de mission
        </v-col>
      </v-row>
      <v-stepper-step
        color="#f37121"
        style="font-size: 1.3rem; font-weight: "
        :complete="e6 > 1"
        step="1"
      >
        Informations sur la mission
      </v-stepper-step>

      <v-stepper-content step="1">
        <v-card class="mb-12" elevation="0">
          <v-row>
            <v-col cols="12" class="mt-5" sm="6" md="12">
              <v-text-field
                filled
                outlined
                style="font-weight: "
                dense
                hint="Ce champs est requis"
                label="Objet de la mission"
                v-model="objet"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-textarea
                filled
                outlined
                label="Decrivez l'objectif de la mission"
                hint="Ce champs est réquis"
                dense
                style="font-weight: "
                name="input-7-1"
                v-model="objectif"
              ></v-textarea>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-textarea
                filled
                outlined
                label="Decrivez le contexte de la mission"
                dense
                style="font-weight: "
                hint="Ce champs est réquis"
                v-model="contexte"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-card>
        <v-btn color="#21209C" dark style="font-weight: " @click="e6 = 2">
          Continue
        </v-btn>
      </v-stepper-content>

      <v-stepper-step
        color="#f37121"
        style="font-size: 1.3rem; font-weight: "
        :complete="e6 > 2"
        step="2"
      >
        Délégation & Destinations
      </v-stepper-step>

      <v-stepper-content step="2">
        <v-card class="mb-12" elevation="0">
          <v-row class="mt-5">
            <v-col cols="12" sm="4" md="3">
              <v-autocomplete
                dense
                filled
                outlined
                style="font-weight: "
                label="Selectionnez le chef de la délégation"
                :items="employees"
                item-text="full_name"
                item-value="id_employe"
                v-model="chef_delegation"
                hint="Ce champs est réquis"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" sm="4" md="3">
              <v-select
                filled
                outlined
                dense
                hint="Ce champs est réquis"
                label="Selectionnez la zone"
                :items="zonelist"
                item-text="nom_zone"
                item-value="id_zone"
                v-model="id_zones"
                @change="updateCities"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="4" md="6">
              <v-autocomplete
                filled
                outlined
                dense
                clearable
                small-chips
                multiple
                :items="mes_villes"
                item-text="city"
                item-value="id"
                v-model="destinations"
                label="Selectionnez les destinations"
                hint="Ce champs est réquis"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" sm="6" md="12">
              <v-autocomplete
                filled
                outlined
                dense
                clearable
                small-chips
                multiple
                :items="employees"
                item-text="full_name"
                item-value="id_employe"
                label="Selectionnez les membres de la délégation"
                hint="Ce champs est réquis"
                v-model="membres"
              ></v-autocomplete>
            </v-col>
          </v-row>
        </v-card>
        <v-btn color="#21209C" style="font-weight: " dark @click="e6 = 3">
          Continue
        </v-btn>
        <v-btn @click="e6 = 1" text style=""> retour </v-btn>
      </v-stepper-content>

      <v-stepper-step
        color="#f37121"
        style="font-size: 1.3rem; font-weight: "
        :complete="e6 > 3"
        step="3"
      >
        Processus de validation
      </v-stepper-step>

      <v-stepper-content step="3">
        <v-card class="mb-12" elevation="0">
          <v-row class="mt-5 mb-3">
            <v-col cols="12" sm="6" md="4">
              <v-autocomplete
                filled
                outlined
                :items="entites"
                dense
                hint="Ce champs est réquis"
                label="Mission au compte de"
                item-text="nom_entite"
                item-value="id_entite"
                v-model="cpte_entite"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-select
                filled
                outlined
                dense
                hint="Ce champs est réquis"
                label="Selectionnez le processus"
                :items="processus"
                item-text="nom_processus"
                item-value="id_process"
                v-model="procedu"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-select
                filled
                outlined
                dense
                hint="Ce champs est réquis"
                label="Selectionnez le régime"
                :items="procedure"
                item-text="nom_regime"
                item-value="id_regime"
                v-model="procc"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field
                hint="Ce champs est numérique et réquis"
                label="Montant des divers"
                dense
                filled
                outlined
                hide-details
                single-line
                type="number"
                v-model="divers"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="12">
              <v-checkbox
                style="font-weight: ; color: #2f3640"
                v-model="billet"
                label="La mission necéssite elle un billet d'avion ?"
              ></v-checkbox>
            </v-col>
          </v-row>
        </v-card>
        <v-btn color="#21209C" style="font-weight: " dark @click="e6 = 4">
          Continue
        </v-btn>
        <v-btn text @click="e6 = 2" style=""> retour </v-btn>
      </v-stepper-content>

      <v-stepper-step
        color="#f37121"
        step="4"
        style="font-size: 1.3rem; font-weight: "
      >
        Durée de la mission
      </v-stepper-step>
      <v-stepper-content step="4">
        <v-card class="mb-12" elevation="0">
          <v-col class="d-flex justify-center" cols="12" sm="12">
            <v-date-picker
              range
              style="font-weight: "
              color="#21209C"
              full-width
              locale="fr"
              v-model="date_mission"
              year-icon="mdi-calendar-blank"
              prev-icon="mdi-skip-previous"
              next-icon="mdi-skip-next"
            ></v-date-picker>
          </v-col>
        </v-card>
        <v-dialog
          v-model="dialog"
          style="font-weight: "
          fullscreen
          hide-overlay
          transition="dialog-bottom-transition"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="#21209C"
              dark
              style=""
              @click="e6 = 1"
              v-on="on"
              v-bind="attrs"
            >
              Continue
            </v-btn>
          </template>
          <v-card>
            <v-toolbar dark color="#21209C">
              <v-btn icon dark @click="dialog = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
              <v-toolbar-title class="d-none d-sm-flex"
                >Informations renseignées</v-toolbar-title
              >
              <v-spacer></v-spacer>
              <v-toolbar-items>
                <v-btn dark text @click.prevent="ValiderMission" style="">
                  Créer la mission
                  <v-icon>mdi-check</v-icon>
                </v-btn>
              </v-toolbar-items>
            </v-toolbar>
            <v-list three-line subheader>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title
                    >Informations sur la mission</v-list-item-title
                  >
                  <v-row>
                    <v-col cols="12" md="4">
                      <v-list-item-subtitle>
                        <i>Objet de la mission</i> :
                        <span v-if="objet"
                          ><v-chip class="ma-2">{{ objet }}</v-chip></span
                        >
                      </v-list-item-subtitle>
                    </v-col>
                    <v-col cols="12" md="12">
                      <v-list-item-subtitle>
                        <v-row>
                          <v-col cols="12" md="1">
                            <i>Objectif de la mission</i> :
                          </v-col>
                          <v-col cols="12" md="11 ">
                            <span v-if="objectif">{{ objectif }}</span></v-col
                          >
                        </v-row>
                      </v-list-item-subtitle>
                    </v-col>
                    <v-col cols="12" md="12">
                      <v-list-item-subtitle>
                        <v-row>
                          <v-col cols="12" md="1">
                            <i>Context de la mission</i> :
                          </v-col>
                          <v-col cols="12" md="11 ">
                            <span v-if="contexte">{{ contexte }}</span></v-col
                          >
                        </v-row>
                      </v-list-item-subtitle>
                    </v-col>
                  </v-row>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <v-divider></v-divider>
            <v-list three-line subheader>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title
                    >Destination & délégation</v-list-item-title
                  >
                  <v-row>
                    <v-col cols="12" md="12" v-if="chef_delegation">
                      <v-list-item-subtitle>
                        <i>Chef de la délégation</i> :
                        <span v-if="employees.length != 0">
                          <v-chip class="ma-2">
                            {{
                              employees.find(
                                (element) =>
                                  element.id_employe == chef_delegation
                              )["full_name"]
                            }}</v-chip
                          ></span
                        >
                      </v-list-item-subtitle>
                    </v-col>
                    <v-col
                      style="padding-bottom: 0px"
                      cols="12"
                      md="12"
                      v-if="membres"
                    >
                      <v-list-item-subtitle>
                        <i>Membres de la délégation</i> :
                        <span v-for="(membre, k) in membres" :key="k"
                          ><v-chip class="ma-2">{{
                            employees.find(
                              (element) => element.id_employe == membre
                            )["full_name"]
                          }}</v-chip>
                        </span>
                      </v-list-item-subtitle>
                    </v-col>
                    <v-col
                      style="padding-bottom: 0px"
                      cols="12"
                      md="12"
                      v-if="destinations"
                    >
                      <v-list-item-subtitle>
                        <i>Destinations de la mission</i> :
                        <span v-for="(destination, r) in destinations" :key="r">
                          <v-chip class="ma-2">{{
                            villes.find((element) => element.id == destination)[
                              "city"
                            ]
                          }}</v-chip>
                        </span>
                      </v-list-item-subtitle>
                    </v-col>
                  </v-row>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <v-divider></v-divider>
            <v-list three-line subheader>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Processus de validation</v-list-item-title>
                  <v-row class="mt-2">
                    <v-col
                      style="padding-bottom: 0px"
                      cols="12"
                      md="12"
                      v-if="cpte_entite"
                    >
                      <v-list-item-subtitle>
                        <i>Mission au compte de</i> :
                        <span
                          ><v-chip class="ma-2">{{
                            entites.find(
                              (element) => element.id_entite == cpte_entite
                            )["nom_entite"]
                          }}</v-chip></span
                        >
                      </v-list-item-subtitle>
                    </v-col>
                    <v-col
                      style="padding-bottom: 0px"
                      cols="12"
                      md="12"
                      v-if="procedu"
                    >
                      <v-list-item-subtitle>
                        <i>Processus</i> :
                        <span
                          ><v-chip class="ma-2">{{
                            processus.find(
                              (element) => procedu == element.id_process
                            )["nom_processus"]
                          }}</v-chip></span
                        >
                      </v-list-item-subtitle>
                    </v-col>
                    <v-col style="padding-bottom: 0px" cols="12" md="12">
                      <v-list-item-subtitle>
                        <i>Regime</i> :
                        <span
                          ><v-chip class="ma-2" v-if="procc != null">{{
                            procedure.find(
                              (element) => element.id_regime == procc
                            )["nom_regime"]
                          }}</v-chip></span
                        >
                      </v-list-item-subtitle>
                    </v-col>
                    <v-col
                      cols="12"
                      style="padding-bottom: 0px"
                      md="4"
                      v-if="divers"
                    >
                      <v-list-item-subtitle>
                        <i>Divers</i> :
                        <span
                          ><v-chip class="ma-2">{{ divers }}</v-chip></span
                        >
                      </v-list-item-subtitle>
                    </v-col>
                    <v-col cols="12" style="padding-bottom: 0px" md="12">
                      <v-list-item-subtitle>
                        <i>Billet d'avion</i> :
                        <span
                          ><v-chip class="ma-2">{{
                            billet == true ? "Oui" : "Non"
                          }}</v-chip></span
                        >
                      </v-list-item-subtitle>
                    </v-col>
                  </v-row>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <v-list three-line subheader>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Duré de la mission</v-list-item-title>
                  <v-row class="mt-2">
                    <v-col
                      md="12"
                      style="padding-bottom: 0px"
                      v-if="date_mission"
                    >
                      <v-list-item-subtitle>
                        <i>Date de départ</i> :<v-chip class="ma-2">
                          {{ date_mission[0] }}</v-chip
                        >
                        <!-- <span v-for="(item, i) in date_mission" :key="i"
                          >/{{ item }}/</span
                        > -->
                      </v-list-item-subtitle>
                    </v-col>
                    <v-col md="12" v-if="date_mission">
                      <v-list-item-subtitle>
                        <i>Date de retour</i> :<v-chip class="ma-2">
                          {{ date_mission[1] }}</v-chip
                        >
                        <!-- <span v-for="(item, i) in date_mission" :key="i"
                          >/{{ item }}/</span
                        > -->
                      </v-list-item-subtitle>
                    </v-col>
                  </v-row>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <v-divider></v-divider>
          </v-card>
        </v-dialog>
        <v-btn text style="" @click="e6 = 3"> retour </v-btn>
      </v-stepper-content>
    </v-stepper>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=League+Spartan:wght@100&display=swap");

.form {
  font-family: "League Spartan", sans-serif;
}
.mySelect::v-deep .v-chip {
  background-color: var(--v-primary-base);
  color: white;
}
.question {
  font-family: "League Spartan", sans-serif;

  font-size: 18px !important;
}
.purple {
  background: #3498db;
}
.titres {
  box-shadow: rgba(0, 0, 0, 0.35) 0px 1px 2px;
  background: #f1f1f1;
  backdrop-filter: blur(13px);
  -webkit-backdrop-filter: blur(13px);
  border-radius: 10px;
  color: black;
  cursor: default;
  font-size: 13px;
  height: 35px;
}

.text-h5 {
  font-family: "League Spartan", sans-serif;
}
</style>
