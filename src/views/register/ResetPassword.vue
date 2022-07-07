<script>
import axios from "axios";
export default {
  name: "ResetPassword",
  data: () => ({
    password_new: null,
    password: null,
    currentUrl: null,
    show3: false,
    message_error: null,
    token: null,
  }),
  created() {
    this.currentUrl = window.location.href;
    this.token = this.currentUrl.split("?")[1].split("=")[1];
  },
  methods: {
    async ResetPassword() {
      const form = new FormData();
      form.append("password", this.password);
      form.append("token", this.token);
      if (this.password == this.password_new) {
        try {
          const response = await axios.post(
            "api-auth/password_reset/confirm/",
            form
          );
          this.$router.push("/login");
          console.log(response);
        } catch (error) {
          console.log(error);
        }
      }else{
        this.message_error = "Les mots de passe ne sont pas identiques." 
      }
    },
  },
};
</script>
<template>
  <div class="reset">
    <v-container>
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
                  Reinitialisation du mot de passe
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
            <v-alert v-if="message_error" dense outlined type="error">
              {{ message_error }}
            </v-alert>

            <h2 style="font: size 1.5rem">Reinitialisation du mot de passe</h2>

            <v-text-field
              label="Nouveau mot de passe"
              v-model="password"
              :type="show3 ? 'text' : 'password'"
              @click:append="show3 = !show3"
              :append-icon="show3 ? 'mdi-eye' : 'mdi-eye-off'"
              outlined
              dark
              filled
              dense
            ></v-text-field>

            <v-text-field
              label="Confirmer le nouveau mot de passe"
              v-model="password_new"
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
                class="signin-btn"
                type="submit"
                rounded
                color="white"
                dark
                @click="ResetPassword"
              >
                Reinitiliser
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </section>
    </v-container>
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
