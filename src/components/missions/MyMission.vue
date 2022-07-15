<script>
import { mapGetters } from "vuex";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// import { VueEditor } from "vue2-editor";
import axios from "axios";
export default {
  name: "MyMission",
  data: () => ({
    type_depense: [
      { name: "Dépense", valeu: "depense" },
      { name: "Retour de caisse", value: "retour de caisse" },
    ],

    villes: [],
    employees: [],
    entites: [],
    processus: [],
    procedure: [],

    type_piece: null,
    libelle: null,
    montant: null,
    piece: null,
    commentaire: null,

    resultats: null,

    recommendation: null,
    results: null,
    fichier_rapport: null,
    fi: null,

    justificatifs: [],
    mymissions: null,
    nom_chef_delegation: null,
    destinations_name: null,
    procc_name: null,
    procedu_name: null,
    cpte_entite_name: null,

    success: false,
    message: null,
    content: null,

    dialog_finalisation: false,
    message_finalisation: [],
  }),
  components: {
    // VueEditor,
  },
  computed: {
    ...mapGetters(["mymission", "user"]),
  },
  created() {
    this.InitDownload();
  },
  
  methods: {
    MakePdf() {
      window.html2canvas = html2canvas;
      var doc = new jsPDF({
        orientation: "p",
        unit: "px",
        format: "a4",
        putOnlyUsedFonts: true,
      });
      doc.html(document.querySelector("#printed"), {
        callback: function (pdf) {
          pdf.save("fiche_mission.pdf");
        },
      });
    },

    downloadWithCSS() {
      const doc = new jsPDF();
      /** WITH CSS */
      var canvasElement = document.createElement("canvas");
      html2canvas(this.$refs.content, { canvas: canvasElement }).then(function (
        canvas
      ) {
        const img = canvas.toDataURL("image/jpeg", 0.8);
        doc.addImage(img, "JPEG", 20, 20);
        doc.save("sample.pdf");
      });
    },
    Finaliser() {
      this.dialog_finalisation = true;
      console.log(this.$store.state.mymission.id_mission);
      const jeton = this.$store.state.user["token"];
      const data = new FormData();
      data.append("id_mission", this.$store.state.mymission.id_mission);
      axios
        .post("Finalisation/", data, {
          headers: { Authorization: "Bearer " + jeton },
        })
        .then((resp) => {
          console.log(resp);
          this.message_finalisation = resp.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    DeleteJustif(val) {
      const jeton = this.$store.state.user["token"];
      // const jeton = this.$store.state.user["token"];

      axios
        .delete("justificationDetail/" + val + "/", {
          headers: { Authorization: "Bearer " + jeton },
        })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },

    TerminerJustif(val) {
      const jeton = this.$store.state.user["token"];

      const data = new FormData();
      data.append("justifier", true);
      axios
        .put("Envoyedetail/" + val + "/", data, {
          headers: { Authorization: "Bearer " + jeton },
        })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },

    HandleJustifier(val) {
      //   alert("bonjour");
      console.log(val);
      const jeton = this.$store.state.user["token"];
      //   const user = this.$store.state.user["user_id"];

      const dannix = new FormData();
      dannix.append("Type_piece", this.type_piece);
      dannix.append("Libelle", this.libelle);
      dannix.append("Montant", this.montant);
      dannix.append("piece", this.piece);
      dannix.append("commentaire", this.commentaire);
      dannix.append("id_envoye_id", val);
      axios
        .post("justification/", dannix, {
          headers: { Authorization: "Bearer " + jeton },
        })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
      this.type_piece = null;
      this.libelle = null;
      this.montant = null;
      this.piece = null;
      this.commentaire = null;
    },

    InitDownload() {
      this.villes = this.$store.state.villes;
      this.employees = this.$store.state.employees;
      this.entites = this.$store.state.entites;
      this.processus = this.$store.state.processus;
      console.log("processus", this.processus);
      this.procedure = this.$store.state.procedure;
      this.mymissions = this.$store.state.mymission;
    },

    beforeOpen(event) {
      console.log("Opening...");
      console.log(event);
    },

    AjouterRapport(envoye, rapport_config) {
      console.log("fi", this.fichier_rapport);
      console.log(this.recommendation);
      console.log(this.$store.state.user.user_id);
      console.log(this.resultats);
      const jeton = this.$store.state.user["token"];

      let data = new FormData();

      data.append("resultats_attendu", this.resultats);
      data.append("recommendations", this.recommendation);
      data.append("id_createur", this.$store.state.user.user_id);
      data.append("id_envoye1", envoye);
      data.append("rapport_config", rapport_config);
      data.append("fichier", this.fichier_rapport);
      console.log(data);
      this.resultats = null;
      this.recommendation = null;
      this.fichier_rapport = null;

      console.log("donnée envoyé par POST", data);
      axios
        .post("RapportList/", data, {
          headers: {
            Authorization: "Bearer " + jeton,
          },
        })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },

    HandleReceptionner(val) {
      // alert(val);
      const jeton = this.$store.state.user["token"];
      const user = this.$store.state.user["user_id"];
      const data = new FormData();
      data.append("id_envoye", val);
      data.append("id_mission", this.mymissions.id_mission);
      axios
        .put("reception_paiement/", data, {
          headers: { Authorization: "Bearer " + jeton },
        })
        .then((resp) => {
          console.log(resp);
          this.message = resp.data;
          this.success = true;
          setTimeout(() => {
            this.success = false;
            this.message = true;
          }, 5000);
        })
        .catch((err) => {
          console.log(err);
        });

      axios
        .get("mes-missionlist/" + user + "/", {
          headers: { Authorization: "Bearer " + jeton },
        })
        .then((resp) => {
          this.$store.dispatch("missions", resp.data);
        })
        .catch((err) => {
          alert(err);
        });
    },
  },
};
</script>

<template>
  <div
    class="mymissions"
    style="
      border: 1px #dfe4ea solid;
      border-top: 4px #21209c solid;
      cursor: default;
    "
  >
    <v-alert dense text v-if="success" type="success">
      Paiement receptionné
    </v-alert>
    <v-card elevation="0">
      <v-card-title
        primary-title
        class="d-flex justify-start"
        style="font-weight: 370; font-size: 1.4rem"
      >
        <v-row>
          <v-col class="d-flex justify-start" md="6">
            Missions : {{ mymission.numero_mission }}
          </v-col>
          <v-col class="d-flex justify-end">
            <v-dialog max-width="600" v-model="dialog_finalisation">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-on="on"
                  v-bind="attrs"
                  color="success"
                  @click="Finaliser"
                  outlined
                  >Cloturer</v-btn
                >
              </template>
              <v-card>
                <v-toolbar style="font-size: 1.3rem" dark>
                  Stauts des envoyés de la mission
                  {{ mymission.numero_mission }}
                  <v-spacer></v-spacer>
                  <v-btn dark @click="dialog_finalisation = false" icon>
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-toolbar>
                <v-card-text class="mt-5">
                  <v-alert
                    v-for="(item, i) in message_finalisation"
                    :key="i"
                    text
                    type="info"
                  >
                    <h3 class="text-h5">
                      {{ item.nom_employe }} {{ item.prenoms_employe }}
                    </h3>
                    <v-row align="center" no-gutters>
                      <v-col md="12">
                        <p
                          v-for="(mes, m) in item.msg"
                          :key="m"
                          :class="
                            mes.statut == false ? 'red--text' : 'green--text'
                          "
                        >
                          {{ mes.msg }}
                        </p>
                      </v-col>
                    </v-row>
                  </v-alert>
                </v-card-text>
              </v-card>
            </v-dialog>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col
            md="12"
            cols="12"
            style="font-weight: 370; font-size: 1.2rem; color: #f37121"
          >
            Informations sur la mission
          </v-col>
          <v-col cols="12" md="4">
            <span style="font-weight: 600; color: black">Objet :</span>
            {{ mymission.objet_mission }}
          </v-col>
          <v-col cols="12" md="4">
            <span style="font-weight: 600; color: black">Objectif :</span>
            {{ mymission.objectifs_mission }}
          </v-col>
          <v-col cols="12" md="4">
            <span style="font-weight: 600; color: black">Context :</span>
            {{ mymission.contexte_mission }}
          </v-col>
          <v-col
            md="12"
            cols="12"
            style="font-weight: 370; font-size: 1.2rem; color: #f37121"
          >
            Destination et chef de délégation</v-col
          >
          <v-col md="4" cols="12">
            <span style="font-weight: 600; color: black"
              >Chef de la délégation :</span
            >
            {{
              employees.filter(
                (value) => value.id_employe == mymission.chef_delegation
              )[0]["valide_rapport"]
            }}
          </v-col>
          <v-col md="4" cols="12">
            <span style="font-weight: 600; color: black"
              >Destination (s) :</span
            >
            <span v-for="(destination, i) in mymission.destination" :key="i">
              {{ destination }}
            </span>
          </v-col>
          <v-col
            cols="12"
            md="12"
            style="font-weight: 370; font-size: 1.2rem; color: #f37121"
          >
            Processus de validation</v-col
          >
          <v-col md="4" cols="12">
            <span style="font-weight: 600; color: black"
              >Mission au compte de :</span
            >
            {{
              entites.filter((value) => value.id_entite == mymission.entite)[0][
                "nom_pole"
              ]
            }}
          </v-col>
          <v-col md="4" cols="12" v-if="mymission.type_processus_id">
            <span style="font-weight: 600; color: black">Procesuss :</span>
            {{
              processus.filter(
                (value) => value.id_process == mymission.type_processus
              )[0]["nom_processus"]
            }}
          </v-col>
          <v-col md="4" cols="12">
            <span style="font-weight: 600; color: black">Régime :</span>
            {{
              procedure.filter(
                (regime) => regime.id_regime == mymission.regime
              )[0]["nom_regime"]
            }}
          </v-col>
          <v-col md="4" cols="12">
            <span style="font-weight: 600; color: black">Billet d'avion :</span>
            {{ mymission.avion == "True" ? "OUI" : "NON" }}
          </v-col>
          <v-col md="4" cols="12">
            <span style="font-weight: 600; color: black">Date de depart :</span>
            {{ mymission.depart_mission }}
          </v-col>
          <v-col md="4" cols="12">
            <span style="font-weight: 600; color: black">Date d'arrivée :</span>
            {{ mymission.retour_mission }}
          </v-col>
          <v-col md="12" cols="12">
            <v-list subheader style="border: 1px #dfe4ea solid; padding: 5px">
              <v-subheader
                style="
                  font-weight: 370;
                  font-size: 1.2rem;
                  color: #f37121;
                  padding-left: 0px;
                "
                >Membres de la délégation &nbsp;&nbsp;
                <v-chip> {{ mymission.envoye.length }}</v-chip>
              </v-subheader>

              <v-list-item v-for="(membre, i) in mymission.envoye" :key="i">
                <v-list-item-avatar>
                  <v-img
                    :src="'http://192.168.0.37:8000' + membre.url_photo"
                  ></v-img>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title>
                    {{ membre.nom_employe + " " + membre.prenom_employe }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    <span
                      ><b>Rôle : {{ membre.role }}</b> /
                    </span>
                    <span
                      ><b>Perdiem : {{ membre.perdiem }}</b> /</span
                    >
                    <span
                      ><b>Hebergement : {{ membre.hebergement }}</b>
                    </span>
                  </v-list-item-subtitle>
                  <v-list-item-subtitle>
                    <span
                      ><b>Total</b> :
                      <b>{{ membre.Montant.montant_a_justifier }} </b>/
                      <b>Montant à justifier:</b>
                      <span>
                        <b
                          >{{ membre.Montant.montant_a_justifier }}
                          /
                        </b>
                      </span>
                    </span>
                    <span
                      ><b>
                        Reste à justifier:
                        {{ membre.Montant.rest_a_justifier }} /</b
                      ></span
                    >
                    <span
                      ><b>
                        Solde des justificatifs:
                        {{ membre.Montant.sold_des_justif }}</b
                      ></span
                    >
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action class="d-inline">
                  <v-btn
                    width="150px"
                    :disabled="
                      membre.Paye == true &&
                      membre.Receptionner == false &&
                      membre.userid == user.user_id
                        ? false
                        : true
                    "
                    @click="HandleReceptionner(membre.id_envoye)"
                    color="#f37121"
                    outlined
                    dense
                  >
                    receptionner
                  </v-btn>
                  <v-dialog v-model="membre.dialog" width="1000" elevation="0">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        v-bind="attrs"
                        v-on="on"
                        width="150px"
                        class="mx-2"
                        @before-open="beforeOpen"
                        :disabled="
                          membre.userid == user.user_id &&
                          membre.Receptionner == true
                            ? false
                            : true
                        "
                        color="#f37121"
                        outlined
                        dense
                      >
                        {{
                          membre.justifier == true ? "Consulter" : "Justifier"
                        }}
                      </v-btn>
                    </template>
                    <v-card class="m-10">
                      <v-toolbar dark color="#21209C"
                        ><v-btn icon dark @click="membre.dialog = false">
                          <v-icon>mdi-close</v-icon> </v-btn
                        ><v-toolbar-title>Justificatifs</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-btn
                          dark
                          :disabled="membre.justifier == true"
                          v-if="membre.Montant.rest_a_justifier < 0"
                          color="#F37121"
                          @click="TerminerJustif(membre.id_envoye)"
                          >Terminer</v-btn
                        >
                      </v-toolbar>
                      <v-card-text>
                        <v-row>
                          <!-- FORMULAIRE -->
                          <v-col
                            md="4"
                            style="border: 1px solid #dfe4ea; margin-top: 30px"
                          >
                            <v-row>
                              <v-col md="12" cols="12">
                                <v-select
                                  outlined
                                  filled
                                  dense
                                  :items="type_depense"
                                  item-text="name"
                                  item-value="value"
                                  v-model="type_piece"
                                  label="Selectionner le type de pièce"
                                ></v-select>
                              </v-col>
                              <v-col md="12" cols="12">
                                <v-text-field
                                  outlined
                                  filled
                                  dense
                                  v-model="libelle"
                                  label="Libéllé"
                                ></v-text-field>
                              </v-col>
                              <v-col md="12" class="d-inline" cols="12">
                                <v-text-field
                                  outlined
                                  filled
                                  dense
                                  v-model="montant"
                                  hide-details
                                  single-line
                                  type="number"
                                  label="Montant"
                                />
                              </v-col>
                              <v-col md="12" cols="12">
                                <v-file-input
                                  outlined
                                  filled
                                  dense
                                  truncate-length="15"
                                  v-model="piece"
                                ></v-file-input>
                              </v-col>
                              <v-col md="12" cols="12">
                                <v-textarea
                                  outlined
                                  filled
                                  dense
                                  v-model="commentaire"
                                  name="input-7-1"
                                  label="Commentaire"
                                ></v-textarea>
                              </v-col>
                              <v-col
                                md="12"
                                cols="12"
                                class="d-flex justify-center"
                              >
                                <v-btn
                                  :disabled="membre.justifier == true"
                                  color="#f37121"
                                  @click="HandleJustifier(membre.id_envoye)"
                                  outlined
                                  >Ajouter</v-btn
                                >
                              </v-col>
                            </v-row>
                          </v-col>
                          <!-- FORMULAIRE -->

                          <!-- FICHIERS ADDED -->
                          <v-col
                            md="8"
                            style="border: 1px solid #dfe4ea; margin-top: 30px"
                          >
                            <v-row>
                              <v-col md="12">
                                <v-list-item
                                  v-for="(folder, i) in membre.justif"
                                  :key="i"
                                >
                                  <v-list-item-avatar>
                                    <v-icon class="primary" dark>
                                      {{
                                        folder.piece.split(".")[
                                          folder.piece.split(".") - 1
                                        ] == "pdf"
                                          ? "mdi-file-pdf-box"
                                          : "mdi-file"
                                      }}
                                    </v-icon>
                                  </v-list-item-avatar>

                                  <v-list-item-content>
                                    <v-list-item-title
                                      v-text="folder.Libelle"
                                    ></v-list-item-title>

                                    <v-list-item-subtitle
                                      v-text="'Montant : ' + folder.Montant"
                                    ></v-list-item-subtitle>
                                    <v-list-item-subtitle
                                      v-text="
                                        'Type de piece : ' + folder.Type_piece
                                      "
                                    ></v-list-item-subtitle>
                                    <v-list-item-subtitle
                                      v-text="
                                        'Commentaire : ' + folder.commentaire
                                      "
                                    ></v-list-item-subtitle>
                                  </v-list-item-content>

                                  <v-list-item-action
                                    class="d-inline justify-start"
                                  >
                                    <v-btn
                                      @click="DeleteJustif(folder.id_justif)"
                                      icon
                                      :disabled="membre.justifier == true"
                                    >
                                      <v-icon color="red"
                                        >mdi-trash-can-outline</v-icon
                                      >
                                    </v-btn>
                                    <v-btn
                                      icon
                                      :href="
                                        'http://192.168.0.37:8000/static/' +
                                        folder.piece
                                      "
                                      target="_blank"
                                    >
                                      <v-icon color="green"
                                        >mdi-download-outline</v-icon
                                      >
                                    </v-btn>
                                  </v-list-item-action>
                                </v-list-item>
                              </v-col>
                            </v-row>
                          </v-col>
                          <!-- FICHIERS ADDED -->
                        </v-row>
                      </v-card-text>
                      <!-- <v-card-actions class="justify-end">
                        <v-btn
                          outlined
                          :disabled="membre.justifier == true"
                          v-if="membre.Montant.rest_a_justifier < 0"
                          color="#F37121"
                          @click="TerminerJustif(membre.id_envoye)"
                          >Terminer</v-btn
                        >
                      </v-card-actions> -->
                    </v-card>
                  </v-dialog>
                  <v-dialog
                    v-model="membre.dialog_rapport"
                    fullscreen
                    :overlay="false"
                    max-width="500px"
                    transition="dialog-transition"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        v-if="membre.rapport && membre.userid == user.user_id"
                        color="success"
                        outlined
                        v-on="on"
                        v-bind="attrs"
                      >
                        <v-icon>mdi-pencil</v-icon>
                        Rapport</v-btn
                      >
                    </template>
                    <v-card>
                      <v-toolbar
                        elevation="0"
                        style="font-size: 1.5rem; font-weight: 500"
                        dark
                        color="#21209C"
                      >
                        <v-btn
                          @click="membre.dialog_rapport = false"
                          color="white"
                          icon
                          ><v-icon>mdi-close </v-icon></v-btn
                        >
                        Editer le rapport de la mission XXX ({{
                          mymission.objet_mission
                        }})
                        <v-spacer></v-spacer>
                        <v-dialog
                          v-model="membre.dialog_etat_print"
                          fullscreen
                          max-width="500px"
                          transition="dialog-transition"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                              v-on="on"
                              v-bind="attrs"
                              @click="MakePdf"
                              outlined
                              color="white"
                            >
                              <v-icon>mdi-printer</v-icon>
                              Imprimer</v-btn
                            >
                          </template>
                          <v-card>
                            <v-toolbar
                              style="font-size: 1.5rem; font-weight: 800"
                              dark
                              elevation="0"
                              color="#21209c"
                            >
                              <v-btn
                                icon
                                dark
                                @click="membre.dialog_etat_print = false"
                              >
                                <v-icon>mdi-close</v-icon>
                              </v-btn>
                              Fiche de mission
                              <v-spacer></v-spacer>
                            </v-toolbar>
                            <v-card-text class="m-10">
                              <div id="printed">
                                <v-row style="margin: 55px">
                                  <v-col
                                    md="12"
                                    style="
                                      font-size: 1.7rem;
                                      color: black;
                                      font-weight: 800;
                                    "
                                    class="d-flex justify-center"
                                  >
                                    <span
                                      style="
                                        border: 3px black solid;
                                        padding: 10px;
                                      "
                                    >
                                      RAPPORT DE MISSION
                                    </span>
                                  </v-col>
                                  <v-col md="12" class="d-flex justify-center">
                                    <span style="font-size: 1rem; color: black"
                                      >ENTITE : &ensp;&ensp;&ensp;&ensp;</span
                                    >
                                    <span> {{ cpte_entite_name }}</span>
                                  </v-col>
                                  <v-col md="12" class="d-flex justify-center">
                                    <span style="font-size: 1rem; color: black"
                                      >NUMERO DE MISSION :
                                      &ensp;&ensp;&ensp;&ensp;
                                    </span>
                                    <span> {{ mymission.numero_mission }}</span>
                                  </v-col>
                                  <v-col md="12" class="d-flex justify-center">
                                    <span style="font-size: 1rem; color: black"
                                      >DEPART : &ensp;&ensp;&ensp;&ensp;
                                    </span>
                                    <span> {{ mymission.depart_mission }}</span>
                                  </v-col>
                                  <v-col md="12" class="d-flex justify-center">
                                    <span style="font-size: 1rem; color: black"
                                      >DEPART : &ensp;&ensp;&ensp;&ensp;
                                    </span>
                                    <span> {{ mymission.retour_mission }}</span>
                                  </v-col>
                                  <v-col md="12" class="d-flex justify-center">
                                    <span style="font-size: 1rem; color: black"
                                      >LIEU : &ensp;&ensp;&ensp;&ensp;
                                    </span>
                                    <span
                                      v-for="(
                                        destination, i
                                      ) in mymission.destination"
                                      :key="i"
                                    >
                                      {{ destination }}</span
                                    >
                                  </v-col>
                                  <v-col md="12" class="d-flex justify-center">
                                    <span style="font-size: 1rem; color: black"
                                      >OBJET : &ensp;&ensp;&ensp;&ensp;
                                    </span>
                                    <span> {{ mymission.objet_mission }}</span>
                                  </v-col>
                                  <v-col md="12" class="d-flex justify-center">
                                    <span style="font-size: 1rem; color: black"
                                      >CONTEXTE : &ensp;&ensp;&ensp;&ensp;
                                    </span>
                                    <span>
                                      {{ mymission.contexte_mission }}</span
                                    >
                                  </v-col>
                                  <v-col md="12" class="d-flex justify-center">
                                    <span style="font-size: 1rem; color: black"
                                      >OBJECTIF : &ensp;&ensp;&ensp;&ensp;
                                    </span>
                                    <span>
                                      {{ mymission.objectifs_mission }}</span
                                    >
                                  </v-col>
                                </v-row>
                              </div>
                            </v-card-text>
                          </v-card>
                        </v-dialog>
                      </v-toolbar>
                      <v-card-text>
                        <v-container>
                          <v-row>
                            <!-- <v-col md="4"> </v-col> -->
                            <v-col md="12">
                              <v-row
                                style="
                                  border: 1px solid #dfe4ea;
                                  border-radius: 5px;
                                  margin-top: 25px;
                                  padding: 5px;
                                "
                              >
                                <v-col
                                  md="16"
                                  class="d-flex justify-start"
                                  style="
                                    font-size: 1.4rem;
                                    color: black;
                                    font-weight: 800;
                                  "
                                >
                                  Informations sur la mission
                                </v-col>
                                <v-col
                                  md="6"
                                  class="d-flex justify-end"
                                  style="
                                    font-size: 1.4rem;
                                    color: black;
                                    font-weight: 800;
                                  "
                                >
                                </v-col>
                                <v-col md="6">
                                  <v-textarea
                                    filled
                                    outlined
                                    disabled
                                    label="Objectifs de la mission"
                                    :value="mymission.objet_mission"
                                  ></v-textarea>
                                </v-col>
                                <v-col md="6">
                                  <v-textarea
                                    filled
                                    outlined
                                    disabled
                                    label="Contexte de la mission"
                                    :value="mymission.contexte_mission"
                                  ></v-textarea>
                                </v-col>
                                <v-col
                                  md="12"
                                  class="d-flex justify-start"
                                  style="
                                    font-size: 1.4rem;
                                    color: black;
                                    font-weight: 800;
                                  "
                                >
                                  Rapport de la missions
                                </v-col>
                                <v-col md="6">
                                  Résultats attendus
                                  <v-textarea
                                    filled
                                    outlined
                                    v-model="resultats"
                                  ></v-textarea>
                                </v-col>
                                <v-col md="6">
                                  Recommendations
                                  <v-textarea
                                    filled
                                    outlined
                                    v-model="recommendation"
                                  ></v-textarea>
                                </v-col>

                                <v-col md="4" class="d-flex justify-start pt-6">
                                  <v-file-input
                                    outlined
                                    filled
                                    dense
                                    truncate-length="15"
                                    v-model="fichier_rapport"
                                    label=" Ajouter des fichiers annexes"
                                  ></v-file-input>
                                </v-col>
                                <v-col md="3" class="mt-4">
                                  <v-dialog
                                    v-model="membre.dialog_valider"
                                    persistent
                                    :overlay="false"
                                    max-width="500px"
                                    transition="dialog-transition"
                                  >
                                    <template v-slot:activator="{ on, attrs }">
                                      <v-btn
                                        v-on="on"
                                        v-bind="attrs"
                                        color="success"
                                        outlined
                                        :disabled="
                                          membre.rapport_state.Submitted
                                        "
                                        >Valider</v-btn
                                      >
                                    </template>
                                    <v-card>
                                      <v-toolbar
                                        style="
                                          font-size: 1.5rem;
                                          font-weight: 800;
                                        "
                                        dark
                                        elevation="0"
                                        color="#21209c"
                                      >
                                        <v-btn
                                          icon
                                          dark
                                          @click="membre.dialog_valider = false"
                                        >
                                          <v-icon>mdi-close</v-icon>
                                        </v-btn>
                                        Confirmer l'envoie
                                        <v-spacer></v-spacer>
                                      </v-toolbar>
                                      <v-card-actions
                                        class="d-flex justify-center py-10"
                                      >
                                        <v-btn
                                          color="success"
                                          outlined
                                          class="mx-3"
                                          @click="
                                            AjouterRapport(membre.id_envoye, membre.rapport_config)
                                          "
                                          >OK</v-btn
                                        >
                                        <v-btn
                                          color="red"
                                          @click="membre.dialog_valider = false"
                                          outlined
                                          class="mx-3"
                                          >annuler</v-btn
                                        >
                                      </v-card-actions>
                                    </v-card>
                                  </v-dialog>
                                </v-col>
                              </v-row>
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-card-text>
                    </v-card>
                  </v-dialog>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>
