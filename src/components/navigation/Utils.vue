<script>
import { mapGetters } from "vuex";
import FormMission from "@/components/missions/FormMission";
export default {
  name: "Utils",
  data: () => ({
    dialog: false,
  }),
  components: {
    FormMission,
  },
  computed: {
    ...mapGetters([
      "displayUtils",
      "displayForm",
      "permissions_user",
      "displayMymission",
    ]),
  },
  methods: {
    DetailsProcess() {},
    displaymyMissionForm() {
      if (this.$store.state.displayForm === true) {
        this.$store.dispatch("displayForm", "aucun");
        this.$store.dispatch("displayMymission", false);
      } else {
        this.$store.dispatch("displayForm", true);
        this.$store.dispatch("displayMymission", false);
      }
    },
  },
};
</script>

<template>
  <div class="utils">
    <v-row>
      <v-col md="6" class="justify-start d-none d-sm-flex">
        <v-btn color="#21209C" dark @click.prevent="displaymyMissionForm">
          Nouvelle mission
        </v-btn>
      </v-col>
      <v-col md="6" class="d-flex d-sm-none">
        <v-dialog
          v-model="dialog"
          fullscreen
          transition="dialog-transition"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-on="on"
              v-bind="attrs"
              color="#21209C"
              dark
              @click.prevent="displaymyMissionForm"
            >
              Nouvelle mission
            </v-btn>
          </template>
          <v-card>
            <v-toolbar color="#21209C" dark>
              <v-btn icon dark @click="dialog = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
              <v-toolbar-title>Nouvelle mission</v-toolbar-title>
            </v-toolbar>
            <FormMission />
          </v-card>
        </v-dialog>
      </v-col>
      <v-col md="6" class="d-flex justify-end">
        <v-btn color="#21209C" dark icon @click="DetailsProcess" disabled>
          <v-icon>mdi-eye-outline</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<style>
/* @import url("https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;800&display=swap"); */
/* @import url("https://fonts.googleapis.com/css2?family=League+Spartan:wght@100&display=swap"); */
@import url("https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;700&display=swap");

.utils {
  /* font-family: "Open Sans", sans-serif; */
  /* font-family: "League Spartan", sans-serif; */
  font-family: "Baloo 2", cursive !important;

  background: white;
  padding: 10px;
  border: 1px solid #dfe4ea;
  border-radius: 5px;
  margin-left: 20px;
  margin-right: 10px;
  margin-top: 10px;
}
</style>
