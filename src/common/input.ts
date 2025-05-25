import mitt, { Emitter } from "mitt"
import { produce } from "immer"
import { isBigScreen } from "./bigScreen"
import { createEffect, createSignal, onMount, onCleanup } from "solid-js"

import * as logger from "@tauri-apps/plugin-log"

export const enum MappedButton {
    Down,
    Up,
    Right,
    Left,
    Confirm,
    Back,
    ToggleMenu,
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
    ["Backspace", MappedButton.Back],
    ["Escape", MappedButton.ToggleMenu],
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

const [gamepadCount, setGamepadCount] = createSignal(0)

function onGamepadConnected(ev: GamepadEvent) {
    logger.info(`gamepad connected ${ev.gamepad.id}`)
    setGamepadCount(gamepadCount() + 1)
}

function onGamepadDisonnected(ev: GamepadEvent) {
    logger.info(`gamepad diconnected ${ev.gamepad.id}`)
    setGamepadCount(gamepadCount() - 1)
}

createEffect(() => {
    const bs = isBigScreen()
    logger.debug(`isBigScreen: ${bs}`).catch(console.error)
    if (bs) {
        setGamepadCount(navigator.getGamepads?.length ?? 0)

        window.addEventListener("keydown", onKeyDown)
        window.addEventListener("keyup", onKeyUp)
    } else {
        window.removeEventListener("keydown", onKeyDown)
        window.removeEventListener("keyup", onKeyUp)
    }
})

onMount(() => {
    window.addEventListener("gamepadconnected", onGamepadConnected)
    window.addEventListener("gamepaddisconnected", onGamepadDisonnected)
})
onCleanup(() => {
    window.removeEventListener("gamepadconnected", onGamepadConnected)
    window.removeEventListener("gamepaddisconnected", onGamepadDisonnected)
})
