import { createApp } from "vue"
import App from "./App.vue"
import { router } from "./router"
import { enableMapSet } from "immer"
enableMapSet()
createApp(App).use(router).mount("#app")
