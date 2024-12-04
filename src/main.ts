import { enableMapSet } from "immer"
import "./common/bigScreen.ts"
import App from "./App.vue"
import { window } from "@tauri-apps/api"
import { createApp } from "vue"
import router from "./router"
import PrimeVue from "primevue/config"
import Aura from "@primevue/themes/aura"

const w = window.getCurrentWindow()
await w.setDecorations(false)
const root = document.getElementById("app")!

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
    throw new Error(
        "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?"
    )
}

enableMapSet()
createApp(App)
    .use(router)
    .use(PrimeVue, { theme: { preset: Aura } })
    .mount("#app")
