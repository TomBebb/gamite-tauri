import { ref, watch } from "vue"
import { getCurrentWindow } from "@tauri-apps/api/window"
export const isBigScreen = ref<boolean>(false)
watch(isBigScreen, (value: boolean) => {
    document.body.classList.add("big-screen")
    getCurrentWindow().setFullscreen(value).catch(console.error)
})
watch(isBigScreen, (value: boolean) => {
    if (value) document.body.classList.add("big-screen")
    else document.body.classList.remove("big-screen")
})
window.addEventListener("keydown", (event: KeyboardEvent) => {
    console.debug(event.code)
    if (event.code === "F11") {
        isBigScreen.value = !isBigScreen.value
    }
})
