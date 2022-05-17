<script>
// import { required, digits, email, max, regex } from "vee-validate/dist/rules";
export default {
  name: "FormulaireUtilisateur",
  data: () => ({
    valid: false,
    nameRules: [
      (v) => !!v || "Name is required",
      (v) => v.length <= 10 || "Name must be less than 10 characters",
    ],
    email: "",
    emailRules: [
      (v) => !!v || "E-mail est requis",
      (v) => /.+@.+/.test(v) || "l'e-mail doit être valide",
    ],
    birthdateRules: [(v) => !!v || "Une date de naissance est requise"],
    FonctionRules: [(v) => !!v || "La fonction de l'employé est requise"],
    LoginRules: [(v) => !!v || "Un login est requis"],
    PassordRules: [(v) => !!v || "Mot de passe requis"],
    NomRules: [(v) => !!v || "Nom de l'employé requis"],
    PrenomsRules: [(v) => !!v || "Prénoms de l'employé requis"],
    MatriculeRules: [(v) => !!v || "Prénoms de l'employé requis"],
    TelRules: [(v) => !!v || "Téléphone de l'employé requis"],
    CategorieRules: [(v) => !!v || "Catégorie de l'employé requis"],
    CreateurRules: [(v) => !!v || "Créateur de l'employé requis"],
    switch1: true,
  }),
};
</script>

<template>
  <v-container id="formulaireutilisateur">
    <h1 class="d-flex justify-center">
      <span
        style="
          font-weight: 400;
          color: white;
          background: #f37121;
          padding: 10px;
          border-radius: 10px;
          font-size: 20px;
          cursor: default;
        "
        class="px-5"
        elevation="5"
      >
        Création Employé
      </span>
    </h1>
    <v-form
      v-model="valid"
      style="
        background: white;
        padding: 25px;
        border-radius: 10px;
        margin: 45px;
      "
      class="formulaire"
      elevation="5"
    >
      <v-row>
        <v-col md="4">
          <v-text-field
            v-model="nom_employe"
            :rules="NomRules"
            placeholder="Nom de l'employé"
            required
          ></v-text-field>
        </v-col>
        <v-col md="4">
          <v-text-field
            v-model="prenoms_employe"
            :rules="PrenomsRules"
            placeholder="Prénoms de l'employé"
            required
          ></v-text-field>
        </v-col>
        <v-col md="4">
          <v-text-field
            v-model="matricule_employe"
            :rules="MatriculeRules"
            placeholder="Matricule de l'employé"
            required
          ></v-text-field>
        </v-col>
        <v-col md="4">
          <v-text-field
            v-model="tel_employe"
            :rules="TelRules"
            placeholder="Telephone de l'employé"
            required
          ></v-text-field>
        </v-col>

        <v-col md="4">
          <v-text-field
            type="date"
            style="margin-top: 19px"
            dense
            placeholder="Date de naissance"
            :rules="birthdateRules"
            required
          ></v-text-field>
        </v-col>
        <v-col md="4">
          <v-text-field
            v-model="email"
            :rules="emailRules"
            placeholder="E-mail"
            required
          ></v-text-field>
        </v-col>
        <v-col md="6">
          <v-text-field
            v-model="fonction_employe"
            :rules="FonctionRules"
            placeholder="Fonction de l'employé"
            required
          ></v-text-field>
        </v-col>
        <v-col md="6">
          <v-text-field
            v-model="login_employe"
            :rules="LoginRules"
            placeholder="Nom d'utilisateur"
            required
          ></v-text-field>
        </v-col>
        <v-col md="4">
          <v-text-field
            v-model="password_employe"
            :rules="PassordRules"
            placeholder="Mot de passe"
            required
          ></v-text-field>
        </v-col>
        <v-col md="4">
          <v-autocomplete
            placeholder="Id Créateur"
            required
            :rules="CreateurRules"
          ></v-autocomplete>
        </v-col>
        <v-col md="4">
          <v-autocomplete
            required
            :rules="CategorieRules"
            placeholder="Id catégorie"
          ></v-autocomplete>
        </v-col>
        <v-col md="12">
          <v-switch v-model="switch1" label="Activer"></v-switch>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<style scoped>
.formulaire {
  box-shadow: rgba(236, 240, 241,1.0) 0px 8px 24px;
  border-left: 5px solid rgba(230, 126, 34,1.0);
}
</style>