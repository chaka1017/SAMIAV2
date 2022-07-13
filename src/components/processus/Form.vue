<script>
import axios from "axios";
export default {
  name: "Form",
  data: () => ({
    acteurs: [
      { id: "C", name: "Chef de la mission" },
      { id: "T", name: "Tout le monde" },
    ],
    acteur: null,
    contraintes: null,
    expression: true,
    e6: 1,
    nom_procc: null,
    type_procc: "NO",
    related: null,
    groupe: null,
    etape: null,
    mes_poles: null,
    mes_filiales: null,
    mes_group: null,
    mes_etapes: null,
    mes_process: null,
    mon_procc: [],
    statut_create: false,
    isJustif: true,
    message: null,
    message_logic: false,
    dialog: false,
    blocante_step: null,
    validateur: null,
  }),
  created() {
    this.DownloadPole();
  },
  props: {
    validateurs: [],
  },
  methods: {
    async DownloadPole() {
      //   const user = this.$store.state.user["user_id"];
      const jeton = this.$store.state.user["token"];
      const url = "polelist/";
      const poles = await axios.get(url, {
        headers: { Authorization: "Bearer " + jeton },
      });
      //   console.log(poles.data.results);
      this.mes_poles = poles.data.results;
      //   console.log(this.mes_poles);

      const url1 = "entitelist/";
      const response = await axios.get(url1, {
        headers: { Authorization: "Bearer " + jeton },
      });
      //   console.log(response.data.results);
      this.mes_filiales = response.data.results;

      const url2 = "GroupList/";
      const group = await axios.get(url2, {
        headers: { Authorization: "Bearer " + jeton },
      });
      // console.log(group.data.results);
      this.mes_group = group.data.results;

      const url3 = "TypestepsList/";
      const etapes = await axios.get(url3, {
        headers: { Authorization: "Bearer " + jeton },
      });
      // console.log(etapes.data.results);
      this.mes_etapes = etapes.data.results;

      const url4 = "processlist/";
      const mes_proce = await axios.get(url4, {
        headers: { Authorization: "Bearer " + jeton },
      });

      const contraintes = await axios.get("Contrainte/14/", {
        headers: { Authorization: "Bearer " + jeton },
      });
      this.contraintes = contraintes.data;
      console.log("contraintes", this.contraintes);
      // console.log(etapes.data.results);
      this.mes_process = mes_proce.data.results;
      console.log(this.mes_process);

      this.max_page = Math.ceil(mes_proce.data.count / 10);
      console.log(this.max_page);
    },

    addProcc() {
      // console.log(this.groupe);
      // console.log(this.etape);
      for (const element of this.mes_group) {
        if (element.pk === this.groupe) {
          // console.log(element);
          this.groupe = element["name"];
          this.cible_id = element.pk;
        }
      }
      for (const elt of this.mes_etapes) {
        if (elt.id_typesteps === this.etape) {
          this.etape = elt.nom_typesteps;
          this.mon_etape_id = elt.id_typesteps;
        }
      }
      this.mon_procc.push({
        cible_name: this.groupe,
        cible: this.cible_id,
        etape: this.etape,
        type_steps_id: this.mon_etape_id,
      });
      this.groupe = null;
      this.etape = null;
      console.log(this.mon_procc);
    },
    removeProcc() {
      this.mon_procc.pop();
    },

    HandleAnnuler() {
      this.mes_etapes = null;
      this.dialog = false;
      this.nom_procc = null;
      this.related = null;
      this.type_procc = "NO";
      this.e6 = 1;
    },
    CreateProcess(nom_procc, related, type_procc, mon_procc, blocante_step) {
      this.$emit(
        "emit-CreateProcess",
        nom_procc,
        related,
        type_procc,
        mon_procc,
        blocante_step
      );
      this.e6 = 3;
      this.dialog = false;
    },

    Rapport(acteur, expression, validateur) {
      this.$emit("emit-rapport", acteur, expression, validateur);
      this.e6 = 1;
    },
  },
};
</script>
<template>
  <div
    class="form"
    style="
      border: 1px solid #dfe4ea;
      padding: 10px;
      border-radius: 5px;
      border-top: 4px #21209c solid;
    "
  >
    <v-row>
      <v-col md="12" sm="12" cols="12">
        <h1 style="font-size: 20px; font-weight: 300">
          Création d'un processus
        </h1>
      </v-col>
    </v-row>
    <v-stepper v-model="e6" elevation="0" vertical>
      <v-stepper-step
        color="#21209C"
        style="font-weight: 300; font-size: 1.1rem"
        :complete="e6 > 1"
        step="1"
      >
        Informations du processus
      </v-stepper-step>

      <v-stepper-content step="1">
        <v-card class="mb-12" elevation="0">
          <v-row>
            <v-col cols="12" sm="6" md="4">
              <v-text-field
                outlined
                filled
                dense
                name=""
                label="Entrez le nom du processus"
                style="font-weight: 300"
                v-model="nom_procc"
              ></v-text-field>
            </v-col>

            <v-col md="4" class="d-flex justify-center" sm="4" cols="12">
              <v-radio-group v-model="type_procc" column>
                <template v-slot:label>
                  <div style="font-weight: 300; color: black">
                    TYPE DE PROCESSUS *:
                  </div>
                </template>
                <v-radio
                  label="Pôle"
                  value="PO"
                  style="font-weight: 300"
                ></v-radio>
                <v-radio
                  label="Normal"
                  value="NO"
                  style="font-weight: 300"
                ></v-radio>
                <v-radio
                  label="Projet"
                  value="PR"
                  style="font-weight: 300"
                ></v-radio>
              </v-radio-group>
            </v-col>
            <v-col md="4" sm="5" cols="12">
              <v-autocomplete
                outlined
                filled
                dense
                v-if="type_procc === 'NO'"
                style="font-weight: 300"
                v-model="related"
                :items="mes_filiales"
                label="Selectionnez la filiales"
                item-text="nom_entite"
                item-value="id_entite"
              ></v-autocomplete>

              <v-autocomplete
                outlined
                filled
                dense
                v-if="type_procc === 'PO'"
                style="font-weight: 300"
                label="Selectionnez le pôle"
                :items="mes_poles"
                item-text="nom_pole"
                item-value="id_pole"
              ></v-autocomplete>

              <v-autocomplete
                outlined
                filled
                dense
                v-if="type_procc === 'PR'"
                style="font-weight: 300"
                label="Selectionnez le projet"
                :items="mes_poles"
                item-text="nom_pole"
                item-value="id_pole"
              ></v-autocomplete>
            </v-col>
          </v-row>
        </v-card>
        <v-btn dark @click="e6 = 2" color="#21209C"> Continuer </v-btn>
      </v-stepper-content>

      <v-stepper-step
        :complete="e6 > 2"
        step="2"
        color="#21209C"
        style="font-weight: 300; font-size: 1.1rem"
      >
        Configuration du processus
      </v-stepper-step>

      <v-stepper-content step="2">
        <v-card class="mb-12" elevation="0">
          <v-row>
            <v-col md="4" sm="6">
              <v-autocomplete
                outlined
                filled
                dense
                style="font-weight: 300"
                label="Selectionnez le groupe"
                v-model="groupe"
                :items="mes_group"
                item-text="name"
                item-value="pk"
              ></v-autocomplete>
            </v-col>
            <v-col md="5" sm="6">
              <v-autocomplete
                outlined
                filled
                dense
                style="font-weight: 300"
                label="Selectionnez l'étape"
                v-model="etape"
                :items="mes_etapes"
                item-text="nom_typesteps"
                item-value="id_typesteps"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" sm="12" md="3" class="d-flex justify-center">
              <v-btn
              class="mx-2"
                @click.prevent="addProcc"
                dark
                outlined
                style="font-weight: 300"
                color="#21209C"
              >
                <v-icon>mdi-add</v-icon>
                Ajouter</v-btn
              >
              <v-btn
                @click.prevent="removeProcc"
                dark
                outlined
                style="font-weight: 300"
                color="red"
              >
                <v-icon>mdi-add</v-icon>
                Retirer</v-btn
              >
            </v-col>
            <v-col
              md="12"
              sm="12"
              cols="12"
              class="d-flex justify-center"
              style="font-size: 17px; font-weight: 300"
            >
              <ol>
                <li v-for="(i, k) in mon_procc" :key="k">
                  Etape ({{ i.etape }}) -- Groupe ({{ i.cible_name }})
                </li>
              </ol>
            </v-col>

            <v-col
              md="12"
              class="d-flex justify-right"
              style="font-weight: 300; font-style: italic; font-size: 15px"
            >
              Tous les champs (*) sont obligatoire
            </v-col>
          </v-row>
        </v-card>
        <v-dialog
          v-model="dialog"
          scrollable
          :overlay="false"
          max-width="500px"
          transition="dialog-transition"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-on="on"
              v-bind="attrs"
              color="#21209C"
              @click="e6 = 4"
              outlined
              dark
            >
              Creer le processus
            </v-btn>
          </template>
          <v-card>
            <v-toolbar
              style="font-size: 1.4rem; font-weight: 300"
              color="#21209C"
              dark
              >Contrainte</v-toolbar
            >
            <v-card-text>
              <v-autocomplete
                outlined
                filled
                dense
                style="font-weight: 300"
                label="Selectionnez l'étape bloquante"
                v-model="blocante_step"
                :items="contraintes"
                item-text="nom_typesteps"
                item-value="id_stepprocess"
              ></v-autocomplete>
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn
                outlined
                color="#21209C"
                @click.prevent="
                  CreateProcess(
                    nom_procc,
                    related,
                    type_procc,
                    mon_procc,
                    blocante_step
                  )
                "
                >Creer</v-btn
              >
              <v-btn text color="red" @click="HandleAnnuler">Annuler</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-stepper-content>

      <v-stepper-step
        color="#21209C"
        style="font-weight: 300; font-size: 1.1rem"
        :complete="e6 > 3"
        step="3"
      >
        Configuration Rapport
      </v-stepper-step>
      <v-stepper-content step="3">
        <v-card class="mb-12" elevation="0">
          <v-row>
            <v-col md="6">
              <v-select
                outlined
                filled
                dense
                label="Selectionnez l'acteur"
                :items="acteurs"
                item-text="name"
                item-value="id"
                v-model="acteur"
                autocomplete
              ></v-select>
            </v-col>
            <v-col md="6">
              <v-switch
                label="Le rapport est t-il obligatoire ?"
                style="font-style: italic"
                v-model="expression"
              ></v-switch>
            </v-col>
            <v-col md="12">
              <v-select
                outlined
                filled
                dense
                label="Selectionnez le validateur"
                :items="validateurs"
                item-text="nom"
                item-value="id"
                v-model="validateur"
                autocomplete
              ></v-select>
            </v-col>
          </v-row>
        </v-card>
        <v-btn
          dark
          @click="Rapport(acteur, expression, validateur)"
          color="#21209C"
        >
          Valider
        </v-btn>
      </v-stepper-content>
    </v-stepper>
  </div>
</template>