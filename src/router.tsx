import { RouteDefinition } from "@solidjs/router"
import { createMemo, JSXElement, lazy } from "solid-js"
import { settings } from "./common/settings"

import IconBooks from "~icons/mdi/books"
import IconTrophy from "~icons/mdi/trophy"
import IconScript from "~icons/mdi/script"
import IconCog from "~icons/mdi/cog"

interface MyRoute extends RouteDefinition {
    name: string
    icon: JSXElement
}

const library: MyRoute = {
    path: "/",
    component: lazy(() => import("./views/LibraryView.js")),
    name: "Library",
    icon: <IconBooks />,
}
const achievements: MyRoute = {
    path: "/achievements",
    component: lazy(() => import("./views/LibraryView.js")),
    name: "Achievements",
    icon: <IconTrophy />,
}
const addons: MyRoute = {
    path: "/addons",
    component: lazy(() => import("./views/LibraryView.js")),
    name: "Addons",
    icon: <IconScript />,
}
const settingsRoute: MyRoute = {
    path: "/settings",
    component: lazy(() => import("./views/SettingsView.js")),
    name: "Settings",
    icon: <IconCog />,
}

export const routes = createMemo<MyRoute[]>(() => {
    const val = settings()
    return val.achievements.display
        ? [library, achievements, addons, settingsRoute]
        : [library, addons, settingsRoute]
})
