import { getCurrentWindow } from "@tauri-apps/api/window"
import { createEffect, createMemo, createSignal } from "solid-js"
import { getMatches } from "@tauri-apps/plugin-cli"
import { listen } from "@tauri-apps/api/event"

export const [isBigScreen, setBigScreen] = createSignal<boolean>(false)
listen<void>("toggle-bigscreen", (_) => setBigScreen(!isBigScreen())).catch(
    console.error
)

enum Mode {
    BigScreen = "bigscreen",
    Desktop = "desktop",
}

getMatches()
    .then((result) => {
        const rawMode = result.subcommand?.name as Mode | undefined
        const mode = rawMode ?? Mode.Desktop
        setBigScreen(mode == Mode.BigScreen)
    })
    .catch(console.error)
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
