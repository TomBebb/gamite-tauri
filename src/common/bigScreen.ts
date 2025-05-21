import { getCurrentWindow } from "@tauri-apps/api/window"
import { createEffect, createMemo, createSignal } from "solid-js"
import { getMatches } from "@tauri-apps/plugin-cli"
import { listen } from "@tauri-apps/api/event"
import * as logger from "@tauri-apps/plugin-log"

export const [isBigScreen, setBigScreen] = createSignal<boolean>(false)
listen<void>("toggle-bigscreen", (_) => setBigScreen(!isBigScreen())).catch(
    logger.error
)

export enum FocusedItem {
    Page,
    NavMenu,
}

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

export const [focusedItem, setFocusedItem] = createSignal<FocusedItem>(
    FocusedItem.Page
)
createEffect(() => {
    getCurrentWindow().setFullscreen(isBigScreen()).catch(console.error)
})
createEffect(() => {
    if (isBigScreen()) document.body.classList.add("big-screen")
    else document.body.classList.remove("big-screen")
})
window.addEventListener("keydown", (event: KeyboardEvent) => {
    logger.debug(`${event.code}`).catch(console.error)
    if (event.code === "F11") {
        setBigScreen(!isBigScreen())
        logger.info(`big screen toggle ${isBigScreen()}`).catch(console.error)
    }
})
