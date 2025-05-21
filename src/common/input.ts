import mitt, { Emitter } from "mitt"
import { produce } from "immer"
import {
    focusedItem,
    FocusedItem,
    isBigScreen,
    setFocusedItem,
} from "./bigScreen"
import { createEffect, createSignal } from "solid-js"

export const enum MappedButton {
    Down = "down",
    Up = "up",
    Right = "right",
    Left = "left",
    Confirm = "confirm",
    ShowNav = "showNav",
}

export type InputEvents = {
    pressed: MappedButton
    released: MappedButton
}
export const inputEmitter: Emitter<InputEvents> = mitt<InputEvents>()
export const [currButtons, setCurrButtons] = createSignal<Set<MappedButton>>(
    new Set()
)

inputEmitter.on("pressed", (btn) => {
    if (btn === MappedButton.ShowNav) {
        setFocusedItem(
            focusedItem() == FocusedItem.NavMenu
                ? FocusedItem.Page
                : FocusedItem.NavMenu
        )
    }
    setCurrButtons(produce(currButtons(), (st) => st.add(btn)))
})
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
        case "Space":
            return MappedButton.Confirm
        case "Escape":
            return MappedButton.ShowNav
        default:
            return null
    }
}

function onKeyDown(event: KeyboardEvent) {
    const mapped = mapKey(event)
    console.debug("keyUp", { mapped, raw: event.key })
    if (mapped) inputEmitter.emit("pressed", mapped)
}

function onKeyUp(event: KeyboardEvent) {
    const mapped = mapKey(event)
    console.debug("keyUp", { mapped, raw: event.key })
    if (mapped) inputEmitter.emit("released", mapped)
}

const gamepads: Gamepad[] = []
window.addEventListener("gamepadconnected", (event: GamepadEvent) => {
    console.info("gamepadconnected", event)
    gamepads.push(event.gamepad)
})

window.addEventListener("gamepaddisconnected", (event: GamepadEvent) => {
    console.info("gamepaddisconnected", event)
    gamepads.splice(gamepads.indexOf(event.gamepad), 1)
})

interface IndexedMappedButton {
    index: number
    mapped: MappedButton
}

const gpButtonIndices: IndexedMappedButton[] = [
    {
        index: 0,
        mapped: MappedButton.Confirm,
    },
    {
        index: 12,
        mapped: MappedButton.Up,
    },
    {
        index: 13,
        mapped: MappedButton.Down,
    },
    {
        index: 14,
        mapped: MappedButton.Left,
    },
    {
        index: 15,
        mapped: MappedButton.Right,
    },
]
const deadzone = 0.1

function setGamepadInterval(): number {
    console.debug("setGamepadInterval", { gamepadInterval })
    return setInterval(() => {
        if (gamepads.length === 0) return
        const pressed = new Set<MappedButton>()
        for (const gamepad of navigator.getGamepads()) {
            if (!gamepad?.connected) continue
            for (const entry of gpButtonIndices) {
                if (gamepad.buttons[entry.index].pressed)
                    pressed.add(entry.mapped)
            }

            const x = gamepad.axes[0]
            const y = gamepad.axes[1]
            if (Math.abs(x) > deadzone) {
                pressed.add(x > 0 ? MappedButton.Right : MappedButton.Left)
            }
            if (Math.abs(y) > deadzone) {
                pressed.add(y > 0 ? MappedButton.Down : MappedButton.Up)
            }
        }
        for (const currBtn of currButtons()) {
            if (!pressed.has(currBtn)) inputEmitter.emit("released", currBtn)
        }
        for (const pressedBtn of pressed) {
            if (!currButtons().has(pressedBtn))
                inputEmitter.emit("pressed", pressedBtn)
        }
    }, 1000 / 100)
}

let gamepadInterval: number

createEffect(() => {
    const bs = isBigScreen()
    console.debug("isBigScreen", bs)
    if (bs) {
        gamepadInterval = setGamepadInterval()
        window.addEventListener("keydown", onKeyDown)
        window.addEventListener("keyup", onKeyUp)
    } else {
        clearInterval(gamepadInterval)
        window.removeEventListener("keydown", onKeyDown)
        window.removeEventListener("keyup", onKeyUp)
    }
})
