import {
    createMemoryHistory,
    createRouter,
    RouteRecordSingleView,
} from "vue-router"

export const routes: (RouteRecordSingleView & { icon: string })[] = [
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

export const router = createRouter({
    history: createMemoryHistory(),
    routes,
})
