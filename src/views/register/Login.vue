<script>
import axios from "axios";
export default {
  name: "Login",
  data: () => ({
    dialog: false,
    login: null,
    password: null,
    email: null,
    regle: [(v) => (v && v.length >= 0) || "Ce champs est réquis"],
    message: null,
    showerMessage: false,
    dialog1: false,
    zIndex: 5,
    overlay: true,
    show3: false,

    // valid: true,
  }),
  methods: {
    async sendEmail() {
      const response = await axios.post("api-auth/password_reset/", {
        email: this.email,
      });
      console.log(response);
      this.dialog = false;
    },

    async connexion() {
      if (this.login && this.password) {
        const response = await axios.post("api-token-auth/", {
          username: this.login,
          password: this.password,
        });

        this.$store.dispatch("user", response.data);

        if (response.data.token) {
          this.dialog1 = true;
          const jeton = this.$store.state.user["token"];
          const user = this.$store.state.user["user_id"];

          const url5 = "mes-missionlist/traitement/" + user + "/";
          const url6 = "mes-missionlist/" + user + "/";
          const url7 = "userdetail/" + user + "/";

          const missions_valider = await axios.get(url5, {
            headers: { Authorization: "Bearer " + jeton },
          });
          const missions = await axios.get(url6, {
            headers: { Authorization: "Bearer " + jeton },
          });
          const permissions_user = await axios.get(url7, {
            headers: { Authorization: "Bearer " + jeton },
          });

          const employes = await axios.get("Employelist/", {
            headers: { Authorization: "Bearer " + jeton },
          });

          const regime = await axios.get("RegimeList/", {
            headers: { Authorization: "Bearer " + jeton },
          });
          const processus = await axios.get("processlist/", {
            headers: { Authorization: "Bearer " + jeton },
          });
          const entites = await axios.get("entitelist/", {
            headers: { Authorization: "Bearer " + jeton },
          });

          const villes = await axios.get("WorldcitiesList/", {
            headers: { Authorization: "Bearer " + jeton },
          });
          const zonelist = await axios.get("ZoneList/", {
            headers: { Authorization: "Bearer " + jeton },
          });

          this.$store.dispatch("villes", villes.data);
          this.$store.dispatch("zonelist", zonelist.data.results);
          this.$store.dispatch("entites", entites.data.results);
          this.$store.dispatch("processus", processus.data);
          this.$store.dispatch("procedure", regime.data.results);
          this.$store.dispatch("employees", employes.data.results);
          this.$store.dispatch("missions", missions.data);

          this.$store.dispatch("missions", missions.data);
          this.$store.dispatch("missions_val", missions_valider.data);
          this.$store.dispatch("permissions_user", permissions_user.data);

          this.$store.dispatch("showLogin", true);
          this.$router.push("/");
        } else {
          this.message = "Login ou mot de passe incorrecte";
          this.showerMessage = true;
          setTimeout(() => {
            this.showerMessage = false;
          }, 4000);
        }
      } else {
        this.showerMessage = true;

        setTimeout(() => {
          this.showerMessage = false;
          this.message = null;
        }, 4000);
        this.message = "Mot de passe et nom d'utilisateur requis";
      }
      this.dialog1 = false;
    },
  },
  beforeCreate() {
    if (this.$store.state.user !== null) {
      this.$router.push("/");
    }
  },
};
</script>

<template>
  <div class="connexion">
    <v-layout align-center justify-space-around wrap>
      <v-dialog v-model="dialog1" hide-overlay persistent width="300">
        <v-overlay :z-index="zIndex" :value="overlay">
          <v-card color="#21209C" dark>
            <v-card-text style="font-weight: bold">
              Connexion en cours
              <v-progress-linear
                indeterminate
                color="white"
                class="mb-0"
              ></v-progress-linear>
            </v-card-text>
          </v-card>
        </v-overlay>
      </v-dialog>
    </v-layout>
    <div
      class="active d-flex justify-center pt-15"
      style="color: #f37121; font-weight: bold; font-size: 45px"
    >
      SAMIA
    </div>
    <v-container class="d-flex justify-center">
      <v-card>
      
        <v-card-text>
          <v-row>
            <v-col md="12" sm="12" cols="12">
              <v-text-field
                dense
                placeholder="Login"
                v-model="login"
                class="d-flex justify-center centered-input"
                required
              ></v-text-field>
            </v-col>
            <v-col md="12" sm="12" cols="12">
              <v-text-field
                dense
                required
                placeholder="Mot de passe"
                class="centered-input"
                v-model="password"
                :type="show3 ? 'text' : 'password'"
                @click:append="show3 = !show3"
                :append-icon="show3 ? 'mdi-eye' : 'mdi-eye-off'"
              ></v-text-field>
            </v-col>
            <v-col class="d-flex justify-center" md="12" sm="12" cols="12">
              <v-btn
                @click.prevent="connexion"
                class="mx-2"
                dense
                color="#21209C"
                dark
                >Connexion</v-btn
              >
              <v-btn @click.prevent="connexion" dense color="#c0392b" dark>
                <v-icon>mdi-microsoft-office</v-icon>
                office 365
              </v-btn>
            </v-col>
            <v-divider></v-divider>
            <v-dialog v-model="dialog" width="500">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  text
                  color="red lighten"
                  class="my-5"
                  dark
                  v-bind="attrs"
                  style="font-weight: 600; font-size: 12px"
                  v-on="on"
                >
                  Mot de passe oublié ?
                </v-btn>
              </template>
              <v-container>
                <v-card>
                  <v-card-text class="m-10">
                    <v-row class="m-10">
                      <v-col md="12" sm="12" cols="12">
                        <v-text-field
                          flat
                          dense
                          type="email"
                          label="Adresse email"
                          v-model="email"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-card-text>

                  <v-divider></v-divider>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" text @click.prevent="sendEmail">
                      Envoyer
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-container>
            </v-dialog>
          </v-row>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<style>
/* @import url("https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400&display=swap"); */

/* @import url("https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;800&display=swap"); */
@import url("https://fonts.googleapis.com/css2?family=League+Spartan:wght@100;300;500;600&display=swap");

.connexion {
  /* font-family: "Roboto", sans-serif; */
  /* font-family: "Open Sans", sans-serif; */
  font-family: "League Spartan", sans-serif;

  font-weight: 500;
}

.centered-input input {
  text-align: center;
}
</style>
