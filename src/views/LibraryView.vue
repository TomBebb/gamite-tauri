<script setup lang="ts">
import { inputEmitter, MappedButton } from "../common/input"
import { GameData } from "../common/models"
import Genres from "../components/Genres.vue"
import { invoke } from "@tauri-apps/api/core"
import ContextMenu, { ContextMenuProps } from "../components/ContextMenu.vue"
import UrlImage from "../components/UrlImage.vue"
import { onMounted, ref, watchEffect } from "vue"

type View = "grid" | "table" | "list"
const views: { name: string; value: View }[] = [
    { name: "Grid View", value: "grid" },
    { name: "Table View", value: "table" },
    { name: "List View", value: "list" },
]
const games = ref<GameData[]>([])
let clearGame: () => void
clearGame = () => {
    console.log("clear game")
    context.value = { game: undefined, pos: context.value.pos, clearGame }
}

const context = ref<ContextMenuProps>({
    clearGame: clearGame,
    pos: { x: 0, y: 0 },
})

const view = ref<View>("table")
const selectedGameIndex = ref<number>(0)

onMounted(() => {
    invoke<GameData[]>("get_games")
        .then((gs) => {
            console.info("got games", gs)
            games.value = gs.map((g) => ({ ...g, genres: [] }))
        })
        .catch(console.error)
})

function verticalMovementHandler(btn: MappedButton) {
    switch (btn) {
        case MappedButton.Up:
            if (selectedGameIndex.value !== 0) selectedGameIndex.value--
            break
        case MappedButton.Down:
            if (selectedGameIndex.value !== games.value.length - 1)
                selectedGameIndex.value++
            break
    }
}

function gridMovementHandler(btn: MappedButton) {
    console.info("gridMovementHandler", btn)
    switch (btn) {
        case MappedButton.Up:
            if (selectedGameIndex.value - columns > 0)
                selectedGameIndex.value = selectedGameIndex.value - columns
            break
        case MappedButton.Down:
            if (selectedGameIndex.value + columns < games.value.length)
                selectedGameIndex.value = selectedGameIndex.value + columns
            break
        case MappedButton.Left:
            if (selectedGameIndex.value > 0)
                selectedGameIndex.value = selectedGameIndex.value - 1
            break
        case MappedButton.Right:
            if (selectedGameIndex.value + 1 < games.value.length)
                selectedGameIndex.value = selectedGameIndex.value + 1
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
    context.value = { game, pos: { x: ev.x, y: ev.y }, clearGame }

    console.log(ev.x, ev.y)
    return false
}

onViewChange(view.value)
watchEffect(() => onViewChange(view.value))
const columns = 5
</script>
<template>
    <ContextMenu {...context()!} />
    <select v-bind:value="view" class="show-on-desktop select">
        <option v-for="view in views" value="{view.value}">
            {{ view.name }}
        </option>
    </select>
    <div v-if="view === 'grid'" :class="`grid gap-2 grid-cols-${columns}`">
        <For each="{games()}">
            <div
                v-for="(_game, index) in games"
                class="flex cursor-pointer flex-col items-center rounded-sm border-[1px]"
                @click="selectedGameIndex = index"
                :class="{
                    'bg-primary-content text-primary':
                        index === selectedGameIndex,
                }"
            >
                <div>{game.name}</div>
            </div>
        </For>
    </div>

    <ul v-else-if="view === 'list'">
        <li v-for="g in games" class="flex flex-row">
            <pre></pre>
            <UrlImage :src="g.iconUrl!" />
            <div>{{ g.name }}</div>
        </li>
    </ul>

    <table v-else-if="view === 'table'" class="table select-none">
        <thead>
            <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Genres</th>
            </tr>
        </thead>
        <tbody>
            <tr
                v-for="(game, index) in games"
                class="cursor-pointer"
                :class="{
                    'bg-primary-content text-primary':
                        index === selectedGameIndex,
                }"
                @click="selectedGameIndex = index"
                @contextmenu="showContextMenu.bind(null, game)"
            >
                >
                <td>{game.name}</td>
                <td>{game.description}</td>
                <td class="flex gap-2">
                    <Genres :genres="game.genres" />
                </td>
            </tr>
        </tbody>
    </table>
</template>
