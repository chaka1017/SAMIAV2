<script>
import axios from "axios";
export default {
  name: "SignIn",
  data: () => ({
    new_employe: true,
    filialerule: [(v) => !!v || "Ce champs est réquis"],
    regle: [(v) => !!v || "Ce champs est réquis"],
    show3: false,
    e6: 1,

    mes_filiales: null,
    mes_categories: null,
    mes_utilisateurs: null,
    mes_services: null,

    menu: false,

    // Data
    data: {
      nom_employe: null,
      prenoms_employe: null,
      date_naissance_employe: null,
      matricule_employe: null,
      email_employe: null,
      filiale_employe: null,
      fonction_employe: null,
      categorie_employe: null,
      telephone_employe: null,
      id_user: null,
      activer: true,
      id_service: null,
      lui_meme: false,
    },
    // Data

    // TABLE
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        text: "Identifiant",
        align: "start",
        sortable: false,
        value: "id",
      },
      { text: "Nom", value: "first_name" },
      { text: "Prénoms", value: "last_name" },
      { text: "Email", value: "email" },
      { text: "Nom d'utilisateur", value: "protein" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    editedIndex: -1,
    editedItem: {
      name: "",
      calories: 0,
      fat: 0,
      carbs: 0,
      protein: 0,
    },
    defaultItem: {
      name: "",
      calories: 0,
      fat: 0,
      carbs: 0,
      protein: 0,
    },
    // TABLE
  }),
  components: {},
  created() {
    this.InitDownload();
    this.initialize();
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Modifier l'utilisateur";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  methods: {
    async InitDownload() {
      const url = "entitelist/";
      const url1 = "CategorieList/";
      const url2 = "userlist/";
      const url3 = "ServiceList/";

      const jeton = this.$store.state.user["token"];
      const filiales = await axios.get(url, {
        headers: { Authorization: "Bearer " + jeton },
      });
      this.mes_filiales = filiales.data.results;
      // console.log(this.mes_filiales);

      const categorie = await axios.get(url1, {
        headers: { Authorization: "Bearer " + jeton },
      });
      // console.log(categorie);
      this.mes_categories = categorie.data.results;

      const utilisateur = await axios.get(url2, {
        headers: { Authorization: "Bearer " + jeton },
      });
      console.log(utilisateur);
      this.mes_utilisateurs = utilisateur.data.results;

      const services = await axios.get(url3, {
        headers: { Authorization: "Bearer " + jeton },
      });
      console.log(services);
      this.mes_services = services.data.results;
    },

    async CreateEmployee() {
      const url = "Employelist/";
      const jeton = this.$store.state.user["token"];
      this.data["id_createur"] = this.$store.state.user["user_id"];
      const resultat = await axios.post(url, this.data, {
        headers: { Authorization: "Bearer " + jeton },
      });
      console.log(resultat);
      this.dialog = false;
      this.data.nom_employe= null;
      this.data.prenoms_employe= null;
      this.data.date_naissance_employe= null;
      this.data.matricule_employe= null;
      this.data.email_employe= null;
      this.data.filiale_employe= null;
      this.data.fonction_employe= null;
      this.data.categorie_employe= null;
      this.data.telephone_employe= null;
      this.data.id_user= null;
      this.data.activer= true;
      this.data.id_service= null;
      this.data.lui_meme= false;
    },
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
          style="text-transform: capitalize; font-weight: 600"
          @click="new_employe = !new_employe"
        >
          Nouvel employé
          <v-icon style="font-size: 15px">mdi-plus</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
    <v-container v-if="new_employe">
      <v-stepper v-model="e6" vertical>
        <v-stepper-step style="font-size: 1.5rem" :complete="e6 > 1" step="1">
          Informations de l'employé
        </v-stepper-step>

        <v-stepper-content step="1">
          <v-card elevation="0" class="mb-12">
            <v-row class="mt-5">
              <v-col md="3" sm="3" cols="12">
                <v-text-field
                  dense
                  label="Nom de l'employé *"
                  hint="Ce champs est réquis"
                  type="text"
                  v-model="data.nom_employe"
                ></v-text-field>
              </v-col>
              <v-col md="5" sm="3" cols="12">
                <v-text-field
                  dense
                  label="Prénoms de l'employé *"
                  hint="Ce champs est réquis"
                  type="text"
                  v-model="data.prenoms_employe"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4" style="margin-top: -17px">
                <v-menu
                  ref="menu"
                  v-model="menu"
                  :close-on-content-click="false"
                  :return-value.sync="date"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="data.date_naissance_employe"
                      label="Date de naissance de l'employé *"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="data.date_naissance_employe"
                    locale="fr"
                    no-title
                    scrollable
                  >
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="menu = false">
                      annuler
                    </v-btn>
                    <v-btn text color="primary" @click="$refs.menu.save(date)">
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>
              <v-col md="3" cols="12">
                <v-text-field
                  dense
                  label="Numéro de téléphone de l'employé *"
                  hint="Ce champs est réquis"
                  type="text"
                  v-model="data.telephone_employe"
                ></v-text-field>
              </v-col>
              <v-col md="3" cols="12">
                <v-text-field
                  dense
                  label="Email de l'employé *"
                  hint="Ce champs est réquis"
                  type="text"
                  v-model="data.email_employe"
                ></v-text-field>
              </v-col>
              <v-col md="4" cols="12">
                <v-text-field
                  dense
                  label="Fonction de l'employé *"
                  hint="Ce champs est réquis"
                  type="text"
                  v-model="data.fonction_employe"
                ></v-text-field>
              </v-col>
              <v-col md="2" cols="12">
                <v-text-field
                  dense
                  label="Matricule de l'employé *"
                  hint="Ce champs est réquis"
                  type="text"
                  v-model="data.matricule_employe"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card>
          <v-btn
            color="primary"
            @click="e6 = 2"
            style="text-transform: capitalize"
          >
            Continuer
          </v-btn>
          <v-btn text style="text-transform: capitalize"> retour </v-btn>
        </v-stepper-content>

        <v-stepper-step style="font-size: 1.5rem" :complete="e6 > 2" step="2">
          Configuration du compte
        </v-stepper-step>

        <v-stepper-content step="2">
          <v-card elevation="0" class="mb-12">
            <v-row class="mt-5">
              <v-col md="3" cols="12">
                <v-select
                  dense
                  :items="mes_filiales"
                  label="Selectionnez la filiale *"
                  hint="Ce champs est réquis"
                  item-text="nom_entite"
                  item-value="id_entite"
                  v-model="data.filiale_employe"
                ></v-select>
              </v-col>
              <v-col md="3" cols="12">
                <v-select
                  dense
                  :items="mes_categories"
                  label="Selectionnez la catégorie *"
                  hint="Ce champs est réquis"
                  item-text="nom_categorie"
                  item-value="id_categorie"
                  style="font-size: 15px"
                  v-model="data.categorie_employe"
                ></v-select>
              </v-col>
              <v-col md="3" cols="12">
                <v-select
                  dense
                  label="Selectionnez le service *"
                  hint="Ce champs est réquis"
                  :items="mes_services"
                  item-text="nom_service"
                  item-value="id_service"
                  style="font-size: 15px"
                  v-model="data.id_service"
                ></v-select>
              </v-col>
              <v-col md="3" cols="12">
                <v-select
                  dense
                  :items="mes_utilisateurs"
                  label="Selectionnez l'utilisateur *"
                  hint="Ce champs est réquis"
                  item-text="full_name_user"
                  item-value="id"
                  style="font-size: 15px"
                  v-model="data.id_user"
                ></v-select>
              </v-col>
              <v-col
                class="d-flex justify-left text-left p-0 m-0"
                md="12"
                cols="12"
              >
                <v-checkbox v-model="data.activer">
                  <template v-slot:label>
                    <div>Activer le compte</div>
                  </template>
                </v-checkbox>
              </v-col>
              <v-col
                class="d-flex justify-left text-left p-0 m-0"
                md="12"
                cols="12"
              >
                <v-checkbox v-model="data.lui_meme">
                  <template v-slot:label>
                    <v-tooltip top color="#F37121">
                      <template v-slot:activator="{ on }">
                        <div v-on="on">Lié a lui même</div>
                      </template>
                      L'employé sera le seul à contrôler l'interface utilisateur
                    </v-tooltip>
                  </template>
                </v-checkbox>
              </v-col>
            </v-row>
          </v-card>
          <v-dialog
            v-model="dialog"
            fullscreen
            hide-overlay
            transition="dialog-bottom-transition"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                style="text-transform: capitalize"
                @click="e6 = 1"
                v-bind="attrs"
                v-on="on"
              >
                Continuer
              </v-btn>
            </template>
            <v-card>
              <v-toolbar dark color="primary">
                <v-btn icon dark @click="dialog = false">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-title>Resumé</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                  <v-btn
                    dark
                    text
                    @click="CreateEmployee"
                    style="text-transform: capitalize"
                  >
                    Créer
                  </v-btn>
                </v-toolbar-items>
              </v-toolbar>
              <v-list three-line subheader>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Content filtering</v-list-item-title>
                    <v-list-item-subtitle
                      >Set the content filtering level to restrict apps that can
                      be downloaded</v-list-item-subtitle
                    >
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Password</v-list-item-title>
                    <v-list-item-subtitle
                      >Require password for purchase or use password to restrict
                      purchase</v-list-item-subtitle
                    >
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card>
          </v-dialog>
          <v-btn style="text-transform: capitalize" @click="e6 = 1" text>
            Retour
          </v-btn>
        </v-stepper-content>
      </v-stepper>
    </v-container>
    <v-container> </v-container>
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
</style>