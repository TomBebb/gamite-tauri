import { RouteDefinition } from "@solidjs/router"
import { lazy } from "solid-js"

export const routes: (RouteDefinition & { name: string; icon: string })[] = [
    {
        path: "/",
        component: lazy(() => import("./views/LibraryView.js")),
        name: "Library",
        icon: "mdi:books",
    },
    {
        path: "/settings",
        component: lazy(() => import("./views/SettingsView.js")),
        name: "Settings",
        icon: "mdi:cog",
    },
]
