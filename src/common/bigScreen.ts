import { getCurrentWindow } from "@tauri-apps/api/window"
import { ref, watchEffect } from "vue"

export const bigScreen = ref<boolean>(false)
watchEffect(() => {
    getCurrentWindow().setFullscreen(bigScreen.value).catch(console.error)
})
watchEffect(() => {
    if (bigScreen.value) document.body.classList.add("big-screen")
    else document.body.classList.remove("big-screen")
})
window.addEventListener("keydown", (event: KeyboardEvent) => {
    console.debug(event.code)
    if (event.code === "F11") {
        bigScreen.value = !bigScreen.value
    }
})
