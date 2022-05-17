<script>
import Utils from "@/components/navigation/Utils";
// import UtilsMobile from "@/components/navigation/UtilsMobile";
import Missions from "@/components/missions/Missions";
import FormMission from "@/components/missions/FormMission";
import FormMissionShow from "@/components/missions/FormMissionShow";
import MyMission from "@/components/missions/MyMission";
import { mapGetters } from "vuex";
export default {
  name: "Home",
  data: () => ({
    value: 1,
    // isMobile: null,
    dialog: false,
  }),

  components: {
    Utils,
    Missions,
    FormMission,
    FormMissionShow,
    MyMission,
    // UtilsMobile,
  },
  created() {},

  beforeCreate() {
    if (this.$store.state.user === null) {
      this.$router.push("/login");
    }
  },
  computed: {
    ...mapGetters([
      "mobileView",
      "displayForm",
      "missions_val",
      "mamission",
      "mymission",
      "displayMymission",
    ]),
  },
};
</script>

<template>
  <div id="home">
    <Utils />
    <v-container fluid>
      <v-row dense>
        <v-col md="4" cols="12" class="pl-4 pr-4">
          <Missions />
        </v-col>
        <v-col
          class="former d-none d-sm-flex"
          cols="12"
          md="8"
          v-if="displayForm == true"
        >
          <FormMission />
        </v-col>
        <v-col
          class="former d-none d-sm-flex"
          md="8"
          cols="12"
          v-else-if="displayForm == false"
        >
          <FormMissionShow />
        </v-col>
        <v-col
          class="former d-none d-sm-flex"
          md="8"
          cols="12"
          v-if="displayMymission == true"
        >
          <MyMission />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=League+Spartan:wght@100&display=swap");

.utils {
  font-family: "Open Sans", sans-serif;
  background: white;
  padding: 10px;
}
</style>
