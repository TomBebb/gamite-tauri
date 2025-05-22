import mitt, { Emitter } from "mitt"
import { produce } from "immer"
import { isBigScreen } from "./bigScreen"
import { createEffect, createSignal, onCleanup, onMount } from "solid-js"

import * as logger from "@tauri-apps/plugin-log"

const [gamepadCount, setGamepadCount] = createSignal(0)
const [gamepad, setGamepad] = createSignal<Gamepad | null>()

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

const [count, setCount] = createSignal(0)

function scanGamepads(): void {
    const gps = navigator.getGamepads()
    let curr: Gamepad | null = null
    for (const gp of gps) {
        if (gp !== null) {
            curr = gp
            break
        }
    }

    setCount(count() + 1)
    if (count() >= 100) {
        console.log("gps", curr, gamepad())
        setCount(0)
    }

    if (curr?.buttons && gamepad()?.buttons) {
        for (const [index, btn] of buttonsMapping.entries()) {
            if (!gamepad()!.buttons[index] && curr!.buttons[index]) {
                inputEmitter.emit("pressed", btn)
                logger.info(`Pressed gamepad: ${btn}`)
            } else if (gamepad()!.buttons[index] && !curr!.buttons[index])
                inputEmitter.emit("released", btn)
        }
    }
    setGamepad(curr ? { ...curr } : null)
}

let gamepadScanner: number = -1
createEffect(() => {
    const hasInterval = gamepadScanner !== -1
    if (!isBigScreen()) {
        console.info("clear interval")
        clearInterval(gamepadScanner)
        gamepadScanner = -1
    } else if (gamepadCount() > 0 && isBigScreen() && !hasInterval) {
        console.info("set interval")

        gamepadScanner = setInterval(scanGamepads, 10)
    }
})

function onGamepadConnected(gamepad: GamepadEvent) {
    setGamepadCount(gamepadCount() + 1)
    logger
        .info(
            `gamepad connected ${gamepad.gamepad.id}; total: ${gamepadCount()}`
        )
        .catch(console.error)
}

function onGamepadDisconnected(gamepad: GamepadEvent) {
    logger
        .info(
            `gamepad disconnected ${gamepad.gamepad.id}; total: ${gamepadCount()}`
        )
        .catch(console.error)
    setGamepadCount(Math.max(0, gamepadCount() - 1))
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

onMount(() => {
    window.addEventListener("gamepadconnected", onGamepadConnected)
    window.addEventListener("gamepaddisconnected", onGamepadDisconnected)
})
onCleanup(() => {
    window.removeEventListener("gamepadconnected", onGamepadConnected)
    window.removeEventListener("gamepaddisconnected", onGamepadDisconnected)
})
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
