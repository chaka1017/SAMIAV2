<script>
import axios from "axios";
import Mission from "@/components/missions/Mission";

import { mapGetters } from "vuex";

export default {
  name: "Missions",
  data: () => ({
    activ1: "",
    activ2: "",
    show_mission: true,
    show_mission_val: false,
    ploted_mission: null,
    search_mission: null,
    search_mission_traiter: null,
    missionss: [],
    missions_vals: [],
  }),
  components: {
    Mission,
  },
  created() {
    this.Initialize();
    this.active1();
  },

  computed: {
    searching() {
      if (!this.search_mission) return this.missionss;

      const search_mission = this.search_mission.toLowerCase();

      return this.missionss.filter((item) => {
        const text = item.objet_mission.toLowerCase();

        return text.indexOf(search_mission) > -1;
      });
    },
    searching_val() {
      if (!this.search_mission_traiter) return this.missions_vals;

      const search_mission_traiter = this.search_mission_traiter.toLowerCase();

      return this.missions_vals.filter((item) => {
        const text = item.objet_mission.toLowerCase();

        return text.indexOf(search_mission_traiter) > -1;
      });
    },
    ...mapGetters([
      "edit_mission",

      "user",
      "showLogin",
      "missions",
      "missions_val",
      "permissions_user",
      "employees",
    ]),
  },
  methods: {
    Initialize() {
      const jeton = this.$store.state.user["token"];
      const user = this.$store.state.user["user_id"];

      axios
        .get("mes-missionlist/" + user + "/", {
          headers: { Authorization: "Bearer " + jeton },
        })
        .then((resp) => {
          this.$store.dispatch("missions", resp.data);
          this.missionss = resp.data;
        })
        .catch((err) => {
          alert(err);
        });
      axios
        .get("mes-missionlist/traitement/" + user + "/", {
          headers: { Authorization: "Bearer " + jeton },
        })
        .then((resp) => {
          this.$store.dispatch("missions_val", resp.data);
          this.missions_vals = resp.data;
        })
        .catch((err) => {
          alert(err);
        });
    },

    active1() {
      this.activ1 = "focus";
      this.activ2 = "";
      this.show_mission = true;
      this.show_mission_val = false;
    },
    active2() {
      this.activ2 = "focus";
      this.activ1 = "";
      this.show_mission = false;
      this.show_mission_val = true;
    },
    async ShowMyMission(id) {
      // alert(id)
      this.$store.dispatch("displayForm", "aucun");
      const jeton = this.$store.state.user["token"];
      const url = "http://192.168.0.37:8000/mes-missiondetail/" + id + "/";
      const mamission = await axios.get(url, {
        headers: { Authorization: "Bearer " + jeton },
      });
      console.log(mamission.data);
      this.$store.dispatch("mamission", mamission.data);
      this.$store.dispatch("displayForm", false);
      this.$store.dispatch("displayMymission", false);
    },
    async MyMissionDetail(id) {
      // alert(id);
      const missions = this.$store.state.missions;
      console.log(missions);
      for (let mission of missions) {
        if (mission.id_mission == id) {
          console.log(mission);
          // this.$store.dispatch("displayMymission", false);

          this.$store.dispatch("mymission", mission);
        }
      }

      this.$store.dispatch("displayForm", "aucun");

      this.$store.dispatch("displayMymission", true);
    },
  },
};
</script>

<template>
  <div id="missions">
    <v-tabs vertical color="black" background-color="#ecf0f1">
      <v-tab style="text-transform: uppercase">
        <span class="d-none d-sm-flex"> Mes missions </span>
        <v-chip
          small
          style="boder-radius: 50%"
          dark
          class="ma-2"
          color="#21209C"
        >
          {{ missions.length }}
        </v-chip>
      </v-tab>
      <v-tab style="text-transform: uppercase">
        <span class="d-none d-sm-flex"> Missions à traiter </span>
        <v-chip small dark class="ma-2" rounded color="#f37121">
          {{ missions_val.length }}
        </v-chip>
      </v-tab>

      <v-tab-item style="background: #f1f2f6 !important">
        <v-card
          flat
          elevation="0"
          class="overflow-y-auto"
          style="
            border: 1px #dfe4ea solid !important;
            border-top: 4px #21209c solid;
          "
          height="700"
        >
          <v-card-title primary-title>
            <v-text-field
              v-model="search_mission"
              style="margin: 0px; padding: 0px"
              append-icon="mdi-magnify"
              label="Rechercher une mission"
              single-line
            ></v-text-field>
          </v-card-title>
          <v-card-text style="margin: 0px; padding: 0px; border-radius: 0px">
            <v-list-item-group color="black">
              <Mission
                v-for="(mission, i) in missions"
                :num_mission="mission.numero_mission"
                :destination="mission.destination"
                :objet_mission="mission.objet_mission"
                :statut_justifie="mission.statut_mission"
                :id_mission="mission.id_mission"
                :chef_mission="mission.full_name_chef_delegation"
                :key="i"
                @show-mission="MyMissionDetail"
              />
            </v-list-item-group>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card
          flat
          elevation="0"
          class="overflow-y-auto"
          style="
            border-radius: 0px;
            border: 1px #dfe4ea solid !important;
            border-top: 4px #f37121 solid;
          "
          height="700"
        >
          <v-card-text>
            <v-text-field
              v-model="search_mission_traiter"
              style="margin: 0px; padding: 0px"
              append-icon="mdi-magnify"
              label="Rechercher une mission"
              single-line
            ></v-text-field>
          </v-card-text>
          <v-card-text style="margin: 0px; padding: 0px">
            <v-list-item-group color="black">
              <Mission
                @show-mission="ShowMyMission"
                v-for="(mission, i) in missions_val"
                :num_mission="mission.numero_mission"
                :destination="mission.destination"
                :objet_mission="mission.objet_mission"
                :statut_justifie="mission.statut_mission"
                :id_mission="mission.id_mission"
                :chef_mission="mission.full_name_chef_delegation"
                :key="i"
              />
            </v-list-item-group>
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<style>
/* @import url("https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;800&display=swap"); */
/* @import url('https://fonts.googleapis.com/css2?family=League+Spartan:wght@100;300&display=swap'); */
/* @import url("https://fonts.googleapis.com/css2?family=League+Spartan:wght@100&display=swap"); */
@import url("https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;700&display=swap");

.missions {
  /* font-family: "League Spartan", sans-serif; */
  font-family: "Baloo 2", cursive !important;
}

.focus {
  background: #21209c;
  color: white !important;
}
</style>
