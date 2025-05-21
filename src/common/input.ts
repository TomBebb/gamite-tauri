import mitt, { Emitter } from "mitt"
import { produce } from "immer"
import { isBigScreen } from "./bigScreen"
import { createEffect, createSignal } from "solid-js"

import * as logger from "@tauri-apps/plugin-log"

export const enum MappedButton {
    Down = "down",
    Up = "up",
    Right = "right",
    Left = "left",
    Confirm = "confirm",
}

export type InputEvents = {
    pressed: MappedButton
    released: MappedButton
}
export const inputEmitter: Emitter<InputEvents> = mitt<InputEvents>()
export const [currButtons, setCurrButtons] = createSignal<Set<MappedButton>>(
    new Set()
)

const keyMappings = new Map<string, MappedButton>([
    ["ArrowDown", MappedButton.Down],
    ["ArrowUp", MappedButton.Up],
    ["ArrowLeft", MappedButton.Left],
    ["ArrowRight", MappedButton.Right],
    ["Enter", MappedButton.Confirm],
])
inputEmitter.on("pressed", (btn) =>
    setCurrButtons(produce(currButtons(), (st) => st.add(btn)))
)
inputEmitter.on("released", (btn) =>
    setCurrButtons(
        produce(currButtons(), (st) => {
            st.delete(btn)
        })
    )
)

function onKeyDown(event: KeyboardEvent) {
    const mapped = keyMappings.get(event.key)
    logger.debug(`keyDown ${event.key} => ${mapped}`).catch(console.error)
    if (mapped) inputEmitter.emit("pressed", mapped)
}

function onKeyUp(event: KeyboardEvent) {
    const mapped = keyMappings.get(event.key)
    logger.debug(`keyUp ${event.key} => ${mapped}`).catch(console.error)
    if (mapped) inputEmitter.emit("released", mapped)
}

createEffect(() => {
    const bs = isBigScreen()
    logger.debug(`isBigScreen: ${bs}`).catch(console.error)
    if (bs) {
        window.addEventListener("keydown", onKeyDown)
        window.addEventListener("keyup", onKeyUp)
    } else {
        window.removeEventListener("keydown", onKeyDown)
        window.removeEventListener("keyup", onKeyUp)
    }
})
