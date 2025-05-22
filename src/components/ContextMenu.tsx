import { GameData, GameInstallStatus } from "../common/models"
import {
    createEffect,
    createMemo,
    createSignal,
    For,
    onCleanup,
    onMount,
} from "solid-js"
import {
    GameAction,
    getActionData,
    getGameActions,
} from "../common/gameActions"
import * as logger from "@tauri-apps/plugin-log"

export interface ContextMenuProps {
    game?: GameData
    pos: { x: number; y: number }

    clearGame(): void
}

export default function ContextMenu(props: ContextMenuProps) {
    const [show, setShow] = createSignal(true)

    createEffect(() => {
        if (props.game) {
            setShow(true)
        }
    })

    function hide(): void {
        setShow(false)
        setTimeout(() => props.clearGame(), 500)
    }

    let ref: HTMLDivElement

    const actions = createMemo(() =>
        getGameActions(props.game?.installStatus ?? GameInstallStatus.InLibrary)
    )

    function globalClick(event: MouseEvent) {
        if (!ref.contains(event.target as Node) && props.game) {
            logger.info("click outside").catch(console.error)
            hide()
        }
    }

    onMount(() => {
        document.addEventListener("click", globalClick)
    })

    onCleanup(() => {
        document.removeEventListener("click", globalClick)
    })

    function onClick(action: GameAction) {
        logger.info(`game action ${action}`).catch(console.error)
        hide()
    }

    return (
        <div
            ref={ref!}
            class="menu rounded-box bg-base-200 absolute z-10 w-60 transition-opacity"
            classList={{ "opacity-0": props.game === undefined || !show() }}
            style={{ top: props.pos.y + "px", left: props.pos.x + "px" }}
        >
            <For each={actions()}>
                {(item) => {
                    const data = getActionData(item)
                    return (
                        <li
                            onClick={onClick.bind(null, item)}
                            class={`bg-${data.color} text-${data.color}-content flex cursor-pointer flex-row items-center gap-5 rounded`}
                        >
                            {data.icon}
                            {data.name}
                        </li>
                    )
                }}
            </For>
        </div>
    )
}
