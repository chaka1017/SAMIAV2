import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate';


Vue.use(Vuex)




export default new Vuex.Store({
    state: {
        edit_mission: true,
        user: null,
        showLogin: false,
        missions: null,
        missions_val: null,
        mobileView: false,
        displayForm: true,
        displayMymission: false,
        villes: null,
        employees: null,
        entites: null,
        processus: null,
        procedure: null,
        mamission: null,
        permissions_user: null,
        mymission: null,
        zonelist:null,

    },
    plugins: [createPersistedState()],

    getters: {
        edit_mission: (state) => {
            return state.edit_mission
        },
        zonelist: (state) => {
            return state.zonelist
        },
        displayMymission: (state) => {
            return state.displayMymission
        },
        user: (state) => {
            return state.user
        },
        missions: (state) => {
            return state.missions
        },
        missions_val: (state) => {
            return state.missions_val
        },
        showLogin: (state) => {
            return state.showLogin
        },
        mobileView: (state) => {
            return state.mobileView
        },
        displayUtils: (state) => {
            return state.displayUtils
        },
        displayForm: (state) => {
            return state.displayForm
        },
        villes: (state) => {
            return state.villes
        },
        employees: (state) => {
            return state.employees
        },
        entites: (state) => {
            return state.entites
        },
        processus: (state) => {
            return state.processus
        },
        procedure: (state) => {
            return state.procedure
        },
        mamission: (state) => {
            return state.mamission
        },
        permissions_user: (state) => {
            return state.permissions_user
        },
        mymission: (state) => {
            return state.mymission
        },


    },
    mutations: {
        edit_mission(state, edit_mission) {
            state.edit_mission = edit_mission;
        },
        zonelist(state, zonelist) {
            state.zonelist = zonelist;
        },
        displayMymission(state, displayMymission) {
            state.displayMymission = displayMymission;
        },
        user(state, user) {
            state.user = user
        },
        missions(state, missions) {
            state.missions = missions
        },
        missions_val(state, missions_val) {
            state.missions_val = missions_val
        },
        showLogin(state, showLogin) {
            state.showLogin = showLogin;
        },
        mobileView(state, mobileView) {
            state.mobileView = mobileView;
        },
        displayUtils(state, displayUtils) {
            state.displayUtils = displayUtils;
        },
        displayForm(state, displayForm) {
            state.displayForm = displayForm;
        },
        villes(state, villes) {
            state.villes = villes;
        },
        employees(state, employees) {
            state.employees = employees;
        },
        entites(state, entites) {
            state.entites = entites;
        },
        processus(state, processus) {
            state.processus = processus;
        },
        procedure(state, procedure) {
            state.procedure = procedure;
        },
        mamission(state, mamission) {
            state.mamission = mamission;
        },
        permissions_user(state, permissions_user) {
            state.permissions_user = permissions_user;
        },
        mymission(state, mymission) {
            state.mymission = mymission;
        },



    },
    actions: {
        zonelist(context, zonelist) {
            context.commit('zonelist', zonelist)
        },
        edit_mission(context, edit_mission) {
            context.commit('edit_mission', edit_mission)
        },
        displayMymission(context, displayMymission) {
            context.commit('displayMymission', displayMymission)
        },
        user(context, user) {
            context.commit("user", user)
        },
        missions(context, missions) {
            context.commit("missions", missions)
        },
        missions_val(context, missions_val) {
            context.commit("missions_val", missions_val)
        },
        showLogin(context, showLogin) {
            context.commit("showLogin", showLogin)
        },
        mobileView(context, mobileView) {
            context.commit("mobileView", mobileView)
        },
        displayUtils(context, displayUtils) {
            context.commit("displayUtils", displayUtils)
        },
        displayForm(context, displayForm) {
            context.commit("displayForm", displayForm)
        },
        villes(context, villes) {
            context.commit("villes", villes)
        },
        employees(context, employees) {
            context.commit("employees", employees)
        },
        entites(context, entites) {
            context.commit("entites", entites)
        },
        processus(context, processus) {
            context.commit("processus", processus)
        },
        procedure(context, procedure) {
            context.commit("procedure", procedure)
        },
        mamission(context, mamission) {
            context.commit("mamission", mamission)
        },
        permissions_user(context, permissions_user) {
            context.commit("permissions_user", permissions_user)
        },
        mymission(context, mymission) {
            context.commit("mymission", mymission)
        },

    },
    modules: {}
})