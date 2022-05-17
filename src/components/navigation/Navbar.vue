<script>
import { mapGetters } from "vuex";
import axios from "axios";

export default {
  name: "Navbar",
  data: () => ({
    drawer: false,
    messages: 0,
    selectedItem: 0,
    items: [
      { text: "Missions", icon: "mdi-rocket-outline", to: "/" },
      { text: "Pôle", icon: "mdi-bank-outline", to: "/pole" },
      { text: "Filiale", icon: "mdi-bank-transfer-in", to: "/filiale" },
      { text: "Processus", icon: "mdi-cogs", to: "/processus" },
      // {separateur:true},
      { text: "Service", icon: "mdi-basket-outline", to: "/service" },
      {
        text: "Projets",
        icon: "mdi-application-brackets-outline",
        to: "/projet",
      },
      { text: "Employes", icon: "mdi-account-group-outline", to: "/employes" },
      { text: "Barème", icon: "mdi-clipboard-list-outline", to: "/bareme" },
      { text: "Régime", icon: "mdi-account-injury", to: "/regime" },
      { text: "Catégorie", icon: "mdi-folder-text-outline", to: "/categorie" },
      { text: "Zone", icon: "mdi-earth", to: "/zone" },
      { text: "Guide", icon: "mdi-help-circle-outline", to: "/guide" },
    ],
  }),
  methods: {
    async Reload() {
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

      this.$store.dispatch("entites", entites.data.results);
      this.$store.dispatch("processus", processus.data.results);
      this.$store.dispatch("procedure", regime.data.results);
      this.$store.dispatch("employees", employes.data.results);
      this.$store.dispatch("missions", missions.data);

      this.$store.dispatch("missions", missions.data);
      this.$store.dispatch("missions_val", missions_valider.data);
      this.$store.dispatch("permissions_user", permissions_user.data);
    },
    deconnexion() {
      this.$store.dispatch("user", null);
      this.$store.dispatch("showLogin", false);
      this.$store.dispatch("missions", null);
      this.$store.dispatch("mobileView", false);
      this.$store.dispatch("missions_val", null);
      this.$store.dispatch("edit_mission", true);
      this.$store.dispatch("mobileView", false);
      this.$store.dispatch("villes", null);
      this.$store.dispatch("employees", null);
      this.$store.dispatch("entites", null);
      this.$store.dispatch("processus", null);
      this.$store.dispatch("procedure", null);
      this.$store.dispatch("mamission", null);
      this.$store.dispatch("permissions_user", null);
      this.$store.dispatch("mymission", null);
      this.$store.dispatch("displayMymission", false);
      this.$store.dispatch("displayForm", true);
      this.$router.push("/login");
    },

    modevue() {
      if (this.$store.state.mobileView === false) {
        this.$store.dispatch("mobileView", true);
      } else {
        this.$store.dispatch("mobileView", false);
      }
      // console.log(this.$store.mobileView);
    },
  },
  computed: {
    ...mapGetters(["edit_mission", "user", "showLogin", "permissions_user"]),
  },
};
</script>

<template>
  <div class="navbar">
    <v-navigation-drawer
      style="cursor: default"
      v-model="drawer"
      app
      v-if="user"
      border
      temporary
    >
      <v-sheet color="grey lighten-4" class="pa-4">
        <v-avatar class="mb-4" size="64">
          <v-img
            :src="'http://192.168.0.37:8000' + permissions_user.url_photo"
          ></v-img>
        </v-avatar>

        <div style="font-size: 20px; font-weight: 800">
          Bienvenue {{ user.lastname }} {{ user.name }}
        </div>
      </v-sheet>

      <!-- <v-divider></v-divider> -->

      <v-list nav dense flat>
        <v-list-item-group v-model="selectedItem" color="#F37121">
          <v-list-item v-for="(item, i) in items" :key="i" :to="item.to">
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title
                v-text="item.text"
                style="font-weight: 600; font-size: 16px"
              ></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <!-- <div v-if="divier.seprateur">
            <v-divider></v-divider>
          </div> -->
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar dark flat dense app color="#21209C" v-if="user">
      <v-app-bar-nav-icon @click="drawer = !drawer"
        ><v-icon style="margin-bottom: 5px"
          >mdi-apps</v-icon
        ></v-app-bar-nav-icon
      >

      <v-toolbar-title
        style="
          cursor: default;
          font-size: 1.5rem;
          margin-top: 1px;
          font-weight: bold;
        "
        >SAMIA</v-toolbar-title
      >

      <v-spacer></v-spacer>
      <v-btn text @click="Reload">
        <v-icon>mdi-reload</v-icon>
      </v-btn>
      <v-badge :content="messages" :value="messages" color="#F37121" overlap>
        <v-btn text>
          <v-icon>mdi-bell-outline</v-icon>
        </v-btn>
      </v-badge>

      <v-btn text>
        <v-icon>mdi-lock-outline</v-icon>
      </v-btn>
      <!-- <v-btn text @click.prevent="deconnexion">
        <v-icon>mdi-logout-variant</v-icon>
      </v-btn> -->
      <div class="text-center">
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon dark v-bind="attrs" v-on="on">
              <v-avatar size="32">
                <img
                  :src="'http://192.168.0.37:8000' + permissions_user.url_photo"
                  alt="John"
                  
                />
              </v-avatar>

              <!-- <v-icon>mdi-account-circle-outline</v-icon> -->
            </v-btn>
          </template>
          <v-list dense style="font-weight: bold">
            <v-list-item class="menu-co" link @click.prevent="deconnexion">
              <v-list-item-icon>
                <v-icon> mdi-logout-variant </v-icon>
              </v-list-item-icon>
              <v-list-item-title>Deconnexion</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-app-bar>
  </div>
</template>

<style>
/* @import url("https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400&display=swap"); */
/* @import url("https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;800&display=swap"); */
/* @import url("https://fonts.googleapis.com/css2?family=League+Spartan:wght@100;300;500;600&display=swap"); */
/* @import url("https://fonts.googleapis.com/css2?family=League+Spartan:wght@100&display=swap"); */
@import url("https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;700&display=swap");

.navbar {
  font-family: "Baloo 2", cursive !important;
}
</style>
