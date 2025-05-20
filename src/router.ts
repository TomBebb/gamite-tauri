import { RouteDefinition } from "@solidjs/router"
import { createMemo, lazy } from "solid-js"
import { settings } from "./common/settings"

interface MyRoute extends RouteDefinition {
    name: string
    icon: string
}

const library: MyRoute = {
    path: "/",
    component: lazy(() => import("./views/LibraryView.js")),
    name: "Library",
    icon: "mdi:books",
}
const achievements: MyRoute = {
    path: "/achievements",
    component: lazy(() => import("./views/LibraryView.js")),
    name: "Achievements",
    icon: "mdi:trophy",
}
const addons: MyRoute = {
    path: "/addons",
    component: lazy(() => import("./views/LibraryView.js")),
    name: "Addons",
    icon: "mdi:script",
}
const settingsRoute: MyRoute = {
    path: "/settings",
    component: lazy(() => import("./views/SettingsView.js")),
    name: "Settings",
    icon: "mdi:cog",
}

export const routes = createMemo<MyRoute[]>(() => {
    const val = settings()
    return val.achievements.display
        ? [library, achievements, addons, settingsRoute]
        : [library, addons, settingsRoute]
})
