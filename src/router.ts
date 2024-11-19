import { createMemoryHistory, createRouter } from "vue-router"

import LibraryView from "./views/LibraryView.vue"
import SettingsView from "./views/SettingsView.vue"

export const routes = [
    { path: "/", component: LibraryView, name: "Library" },
    { path: "/settings", component: SettingsView, name: "Settings" },
]

export const router = createRouter({
    history: createMemoryHistory(),
    routes,
})
