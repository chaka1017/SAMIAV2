<script>
// import UserList from "@/components/missions/UserList";
import InfoMissions from "@/components/missions/InfoMissions.vue";
import axios from "axios";
// import { mapGetters } from "vuex";

export default {
  name: "FormMissionShow",
  components: {
    // UserList,
    InfoMissions,
  },
  data: () => ({
    // LIST PAYMEMNT
    mode_paiement: "False",
    employe_paiement: null,
    // LIST PAYMEMNT
    // USER LIST DATA
    search: "",
    headers: [
      {
        text: "Nom",
        align: "start",
        sortable: true,
        value: "nom_employe",
      },
      { text: "Prénoms", value: "prenom_employe" },
      { text: "Hergment", value: "hebergement" },
      { text: "Perdiem", value: "perdiem" },
      { text: "Total", value: "total" },
    ],
    headers_billets: [
      {
        text: "Nom",
        align: "start",
        sortable: true,
        value: "nom_employe",
      },
      { text: "Prénoms", value: "prenom_employe" },
      { text: "Hergment", value: "hebergement" },
      { text: "Perdiem", value: "perdiem" },
      { text: "Total", value: "total" },
      { text: "Billet", value: "avion" },
    ],

    snack: false,
    snackColor: "",
    snackText: "",
    pagination: {},

    // FORMULAIRE
    chef_delegation: null,
    nom_chef_delegation: null,
    cpte_entite: null,
    cpte_entite_name: null,
    objet: null,
    destinations: [],
    destinations_name: [],
    membres: [],
    date_depart: null,
    date_retour: null,
    objectif: null,
    contexte: null,
    divers: null,
    procedu: null,
    procedu_name: null,
    procc: null,
    billet: null,
    procc_name: null,

    dialog_val: false,
    dialog_att: false,
    dialog_billet: false,

    num_mission: null,
    cout: null,
    id_mission: null,

    villes: [],
    employees: [],
    entites: [],
    processus: [],
    procedure: [],
    etape: null,

    etape_mission: null,
    rights: null,

    droit_billet: false,
    droit_valider: false,
    droit_nummission: false,
    droit_forfait: false,
    droit_paiement: false,
    droit_justification: false,

    // ValidationMessage
    message_validation: null,
    logic_message_validation: null,
    error_message: null,
    logic_error_message: false,

    numero_attribue: null,
    button_name: null,
    show_paiment: null,
    message_validation_tr: null,
    banques: null,
    nom_banque: null,
    numero_cheque: null,
    etat_valid_all: null,
    paiement_data: {
      data: [],
    },
  }),

  created() {
    this.miseAjourChamps();
    this.right_avion;
    this.InitData();
  },

  methods: {
    InitData() {
      const jeton = this.$store.state.user["token"];

      axios
        .get("BankList/", { headers: { Authorization: "Bearer " + jeton } })
        .then((res) => {
          // console.log(res.data.results);
          this.banques = res.data.results;
          console.log("les banques", this.banques);
        })
        .catch((err) => {
          console.log(err);
        });
    },

    Makevalidation() {
      const user = this.$store.state.user["user_id"];
      const jeton = this.$store.state.user["token"];
      var data = {
        id_mission: this.id_mission,
        id_user: user,
        validation: "validation",
      };
      switch (this.etape_mission) {
        case "Initiation":
          // alert(this.etape_mission);

          axios
            .post("Validations/", data, {
              headers: { Authorization: "Bearer " + jeton },
            })
            .then((resp) => {
              console.log(resp);
              this.message_validation_tr = resp.data;
              setTimeout(() => {
                this.message_validation_tr = null;
              }, 5000);
            })
            .catch((err) => {
              console.log(err);
            });
          // this.dialog_val = false;
          // this.message_validation = response.data;
          // setTimeout(() => (this.message_validation = null), 2500);
          break;
        case "Validation du rapport":
          // alert(this.etape_mission);

          axios
            .post("Validations/", data, {
              headers: { Authorization: "Bearer " + jeton },
            })
            .then((resp) => {
              console.log(resp);
              this.message_validation_tr = resp.data;
              setTimeout(() => {
                this.message_validation_tr = null;
              }, 5000);
            })
            .catch((err) => {
              console.log(err);
            });
          // this.dialog_val = false;
          // this.message_validation = response.data;
          // setTimeout(() => (this.message_validation = null), 2500);
          break;
        case "Validation de la justification":
          // alert(this.etape_mission);

          axios
            .post("Validations/", data, {
              headers: { Authorization: "Bearer " + jeton },
            })
            .then((resp) => {
              console.log(resp);
              this.message_validation_tr = resp.data;
              setTimeout(() => {
                this.message_validation_tr = null;
              }, 5000);
            })
            .catch((err) => {
              console.log(err);
            });
          // this.dialog_val = false;
          // this.message_validation = response.data;
          // setTimeout(() => (this.message_validation = null), 2500);
          break;
        case "validation":
          // alert(this.etape_mission);

          axios
            .post("Validations/", data, {
              headers: { Authorization: "Bearer " + jeton },
            })
            .then((resp) => {
              console.log(resp);
              this.message_validation_tr = resp.data;
              setTimeout(() => {
                this.message_validation_tr = null;
              }, 5000);
            })
            .catch((err) => {
              console.log(err);
            });
          // this.dialog_val = false;
          // this.message_validation = response.data;
          // setTimeout(() => (this.message_validation = null), 2500);
          break;

        case "numero":
          this.button_name = "numero";
          break;
        case "billet":
          this.button_name = "billet";
          break;
        case "forfait":
          this.button_name = "forfait";
          break;
        case "paiement":
          this.button_name = "paiement";
          break;
      }
      // alert(this.etape);
    },
    AttribuerNumero(val) {
      const jeton = this.$store.state.user["token"];

      const donnee = new FormData();
      donnee.append("id_mission", this.id_mission);
      donnee.append("numero_mission", val);
      axios
        .put("Numero/", donnee, {
          headers: { Authorization: "Bearer " + jeton },
        })
        .then((response) => {
          console.log(response);
          this.message_validation = response.data;
          this.logic_message_validation = true;
          setTimeout(() => {
            this.logic_message_validation = false;
          }, 10000);
        })
        .catch((error) => {
          console.log(error);
          this.error_message = error.response.data;
          this.logic_error_message = true;
          setTimeout(() => {
            this.logic_error_message = false;
          }, 10000);
          this.dialog_billet = false;
        });
    },

    add_billet() {
      const billet = [];
      const envoyes = [];
      for (let index = 0; index < this.membres.length; index++) {
        const element = this.membres[index];
        billet.push(element.avion);
      }
      for (let index = 0; index < this.membres.length; index++) {
        const element = this.membres[index];
        envoyes.push(element.id_envoye);
      }
      const user = this.$store.state.user["user_id"];
      const jeton = this.$store.state.user["token"];

      const data = {
        montant: billet,
        id_user: user,
        billet: "billet",
        id_envoye: envoyes,
      };

      axios
        .post("Billets/", data, {
          headers: { Authorization: "Bearer " + jeton },
        })
        .then((response) => {
          console.log(response);
          this.message_validation = response.data;
          this.logic_message_validation = true;
          setTimeout(() => {
            this.logic_message_validation = false;
          }, 10000);
        })
        .catch((error) => {
          console.log(error);
          this.error_message = error.response.data;
          this.logic_error_message = true;
          setTimeout(() => {
            this.logic_error_message = false;
          }, 10000);
        });
      this.dialog_billet = false;
    },

    save() {
      this.snack = true;
      this.snackColor = "success";
      this.snackText = "Billet d'avion entré";
      // console.log(this.membres);
    },
    cancel() {
      this.snack = true;
      // this.snackColor = "error";
      this.snackText = "Canceled";
    },
    open() {
      this.snack = true;
      // this.snackColor = "info";
      this.snackText = "Entrez le billet d'avion";
    },
    close() {
      console.log("Dialog closed");
    },

    alerteur() {
      alert(this.chef_delegation);
    },

    async validation_mission() {
      const url = "Validations/";
      const user = this.$store.state.user["user_id"];

      const data = {
        id_mission: this.id_mission,
        id_user: user,
        validation: "validation",
      };
      const jeton = this.$store.state.user["token"];

      const response = await axios.post(url, data, {
        headers: { Authorization: "Bearer " + jeton },
      });
      console.log(response);
      this.dialog_val = false;
      this.message_validation = response.data;
      setTimeout(() => (this.message_validation = null), 2500);
    },
    // Rights Methis
    right_avion() {},

    validate_paiement() {
      const user = this.$store.state.user["user_id"];
      const jeton = this.$store.state.user["token"];
      const data = new FormData();
      data.append("id_mission", this.id_mission);
      data.append("id_envoye", this.employe_paiement.id_envoye);
      if (this.employe_paiement.role == "chef de delegation") {
        data.append(
          "montant",
          parseInt(this.employe_paiement.total) + parseInt(this.divers)
        );
      } else {
        data.append("montant", this.employe_paiement.total);
      }
      data.append("user_paiement", user);
      data.append("cheque", this.mode_paiement);

      if (this.mode_paiement == "True") {
        // console.log(this.mode_paiement);
        if (this.numero_cheque != null || this.nom_banque != null) {
          console.log(this.nom_banque);
          data.append("nom_banque", this.nom_banque);
          data.append("numero_cheque", this.numero_cheque);
          axios
            .post("paiement/", data, {
              headers: { Authorization: "Bearer " + jeton },
            })
            .then((res) => {
              console.log(res);
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          alert("mistake");
        }
      } else {
        console.log(data);
        axios
          .post("paiement/", data, {
            headers: { Authorization: "Bearer " + jeton },
          })
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },

    ShowPaiement(value) {
      this.etat_valid_all = value;
      const idx = this.membres.findIndex((obj) => obj.id_employe == value);
      this.employe_paiement = this.membres[idx];
      // this.etat_valid_all = true;
      console.log(this.employe_paiement);
    },

    Afficher() {
      console.log(this.nom_banque);
    },

    miseAjourChamps() {
      this.chef_delegation = this.$store.state.mamission.chef_delegation;
      this.cpte_entite = this.$store.state.mamission;
      this.objet = this.$store.state.mamission.objet_mission;
      this.destinations = this.$store.state.mamission.lieu_mission;
      this.date_depart = this.$store.state.mamission.depart_mission;
      this.date_retour = this.$store.state.mamission.retour_mission;
      this.objectif = this.$store.state.mamission.objectifs_mission;
      this.contexte = this.$store.state.mamission.contexte_mission;
      this.membres = this.$store.state.mamission.envoye;
      this.divers = this.$store.state.mamission.divers;
      this.procc = this.$store.state.mamission.regime;
      this.procedu = this.$store.state.mamission.type_processus;
      this.cpte_entite = this.$store.state.mamission.entite;
      this.divers = this.$store.state.mamission.frais_extra;
      this.num_mission = this.$store.state.mamission.numero_mission;
      this.cout = this.$store.state.mamission.cout;
      this.id_mission = this.$store.state.mamission.id_mission;
      this.billet = this.$store.state.mamission.avion;
      this.etape = this.$store.state.mamission.current_step;
      console.log(this.billet);

      this.etape_mission = this.$store.state.mamission.etape;
      this.rights = this.$store.state.permissions_user.rights;

      this.villes = this.$store.state.villes;
      this.employees = this.$store.state.employees;
      this.entites = this.$store.state.entites;
      this.processus = this.$store.state.processus;
      this.procedure = this.$store.state.procedure;
      console.log(this.etape_mission);

      this.show_paiment = this.membres.findIndex((a) => a.Paye == true) != -1;
      // this.show_paiment = !this.show_paiment;
      // alert(this.show_paiment);

      switch (this.etape_mission) {
        case "Initiation":
          this.button_name = "valider";
          break;
        case "Validation du rapport":
          this.button_name = "valider";
          break;
        case "Validation de la justification":
          this.button_name = "valider";
          break;
        case "validation":
          this.button_name = "valider";
          break;
        case "numero":
          this.button_name = "numero";
          break;
        case "billet":
          this.button_name = "billet";
          break;
        case "forfait":
          this.button_name = "forfait";
          break;
        case "paiement":
          this.button_name = "paiement";
          break;
        case "justification":
          this.button_name = "Attente de justification";
          break;
      }

      // CHEF DE LA DELEGATION NAME
      // CHEF DE LA DELEGATION NAME

      for (let employe of this.membres) {
        if (employe.role == "chef de delegation") {
          this.nom_chef_delegation =
            employe.nom_employe + " " + employe.prenom_employe;
        }
      }
      for (let destination of this.destinations) {
        for (let ville of this.villes) {
          if (ville.id == destination) {
            this.destinations_name.push(ville.city);
          }
        }
      }
      for (let proced of this.procedure) {
        if (this.procc == proced.id_regime) {
          this.procc_name = proced.nom_regime;
        }
      }

      for (let process of this.processus) {
        if (this.procedu == process.id_process) {
          this.procedu_name = process.nom_processus;
        }
      }

      for (let entite of this.entites) {
        if (entite.id_entite == this.cpte_entite) {
          this.cpte_entite_name = entite.nom_entite;
        }
      }

      console.log(this.destinations_name);

      if ((this.etape_mission == "billet") & this.rights.includes("billet")) {
        this.droit_billet = true;
      }

      if (
        (this.etape_mission == "validation") &
        this.rights.includes("validation")
      ) {
        this.droit_valider = true;
      }

      if ((this.etape_mission == "numero") & this.rights.includes("numero")) {
        this.droit_nummission = true;
      }

      if ((this.etape_mission == "forfait") & this.rights.includes("forfait")) {
        this.droit_forfait = true;
      }

      if (
        (this.etape_mission == "paiement") &
        this.rights.includes("paiement")
      ) {
        this.droit_paiement = true;
      }

      if (
        (this.etape_mission == "justification") &
        this.rights.includes("justification")
      ) {
        this.droit_justification = true;
      }
    },
    AjouNum(val) {
      alert(val);
    },
  },
};
</script>

<template>
  <div class="form">
    <v-alert
      v-model="logic_message_validation"
      dense
      prominent
      dismissible
      text
      type="success"
      >{{ message_validation }}</v-alert
    >

    <InfoMissions
      :num_mission="num_mission"
      :objet_mission="objet"
      :objectif_mission="objectif"
      :contexte_mission="contexte"
      :chef_delegation_mission="nom_chef_delegation"
      :destination_mission="destinations_name"
      :membres_mission="membres"
      :cpte_mission="cpte_entite_name"
      :processus_mission="procc_name"
      :regime_mission="procc_name"
      :billet_mission="billet"
      :depart_mission="date_depart"
      :retour_mission="date_retour"
      :id_mission="id_mission"
      :titre_boutton="button_name"
      :etape_mission="etape_mission"
      :show_paiment="show_paiment"
      :message_validation_tr="message_validation_tr"
      @validation="Makevalidation"
      :banques="banques"
      :divers="divers"
      @addnumero="AttribuerNumero"
    />
    <!-- </perfect-scrollbar> -->
  </div>
</template>

<style scoped>
/* @import url("https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400&display=swap"); */
/* @import url("https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;800&display=swap"); */
@import url("https://fonts.googleapis.com/css2?family=League+Spartan:wght@100;300;500;600&display=swap");

.form {
  cursor: default;
}
.question {
  /* font-family: "Open Sans", sans-serif;
   */
  font-family: "League Spartan", sans-serif;
}
.purple {
  background: #3498db;
}

.selected_class {
  background: #dcdde1;
}

.titres {
  /* background: rgba(255, 255, 255, 0.6); */
  /* background: #e67e22; */
  background: #f1f1f1;
  /* color:white; */
  /* box-shadow: 0 5px 10px 0 rgba(31, 38, 135, 0.37); */
  backdrop-filter: blur(13px);
  -webkit-backdrop-filter: blur(13px);
  border-radius: 10px;
  color: black;
  cursor: default;
  /* font-size: 11px; */
  height: 35px;
  font-weight: ;
}
</style>
