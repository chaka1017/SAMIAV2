<script>
import axios from "axios";
import { mapGetters } from "vuex";

export default {
  name: "InfoMission",
  data: () => ({
    dialog: false,
    dialog_detail: false,

    numero_cheque: null,
    nom_banque: null,
    mode_paiement: "False",
    mode_paiement_val: "False",
    mode_paiement_val_indiv: "False",

    numero_cheque_indiv: null,
    nom_banque_indiv: null,
    mode_paiement_indiv: "False",
    numero: null,
    rapport: [],
  }),

  computed: {
    ...mapGetters(["permissions_user"]),
  },
  props: {
    message_validation_tr: null,
    banques: {},
    num_mission: {
      default: "XXXXXX",
    },
    id_mission: null,
    objet_mission: {
      default: "objet",
    },
    objectif_mission: {
      default: "objectif",
    },
    contexte_mission: {
      default: "context",
    },
    chef_delegation_mission: {
      default: "Chef de la délégation",
    },
    membres_mission: [],
    destination_mission: [],
    etape_mission: null,
    show_paiment: null,
    divers: null,
    cpte_mission: {
      default: "destination",
    },
    processus_mission: {
      default: "destination",
    },
    regime_mission: {
      default: "destination",
    },
    billet_mission: {
      default: "destination",
    },
    depart_mission: {
      default: "destination",
    },
    retour_mission: {
      default: "destination",
    },
    titre_boutton: {
      default: "Valider",
    },
  },
  methods: {
    async ValideRapport() {
      // alert(id_envoye)
      // alert()
      const jeton = this.$store.state.user["token"];
      const user = this.$store.state.user["user_id"];

      const data = new FormData();
      data.append("id_validateur", user);
      const response = await axios.put(
        "Rapportdetail/" + this.rapport.id_rapport + "/",
        data,
        {
          headers: { Authorization: "Bearer " + jeton },
        }
      );
      console.log(response);
      this.rapport = response.data[0];
    },
    async GetRapport(id_envoye) {
      const jeton = this.$store.state.user["token"];
      // alert(id_envoye);
      const rapport = await axios.get(
        "rapport_envoyeDetail/" + id_envoye + "/",
        {
          headers: { Authorization: "Bearer " + jeton },
        }
      );
      console.log(rapport.data[0]);
      this.rapport = rapport.data[0];
    },
    AddNumber(numero) {
      this.$emit("addnumero", numero);
      this.dialog = false;
      // alert(numero);
    },
    Validate() {
      //   console.log(valeur);
      this.$emit("validation");
      this.dialog = false;
    },
    Rejeter(val1, val2, val3) {
      this.dialog = false;
      this.$emit("rejet", val1, val2, val3);
    },

    validate_paiement_indiv(id_env, role, total) {
      const user = this.$store.state.user["user_id"];
      const jeton = this.$store.state.user["token"];
      const data = new FormData();
      //   alert(id_env);
      data.append("id_envoye", id_env);
      data.append("id_mission", this.id_mission);
      data.append("user_paiement", user);
      data.append("cheque", this.mode_paiement_indiv);
      if (role == "chef de delegation") {
        data.append("montant", parseInt(total) + parseInt(this.divers));
      } else {
        data.append("montant", total);
      }

      if (this.mode_paiement_indiv == "True") {
        // console.log(this.mode_paiement);
        if (this.numero_cheque_indiv != null || this.nom_banque_indiv != null) {
          console.log(this.nom_banque_indiv);
          data.append("nom_banque", this.nom_banque_indiv);
          data.append("numero_cheque", this.numero_cheque_indiv);
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
          // alert("mistake");
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

      this.dialog_detail = false;
    },
  },
};
</script>

<template>
  <div class="infomission">
    <v-card
      elevation="0"
      style="border: 1px #dfe4ea solid; border-top: 4px #f37121 solid"
    >
      <v-toolbar elevation="0" style="font-size: 1.3rem">
        Mission : {{ num_mission }}
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" width="500">
          <template
            v-slot:activator="{ on, attrs }"
            v-if="titre_boutton != 'Attente de justification'"
          >
            <v-btn v-bind="attrs" v-on="on" color="#F37121" outlined>{{
              titre_boutton
            }}</v-btn>
          </template>
          <v-card v-if="titre_boutton == 'valider'">
            <v-toolbar style="font-size: 1.3rem" dark
              ><v-btn icon dark @click="dialog = false">
                <v-icon>mdi-close</v-icon> </v-btn
              >{{ titre_boutton }}</v-toolbar
            >
            <v-card-text>
              <v-row>
                <v-col md="12" cols="12">
                  <v-radio-group v-if="etape_mission == 'paiement'">
                    <template v-slot:label>
                      <div style="font-size: 1rem; color: black">
                        Selectionner le
                        <strong>moyen de paiement</strong>
                      </div>
                    </template>
                    <v-radio value="True">
                      <template v-slot:label>
                        <div>
                          <strong>Chèque dfdf</strong>
                        </div>
                      </template>
                    </v-radio>
                    <v-radio value="False">
                      <template v-slot:label>
                        <div>
                          <strong>Cash</strong>
                        </div>
                      </template>
                    </v-radio>
                  </v-radio-group>
                </v-col>
                <v-col cols="12" md="12" v-if="mode_paiement == 'True'">
                  <v-select
                    v-if="etape_mission == 'paiement'"
                    v-model="nom_banque"
                    :items="banques"
                    item-text="nom_bank"
                    item-value="id_bank"
                    label="Selectionnez la banque"
                    hint="La banque est requises"
                  >
                    <template v-slot:item="data">
                      <template>
                        <v-list-item-avatar>
                          <img
                            :src="
                              'http://192.168.0.37:8000' + data.item.url_logo
                            "
                          />
                        </v-list-item-avatar>
                        <v-list-item-content>
                          <v-list-item-title
                            v-html="data.item.nom_bank"
                          ></v-list-item-title>
                          <v-list-item-subtitle
                            v-html="data.item.nom_bank"
                          ></v-list-item-subtitle>
                        </v-list-item-content>
                      </template>
                    </template>
                  </v-select>
                </v-col>
                <v-col md="12" v-if="mode_paiement == 'True'">
                  <v-text-field
                    v-model="numero_cheque"
                    v-if="etape_mission == 'paiement'"
                    label="Entrez le N° du chèque"
                    hint="Le numéro de chèque est réquis"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn
                text
                color="success"
                v-if="etape_mission != 'paiement'"
                @click="Validate"
                >Valider</v-btn
              >

              <v-btn text color="success" v-if="etape_mission == 'paiement'"
                >Payer</v-btn
              >
              <v-btn text @click="Rejeter">Rejeter</v-btn>
            </v-card-actions>
          </v-card>
          <v-card v-else-if="titre_boutton == 'numero'">
            <v-card>
              <v-toolbar color="primary" dark style="font-size: 1.3rem">
                Attribuer un numéro a la mission</v-toolbar
              >
              <v-card-text>
                <v-text-field
                  outlined
                  tile
                  filled
                  name="name"
                  label="Saisissez le numéro de la mission"
                  v-model="numero"
                ></v-text-field>
              </v-card-text>
              <v-card-actions class="justify-end">
                <v-btn outlined color="primary" @click="AddNumber(numero)"
                  >Attribuer</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-card>
        </v-dialog>
      </v-toolbar>

      <v-card-text>
        <v-row>
          <v-col
            md="12"
            style="font-weight: 370; font-size: 1.2rem; color: #f37121"
          >
            Informations sur la mission
          </v-col>
          <v-col md="4">
            <span style="font-weight: 600; color: black">Objet :</span>
            {{ objet_mission }}
          </v-col>
          <v-col md="4">
            <span style="font-weight: 600; color: black">Objectif :</span>
            {{ objectif_mission }}
          </v-col>
          <v-col md="4">
            <span style="font-weight: 600; color: black">Context :</span>
            {{ contexte_mission }}
          </v-col>
          <v-col
            md="12"
            style="font-weight: 370; font-size: 1.2rem; color: #f37121"
          >
            Destination et chef de délégation</v-col
          >
          <v-col md="4">
            <span style="font-weight: 600; color: black"
              >Chef de la délégation :</span
            >
            {{ chef_delegation_mission }}
          </v-col>
          <v-col md="4">
            <span style="font-weight: 600; color: black"
              >Destination (s) :</span
            >
            <span v-for="(destination, i) in destination_mission" :key="i">
              {{ destination }}
            </span>
          </v-col>
          <v-col md="12">
            <v-list subheader style="border: 1px #dfe4ea solid; padding: 5px">
              <v-subheader
                style="
                  font-weight: 370;
                  font-size: 1.2rem;
                  color: #f37121;
                  padding-left: 0px;
                "
                >Membres de la délégation
              </v-subheader>

              <v-list-item v-for="(membre, i) in membres_mission" :key="i">
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
                    <span><b>Rôle</b> : {{ membre.role }} / </span>
                    <span><b>Perdiem</b> : {{ membre.perdiem }} /</span>
                    <span><b>Hebergement</b> : {{ membre.hebergement }}</span>
                  </v-list-item-subtitle>
                  <v-list-item-subtitle>
                    <span v-if="divers"><b>Divers</b> : {{ divers }}</span>
                  </v-list-item-subtitle>
                  <v-list-item-subtitle>
                    <span><b>Total</b> : {{ membre.total }} </span>
                  </v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-action class="d-inline">
                  <v-dialog
                    v-model="membre.dialog"
                    ref="formDialog"
                    width="500"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        :disabled="
                          (etape_mission == 'paiement') & (membre.Paye == false)
                            ? false
                            : true
                        "
                        color="#f37121"
                        outlined
                        v-bind="attrs"
                        v-on="on"
                        dense
                      >
                        paiement
                      </v-btn>
                    </template>
                    <v-card>
                      <v-toolbar
                        style="font-size: 1.3rem; font-weight: 300"
                        dark
                      >
                        <v-btn dark @click="membre.dialog = false" icon>
                          <v-icon>mdi-close</v-icon>
                        </v-btn>
                        {{ titre_boutton }}
                      </v-toolbar>
                      <v-card-text>
                        <v-row>
                          <v-col md="12">
                            <v-radio-group
                              v-model="mode_paiement_indiv"
                              v-if="etape_mission == 'paiement'"
                            >
                              <template v-slot:label>
                                <div style="font-size: 1rem; color: black">
                                  Selectionner le
                                  <strong>moyen de paiement</strong>
                                </div>
                              </template>
                              <v-radio value="True">
                                <template v-slot:label>
                                  <div>
                                    <strong>Chèque</strong>
                                  </div>
                                </template>
                              </v-radio>
                              <v-radio value="False">
                                <template v-slot:label>
                                  <div>
                                    <strong>Cash</strong>
                                  </div>
                                </template>
                              </v-radio>
                            </v-radio-group>
                          </v-col>
                          <v-col md="12" v-if="mode_paiement_indiv == 'True'">
                            <v-select
                              v-if="etape_mission == 'paiement'"
                              v-model="nom_banque_indiv"
                              :items="banques"
                              item-text="nom_bank"
                              item-value="id_bank"
                              label="Selectionnez la banque"
                              hint="La banque est requises"
                            >
                              <template v-slot:item="data">
                                <template>
                                  <v-list-item-avatar>
                                    <img
                                      :src="
                                        'http://192.168.0.37:8000' +
                                        data.item.url_logo
                                      "
                                    />
                                  </v-list-item-avatar>
                                  <v-list-item-content>
                                    <v-list-item-title
                                      v-html="data.item.nom_bank"
                                    ></v-list-item-title>
                                    <v-list-item-subtitle
                                      v-html="data.item.nom_bank"
                                    ></v-list-item-subtitle>
                                  </v-list-item-content>
                                </template>
                              </template>
                            </v-select>
                          </v-col>
                          <v-col md="12" v-if="mode_paiement_indiv == 'True'">
                            <v-text-field
                              v-model="numero_cheque_indiv"
                              v-if="etape_mission == 'paiement'"
                              label="Entrez le N° du chèque"
                              hint="Le numéro de chèque est réquis"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                      </v-card-text>
                      <v-card-actions class="justify-end">
                        <v-btn
                          text
                          color="success"
                          @click="
                            validate_paiement_indiv(
                              membre.id_envoye,
                              membre.role,
                              membre.total
                            )
                          "
                        >
                          Payer</v-btn
                        >
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                  <v-dialog
                    v-model="membre.dialog_rapportage"
                    :overlay="false"
                    max-width="1000px"
                    transition="dialog-transition"
                    v-if="
                      permissions_user.rights.filter(
                        (droit) => droit == 'valide_rapport'
                      )[0]
                    "
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        class="mx-2"
                        :disabled="!membre.rapport == true || !membre.rapport_state.Submitted == true"
                        v-on="on"
                        v-bind="attrs"
                        color="success"
                        outlined
                        @click="GetRapport(membre.id_envoye)"
                        >Rapport</v-btn
                      >
                    </template>
                    <v-card>
                      <v-toolbar color="#21209C" dark style="font-size: 1.5rem">
                        <v-btn
                          icon
                          dark
                          @click="membre.dialog_rapportage = false"
                        >
                          <v-icon>mdi-close</v-icon>
                        </v-btn>
                        <v-toolbar-title>Consulter le rapport</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-btn
                          :href="
                            'http://192.168.0.37:8000/static/' + rapport.fichier
                          "
                          text
                          target="_blank"
                        >
                          <v-icon>mdi-download</v-icon>
                          Telecharger la pièce jointe</v-btn
                        >
                        <v-btn
                          outlined
                          :disabled="rapport.validation == null ? false : true"
                          color="white"
                          @click="ValideRapport"
                        >
                          Valider</v-btn
                        >
                      </v-toolbar>
                      <v-card-text class="d-flex justify-center py-10">
                        <v-row>
                          <v-col md="6" v-if="objectif_mission">
                            <span style="font-size: 1rem; color: black"
                              >Objectif mission :
                            </span>
                            {{ objectif_mission }}
                          </v-col>
                          <v-col md="6" v-if="contexte_mission">
                            <span style="font-size: 1rem; color: black"
                              >Contexte mission :
                            </span>
                            {{ contexte_mission }}
                          </v-col>
                          <v-col md="6" v-if="rapport.resultats_attendu">
                            <span style="font-size: 1rem; color: black"
                              >Résultats attendus :
                            </span>
                            {{ rapport.resultats_attendu }}
                          </v-col>
                          <v-col md="6" v-if="rapport.recommendations">
                            <span style="font-size: 1rem; color: black"
                              >Recommendations :
                            </span>
                            {{ rapport.recommendations }}
                          </v-col>
                        </v-row>
                      </v-card-text>
                      <v-card-actions class="d-flex justify-center">
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-col>
          <v-col
            md="12"
            style="font-weight: 370; font-size: 1.2rem; color: #f37121"
          >
            Processus de validation</v-col
          >
          <v-col md="4">
            <span style="font-weight: 600; color: black"
              >Mission au compte de :</span
            >
            {{ cpte_mission }}
          </v-col>
          <v-col md="4">
            <span style="font-weight: 600; color: black">Procesuss :</span>
            {{ processus_mission }}
          </v-col>
          <v-col md="4">
            <span style="font-weight: 600; color: black">Régime :</span>
            {{ regime_mission }}
          </v-col>
          <v-col md="4">
            <span style="font-weight: 600; color: black">Billet d'avion :</span>
            {{ billet_mission == "True" ? "OUI" : "NON" }}
          </v-col>
          <v-col md="4">
            <span style="font-weight: 600; color: black">Date de depart :</span>
            {{ depart_mission }}
          </v-col>
          <v-col md="4">
            <span style="font-weight: 600; color: black">Date d'arrivée :</span>
            {{ retour_mission }}
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<style scoped>
.infomission {
  cursor: default;
}
</style>
