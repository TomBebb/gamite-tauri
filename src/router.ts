import {
    createRouter,
    createWebHistory,
    RouteRecordSingleView,
} from "vue-router"

export const routes: (RouteRecordSingleView & {
    name: string
    icon: string
})[] = [
    {
        path: "/",
        component: () => import("./views/LibraryView.vue"),
        name: "Library",
        icon: "mdi:books",
    },
    {
        path: "/settings",
        component: () => import("./views/SettingsView.vue"),
        name: "Settings",
        icon: "mdi:cog",
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
