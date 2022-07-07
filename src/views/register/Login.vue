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
    is_page_connexion: true,
    message_error: null,
    messsage_reset: null,
  }),
  methods: {
    async sendEmail() {
      const response = await axios.post("api-auth/password_reset/", {
        email: this.email,
      });
      console.log(response);
      this.dialog = false;
      this.email = null;
      this.messsage_reset = "Consulter votre boîte de réception"
    },

    async connexion() {
      try {
        if (this.login && this.password) {
          const response = await axios.post("api-token-auth/", {
            username: this.login,
            password: this.password,
          });

          this.$store.dispatch("user", response.data);

          if (response.data.token) {
            axios.defaults.headers.common[
              "Authorization"
            ] = `Bearer $(response.data.token)`;
            this.dialog1 = true;
            const user = this.$store.state.user["user_id"];

            const url5 = "mes-missionlist/traitement/" + user + "/";
            const url6 = "mes-missionlist/" + user + "/";
            const url7 = "userdetail/" + user + "/";

            const missions_valider = await axios.get(url5);
            const missions = await axios.get(url6);
            const permissions_user = await axios.get(url7);

            const employes = await axios.get("Employelist/");

            const regime = await axios.get("RegimeList/");
            const processus = await axios.get("processlist/");
            const entites = await axios.get("entitelist/");

            const villes = await axios.get("WorldcitiesList/");
            const zonelist = await axios.get("ZoneList/");

            this.$store.dispatch("villes", villes.data);
            this.$store.dispatch("zonelist", zonelist.data.results);
            this.$store.dispatch("entites", entites.data.results);
            this.$store.dispatch("processus", processus.data);
            this.$store.dispatch("procedure", regime.data.results);
            this.$store.dispatch("employees", employes.data);
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
      } catch (error) {
        console.log(error.response.data);
        this.message_error = error.response.data;
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

    <section class="section-container">
      <v-row class="signin">
        <v-col cols="8" class="left d-none d-sm-flex">
          <v-row>
            <v-col md="12" class="d-flex justify-center">
              <v-img
                max-height="250"
                max-width="250"
                src="@/assets/africa.png"
              ></v-img>
            </v-col>
            <v-col md="12" class="d-flex justify-center">
              <h1 style="font-size: 1.5rem !important">
                Page de connexion SAMIA
              </h1>
            </v-col>
            <v-col md="12" class="justify-center d-flex">
              <h1 style="">
                (Systeme de Gestion et Administration des Missions)
              </h1>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" md="4" class="right">
          <v-alert v-if="message_error" dense color="red" dismissible dark>
            {{ message_error }}
          </v-alert>
          <h2 v-if="is_page_connexion" style="font: size 1.5rem">CONNEXION</h2>
          <h2 v-if="!is_page_connexion" style="font: size 1.5rem">
            Reinitialisation du mot de passe
          </h2>
          <v-alert
            v-if="messsage_reset"
            dismissible
            dense
            border="left"
            type="warning"
          >
            {{ messsage_reset }}
          </v-alert>
          <v-text-field
            v-if="is_page_connexion"
            label="Login"
            required
            v-model="login"
            outlined
            dark
            filled
            dense
          ></v-text-field>
          <v-text-field
            v-if="!is_page_connexion"
            label="Adresse email"
            required
            v-model="email"
            outlined
            dark
            filled
            dense
          ></v-text-field>

          <v-text-field
            v-if="is_page_connexion"
            label="Mot de passe"
            v-model="password"
            :type="show3 ? 'text' : 'password'"
            @click:append="show3 = !show3"
            :append-icon="show3 ? 'mdi-eye' : 'mdi-eye-off'"
            outlined
            dense
            dark
            filled
          ></v-text-field>
          <div class="text-center">
            <v-btn
              v-if="!is_page_connexion"
              @click.prevent="sendEmail"
              class="signin-btn"
              type="submit"
              rounded
              color="white"
              dark
            >
              Reinitiliser
            </v-btn>
            <v-btn
              v-if="is_page_connexion"
              @click.prevent="connexion"
              class="signin-btn"
              type="submit"
              rounded
              color="white"
              dark
            >
              Connexion
            </v-btn>
            <v-btn
              v-if="!is_page_connexion"
              @click="is_page_connexion = !is_page_connexion"
              color="white"
              icon
            >
              <v-icon color="white">mdi-keyboard-backspace</v-icon>
            </v-btn>
          </div>
          <div class="text-center mt-5">
            <v-btn
              v-if="is_page_connexion"
              text
              class="signin-btn"
              type="submit"
              rounded
              color="white"
              dark
              @click="is_page_connexion = !is_page_connexion"
            >
              Mot de passe oublié ?
            </v-btn>
          </div>
          <div class="text-center" style="margin-top: 7.5rem">
            <v-btn
              v-if="is_page_connexion"
              class="signin-btn"
              type="submit"
              style="color: white !important"
              rounded
              color="red"
              dark
              href="http://localhost:8000/signin_office/"
            >
              <v-icon>mdi-microsoft-office</v-icon>
              Connexion Office 365
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </section>
  </div>
</template>

<style lang="scss" scoped>
/* @import url("https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400&display=swap"); */

/* @import url("https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;800&display=swap"); */
@import url("https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;700&display=swap");

.connexion {
  /* font-family: "Roboto", sans-serif; */
  /* font-family: "Open Sans", sans-serif; */
  font-family: "Baloo 2", cursive !important;

  font-weight: 500;
}

.centered-input input {
  text-align: center;
}

/* ./assets/styles.scss */

.section-container {
  padding: 20px;
  margin: 20px;
  background: #fff;
  width: 100%;
  // box-shadow: 0 0 1px 1px rgba($color: #000000, $alpha: 0.1);
  // box-sizing: border-box;
  .signin {
    padding: 0;
    max-width: 1000px;
    margin: 0 auto;
    min-height: 600px;
    box-shadow: 0 0 1px 1px rgba($color: #000000, $alpha: 0.1);
    .left {
      padding: 30px;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
      display: flex;
      color: #21209c;
      background-color: #edeae7;
    }
    .right {
      padding: 30px;
      box-sizing: border-box;
      background: #21209c;
      color: #fff;
      h2 {
        text-align: center;
        margin: 30px 0;
      }
      .signin-btn {
        width: 100%;
        color: #21209c;
      }
    }
  }
}
</style>
