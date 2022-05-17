<script>
import axios from "axios";
// import MonPole from "@/components/Pole/MonPole.vue";
import Utils from "@/components/processus/Utils.vue";
import Process from "@/components/processus/Process.vue";
import Form from "@/components/processus/Form.vue";

export default {
  name: "Processus",
  data: () => ({
    mes_poles: null,
    mes_filiales: null,
    mes_group: null,
    mes_etapes: null,
    mes_process: null,
    display_formulaire: false,
    scrollInvoked: 0,

    type_procc: "NO",
    id_procc_created: null,
    nom_procc: null,
    related: null,
    mon_etape_id: null,
    cible_id: null,

    filialerule: [(v) => !!v || "Ce champs est réquis"],
    polerule: [(v) => !!v || "Ce champs est réquis"],

    valid: true,

    mon_procc: [],
    groupe: null,
    etape: null,
    statut_create: false,
    validateurs: [],

    page: 1,
    max_page: null,
  }),
  created() {
    this.DownloadPole();
  },
  methods: {
    onScroll() {
      this.scrollInvoked++;
    },
    async DownloadPole() {
      //   const user = this.$store.state.user["user_id"];
      const jeton = this.$store.state.user["token"];
      const url = "polelist/";
      const poles = await axios.get(url, {
        headers: { Authorization: "Bearer " + jeton },
      });
      //   console.log(poles.data.results);
      this.mes_poles = poles.data.results;
      //   console.log(this.mes_poles);

      const url1 = "entitelist/";
      const response = await axios.get(url1, {
        headers: { Authorization: "Bearer " + jeton },
      });
      //   console.log(response.data.results);
      this.mes_filiales = response.data.results;

      const url2 = "GroupList/";
      const group = await axios.get(url2, {
        headers: { Authorization: "Bearer " + jeton },
      });
      // console.log(group.data.results);
      this.mes_group = group.data.results;

      const url3 = "TypestepsList/";
      const etapes = await axios.get(url3, {
        headers: { Authorization: "Bearer " + jeton },
      });
      // console.log(etapes.data.results);
      this.mes_etapes = etapes.data.results;

      const url4 = "processlist/";
      const mes_proce = await axios.get(url4, {
        headers: { Authorization: "Bearer " + jeton },
      });
      // console.log(etapes.data.results);
      this.mes_process = mes_proce.data;
      console.log("Mes processus", this.mes_process);
    },

    async CreationProcess(
      nom_procc,
      related,
      type_procc,
      mon_procc,
      blocante_step
    ) {
      console.log(nom_procc, related, type_procc, mon_procc);
      const jeton = this.$store.state.user["token"];
      console.log("posté");
      const data = {
        nom_processus: nom_procc,
        id_relatated: related,
        type_process: type_procc,
      };
      console.log("Data envoyée", data);
      const response = await axios.post("processlist/", data, {
        headers: { Authorization: "Bearer " + jeton },
      });
      this.id_procc_created = response.data.id_process;
      console.log("END ****** posté");

      console.log(this.id_procc_created);

      let i = 1;

      for (const element of mon_procc) {
        let new_el = {};
        new_el["order_steps"] = i;
        new_el["id_process"] = this.id_procc_created;
        new_el["type_steps"] = element["type_steps_id"];
        new_el["cible"] = element["cible"];
        console.log(new_el);
        i = i + 1;
        if (element["type_steps_id"] != null || element["cible"] != null) {
          const res = await axios.post("Stepprocess/", new_el, {
            headers: { Authorization: "Bearer " + jeton },
          });
          console.log(res);
        }
      }
      const validateurs = await axios.get(
        "http://192.168.0.37:8000/Processus_step/" +
          this.id_procc_created +
          "/",
        {
          headers: { Authorization: "Bearer " + jeton },
        }
      );
      this.validateurs = validateurs.data;
      console.log("Validateur", validateurs);
      const etape_bloquante = {
        step_debut: blocante_step,
        step_fin: 39,
        id_process_id: this.id_procc_created,
      };
      const bloc = await axios.post("Config_blocageList/", etape_bloquante, {
        headers: { Authorization: "Bearer " + jeton },
      });
      console.log(bloc);

      this.dialog = false;
      this.DownloadPole();
    },

    ValideDelete(valeur) {
      axios
        .delete(`processDetail/${valeur}/`)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
      this.DownloadPole();
    },

    async RapportConfig(acteur, expression, validateur) {
      const jeton = this.$store.state.user["token"];
      console.log(expression);
      const data = {
        acteur: acteur,
        expression: expression == true ? "ET" : "OU",
        id_process_id: this.id_procc_created,
        Validateur: validateur,
      };
      console.log(data);
      const response = await axios.post("Config_rapportList/", data, {
        headers: { Authorization: "Bearer " + jeton },
      });
      console.log(response);
      this.DownloadPole();
    },
  },
  components: {
    // MonPole,
    Utils,
    Process,
    Form,
  },
};
</script>

<template>
  <div id="processus">
    <Utils />
    <v-container fluid>
      <v-row>
        <v-col md="4">
          <v-card
            style="border: 1px solid #dfe4ea; border-radius: 5px"
            elevation="0"
            v-scroll.self="onScroll"
            class="overflow-y-auto"
            max-height="700"
          >
            <Process
              :mes_process="mes_process"
              @event-supprimer="ValideDelete"
            />
          </v-card>
        </v-col>
        <v-col md="8">
          <Form
            :validateurs="validateurs"
            @emit-CreateProcess="CreationProcess"
            @emit-rapport="RapportConfig"
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>
</style>