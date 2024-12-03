import { inputEmitter, MappedButton } from "../common/input"
import { GameData } from "../common/models"
import Genres from "../components/Genres"
import { invoke } from "@tauri-apps/api/core"
import { createEffect, createSignal, For, onMount, Show } from "solid-js"
import ContextMenu, { ContextMenuProps } from "../components/ContextMenu"

type View = "grid" | "table" | "list"
const views: { name: string; value: View }[] = [
    { name: "Grid View", value: "grid" },
    { name: "Table View", value: "table" },
    { name: "List View", value: "list" },
]
export default function () {
    const [games, setGames] = createSignal<GameData[]>([])
    let clearGame: () => void
    clearGame = () => {
        console.log("clear game")
        setContext({ game: undefined, pos: { x: 0, y: 0 }, clearGame })
    }

    const [context, setContext] = createSignal<ContextMenuProps>({
        clearGame: clearGame,
        pos: { x: 0, y: 0 },
    })

    const [view, setView] = createSignal<View>("table")
    const [selectedGameIndex, setSelectedGameIndex] = createSignal<number>(0)

    onMount(() => {
        invoke<GameData[]>("get_games")
            .then((gs) => {
                console.info("got games", gs)
                setGames(gs.map((g) => ({ ...g, genres: [] })))
            })
            .catch(console.error)
    })

    function verticalMovementHandler(btn: MappedButton) {
        switch (btn) {
            case MappedButton.Up:
                if (selectedGameIndex() !== 0)
                    setSelectedGameIndex(selectedGameIndex() - 1)
                break
            case MappedButton.Down:
                if (selectedGameIndex() !== games().length - 1)
                    setSelectedGameIndex(selectedGameIndex() + 1)
                break
        }
    }

    function gridMovementHandler(btn: MappedButton) {
        console.info("gridMovementHandler", btn)
        switch (btn) {
            case MappedButton.Up:
                if (selectedGameIndex() - columns > 0)
                    setSelectedGameIndex(selectedGameIndex() - columns)
                break
            case MappedButton.Down:
                if (selectedGameIndex() + columns < games().length)
                    setSelectedGameIndex(selectedGameIndex() + columns)
                break
            case MappedButton.Left:
                if (selectedGameIndex() > 0)
                    setSelectedGameIndex(selectedGameIndex() - 1)
                break
            case MappedButton.Right:
                if (selectedGameIndex() + 1 < games().length)
                    setSelectedGameIndex(selectedGameIndex() + 1)
                break
        }
    }

    function onViewChange(view: View) {
        inputEmitter.off("pressed", verticalMovementHandler)
        inputEmitter.off("pressed", gridMovementHandler)
        if (view === "grid") {
            inputEmitter.on("pressed", gridMovementHandler)
        } else {
            inputEmitter.on("pressed", verticalMovementHandler)
        }
    }

    function showContextMenu(game: GameData, ev: MouseEvent) {
        console.info("context click", { game, ev })
        ev.preventDefault()
        ev.stopPropagation()
        setContext({ game, pos: { x: ev.x, y: ev.y }, clearGame })

        console.log(ev.x, ev.y)
        return false
    }

    onViewChange(view())
    createEffect(() => onViewChange(view()))
    const columns = 5
    return (
        <>
            <Show when={context()}>
                <ContextMenu {...context()!} />
            </Show>
            <select
                value={view()}
                class="show-on-desktop select"
                on:change={(ev) => {
                    setView(
                        (ev.target as unknown as HTMLInputElement).value as View
                    )
                }}
            >
                <For each={views}>
                    {(view) => <option value={view.value}>{view.name}</option>}
                </For>
            </select>
            <Show when={view() === "grid"}>
                <div class={`grid gap-2 grid-cols-${columns}`}>
                    <For each={games()}>
                        {(game, index) => (
                            <div
                                class="flex cursor-pointer flex-col items-center rounded-sm border-[1px]"
                                on:click={() => setSelectedGameIndex(index())}
                                classList={{
                                    "bg-primary-content text-primary":
                                        index() === selectedGameIndex(),
                                }}
                            >
                                <div>{game.name}</div>
                            </div>
                        )}
                    </For>
                </div>
            </Show>

            <Show when={view() === "table"}>
                <table class="table select-none">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Genres</th>
                        </tr>
                    </thead>
                    <tbody>
                        <For each={games()}>
                            {(game, index) => (
                                <tr
                                    class="cursor-pointer"
                                    classList={{
                                        "bg-primary-content text-primary":
                                            index() === selectedGameIndex(),
                                    }}
                                    on:click={() => {
                                        setSelectedGameIndex(index())
                                    }}
                                    on:contextmenu={showContextMenu.bind(
                                        null,
                                        game
                                    )}
                                >
                                    <td>{game.name}</td>
                                    <td>{game.description}</td>
                                    <td class="flex gap-2">
                                        <Genres genres={game.genres} />
                                    </td>
                                </tr>
                            )}
                        </For>
                    </tbody>
                </table>
            </Show>
        </>
    )
}
