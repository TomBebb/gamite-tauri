import { getCurrentWindow } from "@tauri-apps/api/window"
import { createEffect, createMemo, createSignal } from "solid-js"

export const [isBigScreen, setBigScreen] = createSignal<boolean>(false)
export const isDesktop = createMemo(() => !isBigScreen(), false)
createEffect(() => {
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
        console.info("big screen toggle", isBigScreen())
    }
})
