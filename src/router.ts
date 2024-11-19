import {
    createMemoryHistory,
    createRouter,
    RouteRecordSingleView,
} from "vue-router"

import LibraryView from "./views/LibraryView.vue"
import SettingsView from "./views/SettingsView.vue"

export const routes: (RouteRecordSingleView & { icon: string })[] = [
    { path: "/", component: LibraryView, name: "Library", icon: "mdi:books" },
    {
        path: "/settings",
        component: SettingsView,
        name: "Settings",
        icon: "mdi:cog",
    },
]

export const router = createRouter({
    history: createMemoryHistory(),
    routes,
})
