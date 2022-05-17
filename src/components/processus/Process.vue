<script>
export default {
  name: "Process",
  data: () => ({
    
  }),
  props: {
    mes_process: [],
  },
  methods: {
    Supprimer(id_process) {
      this.$emit("event-supprimer", id_process);
    },
  },
};
</script>

<template>
  <div class="process" style="border-top: 4px #21209c solid">
    <v-list subheader two-line>
      <v-list-item
        style="font-weight: 300; border-bottom: 1px solid #dfe4ea"
        v-for="(procc, i) in mes_process"
        :key="i"
      >
        <v-list-item-content>
          <v-list-item-title v-text="procc.nom_processus"></v-list-item-title>

          <v-list-item-subtitle
            v-if="procc.type_process == 'NO'"
            v-text="'Type de processus : Normal'"
          ></v-list-item-subtitle>
          <v-list-item-subtitle
            v-else-if="procc.type_process == 'PO'"
            v-text="'Type de processus : Pôle'"
          ></v-list-item-subtitle>
          <v-list-item-subtitle
            v-else-if="procc.type_process == 'PR'"
            v-text="'Type de processus : Projet'"
          ></v-list-item-subtitle>
        </v-list-item-content>

        <v-list-item-action class="d-inline">
          <v-btn outlined style="font-weight: 300" color="#21209C">
            Modifier
          </v-btn>
          <v-dialog
            v-model="procc.dialog"
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
                class="mx-2"
                color="#F37121"
                style="font-weight: 300"
              >
                Supprimer
              </v-btn>
            </template>
            <v-card>
              <v-toolbar
                style="font-size: 1.4rem; font-weight: 300"
                color="#21209C"
                dark
              >
                Supprimer un processus
              </v-toolbar>
              <v-card-text
                style="font-weight: 300; color: black; font-size: 1.2rem"
                class="my-10"
              >
                Voulez vous vraiement supprimer la processus ?
              </v-card-text>
              <v-card-actions class="d-flex justify-end">
                <v-btn
                  style="font-weight: 300"
                  outlined
                  color="#21209C"
                  @click="Supprimer(procc.id_process)"
                  >Supprimer</v-btn
                >
                <v-btn
                  style="font-weight: 300"
                  text
                  color="red"
                  @click="procc.dialog = false"
                  >Annuler</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-list-item-action>
      </v-list-item>
    </v-list>
  </div>
</template>