import { getCurrentWindow } from "@tauri-apps/api/window"
import { createEffect, createSignal } from "solid-js"

export const [isBigScreen, setBigScreen] = createSignal<boolean>(false)
createEffect(isBigScreen, () => {
    getCurrentWindow().setFullscreen(isBigScreen()).catch(console.error)
})
createEffect(() => {
    if (isBigScreen()) document.body.classList.add("big-screen")
    else document.body.classList.remove("big-screen")
})
window.addEventListener("keydown", (event: KeyboardEvent) => {
    console.debug(event.code)
    if (event.code === "F11") {
        setBigScreen(!isBigScreen())
    }
})
