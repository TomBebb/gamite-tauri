<script setup lang="ts">
import { ref, watch } from "vue"
import { inputEmitter, MappedButton } from "../common/input.ts"
import { GameData, GameInstallStatus } from "../common/models.ts"
import Genres from "../components/Genres.vue"

type View = "grid" | "table" | "list"
const games = ref<GameData[]>([
    {
        name: "Atelier Sophie 2",
        libraryId: "1621310",
        libraryType: "steam",
        description: "Play as sophie 2",
        genres: ["JRPG", "Turn-Based"],
        installStatus: GameInstallStatus.Installed,
    },
    {
        name: "Atelier Sophie 1",
        libraryId: "1621310",
        libraryType: "steam",
        description: "Play as sophie 1",
        genres: ["JRPG", "Turn-Based", "TODo"],
        installStatus: GameInstallStatus.Installed,
    },
    {
        name: "Atelier Shallie 1",
        libraryId: "1621310",
        libraryType: "steam",
        description: "Play as sophie 1",
        genres: ["JRPG", "Turn-Based", "TODo"],
        installStatus: GameInstallStatus.Installed,
    },
])
const views: { name: string; value: View }[] = [
    { name: "Grid View", value: "grid" },
    { name: "Table View", value: "table" },
    { name: "List View", value: "list" },
]
const view = ref<View>("list")
const selectedGameIndex = ref<number>(0)
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
function onViewChange(view: View) {
    inputEmitter.off("pressed", verticalMovementHandler)
    if (view === "grid") {
        // TODO
    } else {
        inputEmitter.on("pressed", verticalMovementHandler)
    }
}
onViewChange(view.value)
watch(view, onViewChange)
</script>
<template>
    <select class="select" v-model="view">
        <option v-for="view in views" :value="view.value">
            {{ view.name }}
        </option>
    </select>
    <template v-if="view === 'table'">
        <table class="table select-none">
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
                    :class="{
                        'bg-primary-content text-primary':
                            index === selectedGameIndex,
                    }"
                >
                    <td>{{ game.name }}</td>
                    <td>{{ game.description }}</td>
                    <td class="flex gap-2">
                        <Genres :genres="game.genres" />
                    </td>
                </tr>
            </tbody>
        </table>
    </template>
    <div>Library!</div>
</template>
