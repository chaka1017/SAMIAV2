import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import NotFound from "../views/ErrorPages/NotFound.vue";

Vue.use(VueRouter);

const routes = [{
        path: "/",
        name: "Home",
        component: Home,
    },
    {
        path: "/about",
        name: "About",

        component: () =>
            import ("../views/About.vue"),
    },
    {
        path: "/login",
        name: "Login",

        component: () =>
            import ("../views/register/Login.vue"),
    },
    {
        path: "/employes",
        name: "Signin",

        component: () =>
            import ("../views/register/Signin.vue"),
    },
    {
        path: "/zone",
        name: "Zone",

        component: () =>
            import ("../views/Zone.vue"),
    },
    {
        path: "/pole",
        name: "Pole",

        component: () =>
            import ("../views/Pole.vue"),
    },
    {
        path: "/filiale",
        name: "Filiale",

        component: () =>
            import ("../views/Filiale.vue"),
    },
    {
        path: "/projet",
        name: "Projets",

        component: () =>
            import ("../views/Projets.vue"),
    },
    {
        path: "/processus",
        name: "processus",

        component: () =>
            import ("../views/Processus.vue"),
    },
    {
        path: "/restore_password",
        name: "ResetPassowrd",

        component: () =>
            import ("../views/register/ResetPassword.vue"),
    },
    {
        path: "/categorie",
        name: "categorie",

        component: () =>
            import ("../views/Categorie.vue"),
    },
    {
        path: "/regime",
        name: "regime",

        component: () =>
            import ("../views/Regime.vue"),
    },
    {
        path: "/bareme",
        name: "bareme",

        component: () =>
            import ("../views/Bareme.vue"),
    },
    {
        path: "/:catchAll(.*)",
        component: NotFound,
    },
];

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes,
});

router.beforeEach((to, from, next) => {
    document.title = to.name;
    next();
});

export default router;