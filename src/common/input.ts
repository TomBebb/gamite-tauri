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

function mapKey(event: KeyboardEvent): null | MappedButton {
    switch (event.key) {
        case "ArrowDown":
            return MappedButton.Down
        case "ArrowUp":
            return MappedButton.Up
        case "ArrowLeft":
            return MappedButton.Left
        case "ArrowRight":
            return MappedButton.Right
        case "space":
            return MappedButton.Confirm
        default:
            return null
    }
}

function onKeyDown(event: KeyboardEvent) {
    const mapped = mapKey(event)
    logger.debug(`keyDown ${event.key} => ${mapped}`).catch(console.error)
    if (mapped) inputEmitter.emit("pressed", mapped)
}

function onKeyUp(event: KeyboardEvent) {
    const mapped = mapKey(event)
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
