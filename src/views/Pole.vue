<script>
// import MonPole from "@/components/Pole/MonPole.vue";
import axios from "axios";

export default {
  components: {
    // MonPole
  },

  data: () => ({
    items: null,
    new_pole: true,
    label_message: "Entrez le nom de la filiale",
    id_pole_selected: null,
    pole_name: null,
    created_pole: null,
    page: 1,

    scrollInvoked: 0,

    max_page: null,

    edit_name: null,
    statut_create: false,
    statut_modifier: false,
    statut_delete: false,

    new_pole_dialog: false,
    dialog_modifier: false,
  }),
  created() {
    this.DownloadPole();
  },

  methods: {
    onScroll() {
      this.scrollInvoked++;
    },
    DownloadPole() {
      //   const user = this.$store.state.user["user_id"];
      const jeton = this.$store.state.user["token"];
      axios
        .get("polelist/", {
          headers: { Authorization: "Bearer " + jeton },
        })
        .then((resp) => {
          console.log(resp.data.results);
          this.items = resp.data.results;
          this.max_page = Math.ceil(resp.data.count / 10);
        })
        .catch((err) => {
          alert(err);
        });
    },

    async PaginateIt() {
      const jeton = this.$store.state.user["token"];
      const url = "polelist/?page=" + this.page;
      const poles = await axios.get(url, {
        headers: { Authorization: "Bearer " + jeton },
      });
      this.items = poles.data.results;
      // this.nom_zone = null;
    },

    async EditPole(valeur) {
      alert(valeur);
      console.log(this.items);
      this.new_pole = false;

      this.id_pole_selected = valeur;

      for (let index = 0; index < this.items.length; index++) {
        const element = this.items[index].id_pole;

        if (element === valeur) {
          console.log(this.items[index].nom_pole);
          this.label_message =
            "Modifier le nom le nom du pôle " + this.items[index].nom_pole;

          this.pole_name = this.items[index].nom_pole;

          console.log(valeur);
        }
      }
    },

    Createpole() {
      this.label_message = "Entrez le nom du pôle";
      this.new_pole = true;
      const jeton = this.$store.state.user["token"];

      const data = { nom_pole: this.created_pole };
      axios
        .post("polelist/", data, {
          headers: { Authorization: "Bearer " + jeton },
        })
        .then((resp) => {
          console.log("clicked");
          console.log(resp);
        })
        .catch((err) => {
          console.log(err);
        });

      axios
        .get("polelist/", {
          headers: { Authorization: "Bearer " + jeton },
        })
        .then((resp) => {
          this.items = resp.data.results;
          this.created_pole = null;
        })
        .catch((err) => {
          console.log(err);
        });
      this.statut_create = true;
      setTimeout(() => {
        this.statut_create = false;
      }, 10000);
      this.new_pole_dialog = false;
      //   console.log(poles.data.results);
    },

    ploter(i) {
      alert(i);
    },

    async DeletePole(valeur) {
      console.log(valeur);
    },

    async ValideDelete(valeur) {
      console.log(valeur);
      const jeton = this.$store.state.user["token"];

      const resultat = await axios.delete(`poledetail/${valeur}/`);
      console.log(resultat);
      const url1 = "polelist/";
      const poles = await axios.get(url1, {
        headers: { Authorization: "Bearer " + jeton },
      });
      //   console.log(poles.data.results);
      this.items = poles.data.results;
      this.statut_delete = true;
      setTimeout(() => {
        this.statut_delete = false;
      }, 10000);
    },

    NewPole() {
      this.new_pole = true;
      this.label_message = "Entrez le nom de la filiale";
    },

    Modifierlepole(pole) {
      // const jeton = this.$store.state.user["token"];
      var valeur = this.items.filter((a) => a.id_pole == pole)[0];
      var idx = valeur.id_pole;
      axios
        .put(`poledetail/${idx}/`, {
          nom_pole: this.edit_name,
        })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });

      this.DownloadPole();
      this.edit_name = null;
    },
  },
};
</script>

<template>
  <div class="poles">
    <v-row class="utils">
      <v-col md="6" class="d-flex justify-start">
        <v-dialog
          v-model="new_pole_dialog"
          scrollable
          :overlay="true"
          max-width="500px"
          transition="dialog-transition"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-on="on" v-bind="attrs" color="#21209C" outlined
              >Nouveau pôle</v-btn
            >
          </template>
          <v-card>
            <v-toolbar color="#21209C" style="font-size: 1.2rem" dark>
              Nouveau pôle
            </v-toolbar>
            <v-card-text>
              <v-text-field
                v-model="created_pole"
                filled
                rounded
                style="font-weight: 300"
                class="mt-10"
                label="Entrez le nom du pôle"
              ></v-text-field>
            </v-card-text>
            <v-card-actions class="d-flex justify-end">
              <v-btn color="#21209C" @click="Createpole" outlined>Creer</v-btn>
              <v-btn text @click="new_pole_dialog = false">annuler</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
    <v-container fluid class="mx-2 my-5">
      <v-row>
        <v-col md="12">
          <v-card
            v-scroll.self="onScroll"
            class="overflow-y-auto"
            max-height="1000"
            elevation="0"
            style="border: 1px solid #dfe4ea"
          >
            <v-list subheader two-line>
              <v-list-item
                style="font-weight: 300; border-bottom: 1px solid #dfe4ea"
                v-for="(pole, i) in items"
                :key="i"
              >
                <v-list-item-content>
                  <v-list-item-title v-text="pole.nom_pole"></v-list-item-title>
                </v-list-item-content>

                <v-list-item-action class="d-inline">
                  <v-dialog
                    v-model="pole.dialog"
                    scrollable
                    persistent
                    :overlay="false"
                    max-width="500px"
                    transition="dialog-transition"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        v-on="on"
                        v-bind="attrs"
                        outlined
                        style="font-weight: 300"
                        color="#21209C"
                      >
                        Modifier
                      </v-btn>
                    </template>
                    <v-card>
                      <v-toolbar
                        style="font-size: 1.4rem; font-weight: 300"
                        color="#21209C"
                        dark
                      >
                        Modifier la filiale
                      </v-toolbar>
                      <v-card-text class="mt-10">
                        <v-text-field
                          label="Entrer un nouveau nom pour la filiale"
                          style="font-weight: 300"
                          filled
                          rounded
                          v-model="edit_name"
                        ></v-text-field>
                      </v-card-text>
                      <v-card-actions class="d-flex justify-end">
                        <v-btn
                          style="font-weight: 300"
                          outlined
                          color="#21209C"
                          @click="Modifierlepole(pole.id_pole)"
                          >Modifier</v-btn
                        >
                        <v-btn
                          style="font-weight: 300"
                          text
                          color="red"
                          @click="pole.dialog = false"
                          >Annuler</v-btn
                        >
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                  <v-btn
                    outlined
                    class="mx-2"
                    color="#F37121"
                    style="font-weight: 300"
                  >
                    Supprimer
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

