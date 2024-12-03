import { GameData, GameInstallStatus } from "../common/models"
import { createMemo, For, onCleanup, onMount } from "solid-js"
import { getActionData, getGameActions } from "../common/gameActions"
import { Icon } from "@iconify-icon/solid"

export interface ContextMenuProps {
    game?: GameData
    pos: { x: number; y: number }

    clearGame(): void
}

export default function ContextMenu(props: ContextMenuProps) {
    let ref: HTMLDivElement

    const actions = createMemo(() =>
        getGameActions(
            props.game?.installStatus ?? GameInstallStatus.InLibrary
        ).map(getActionData)
    )

    const handleClick = (event: MouseEvent) => {
        if (!ref.contains(event.target as Node) && props.game) {
            console.log("click outside")
            props.clearGame()
        }
    }
    onMount(() => {
        document.addEventListener("click", handleClick)
    })

    onCleanup(() => {
        document.removeEventListener("click", handleClick)
    })

    return (
        <div
            ref={ref!}
            class="menu absolute z-10 w-60 rounded-box bg-base-200 transition-opacity"
            classList={{ "opacity-0": props.game === undefined }}
            style={{ top: props.pos.y + "px", left: props.pos.x + "px" }}
        >
            <For each={actions()}>
                {(item) => (
                    <li>
                        <a>
                            <Icon icon={item.icon} />
                            {item.name}
                        </a>
                    </li>
                )}
            </For>
        </div>
    )
}
