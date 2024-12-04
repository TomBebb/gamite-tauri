import {
    createRouter,
    createWebHistory,
    RouteRecordSingleView,
} from "vue-router"

export interface MyRoute extends RouteRecordSingleView {
    name: string
    icon: string
}
export const routes: MyRoute[] = [
    {
        path: "/",
        component: () => import("./views/LibraryView.vue"),
        name: "Library",
        icon: "mdi-library",
    },
    {
        path: "/settings",
        component: () => import("./views/SettingsView.vue"),
        name: "Settings",
        icon: "mdi-cog",
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
