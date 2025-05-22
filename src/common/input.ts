import mitt, { Emitter } from "mitt"
import { produce } from "immer"
import { isBigScreen } from "./bigScreen"
import { createEffect, createSignal } from "solid-js"
import * as logger from "@tauri-apps/plugin-log"
import { execute, PluginEvent } from "tauri-plugin-gamepad-api"

const [gamepad, setGamepad] = createSignal<PluginEvent | null>()

export const enum MappedButton {
    Down,
    Up,
    Right,
    Left,
    Confirm,
    Back,
    ToggleMenu,
}

const buttonsMapping: Map<number, MappedButton> = new Map<number, MappedButton>(
    [
        [12, MappedButton.Up],
        [13, MappedButton.Down],
        [14, MappedButton.Left],
        [15, MappedButton.Right],
        [0, MappedButton.Confirm],
        [1, MappedButton.Back],
        [16, MappedButton.ToggleMenu],
    ]
)

function onGamepadEvent(curr: PluginEvent) {
    console.log("onGamepadEvent", curr)
    if (curr?.buttons && gamepad()?.buttons) {
        for (let i = 0; i < curr.buttons.length; i++) {
            console.info(curr.buttons[i])
            if (curr.buttons[i]) {
                console.info(`pressed button${curr.buttons[i]} on${curr.name}`)
            }
        }
        for (const [index, btn] of buttonsMapping.entries()) {
            if (!gamepad()!.buttons[index] && curr!.buttons[index]) {
                inputEmitter.emit("pressed", btn)
                logger.info(`Pressed gamepad: ${btn}`)
            } else if (gamepad()!.buttons[index] && !curr!.buttons[index])
                inputEmitter.emit("released", btn)
        }
    }
    setGamepad(curr)
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
window.ongamepadconnected = (ev) => console.log("ongamepadconnected", ev)

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

const [gamepadEventListener, setGamepadEventListener] = createSignal<
    (() => void) | null
>(null)

execute(onGamepadEvent).catch(console.error)
createEffect(() => {
    const bs = isBigScreen()
    logger.debug(`isBigScreen: ${bs}`).catch(console.error)
    if (bs) {
        window.addEventListener("keydown", onKeyDown)
        window.addEventListener("keyup", onKeyUp)
        execute(onGamepadEvent)
            .catch(console.error)
            .then(setGamepadEventListener)
    } else {
        window.removeEventListener("keydown", onKeyDown)
        window.removeEventListener("keyup", onKeyUp)
        const val = gamepadEventListener()
        console.log("evet listener", val)
        if (val !== null) {
            val()
            setGamepadEventListener(null)
        }
    }
})
