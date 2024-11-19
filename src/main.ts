import { createApp } from "vue"
import App from "./App.vue"
import { router } from "./router"
import { enableMapSet } from "immer"
import "./common/bigScreen.ts"
enableMapSet()
createApp(App).use(router).mount("#app")
