import mitt, { Emitter } from "mitt"
import { produce } from "immer"
import { ref } from "vue"
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
export const currButtons = ref<Set<MappedButton>>(new Set())

inputEmitter.on(
    "pressed",
    (btn) =>
        (currButtons.value = produce(currButtons.value, (st) => st.add(btn)))
)
inputEmitter.on(
    "released",
    (btn) =>
        (currButtons.value = produce(currButtons.value, (st) => {
            st.delete(btn)
        }))
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

window.addEventListener("keydown", (event: KeyboardEvent) => {
    console.info("down", event.key)
    const mapped = mapKey(event)
    if (mapped) inputEmitter.emit("pressed", mapped)
})

window.addEventListener("keyup", (event: KeyboardEvent) => {
    const mapped = mapKey(event)
    if (mapped) inputEmitter.emit("released", mapped)
})
