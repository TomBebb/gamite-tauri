<script setup lang="ts">
import { ref } from "vue"
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
])
const views: { name: string; value: View }[] = [
    { name: "Grid View", value: "grid" },
    { name: "Table View", value: "table" },
    { name: "List View", value: "list" },
]
const view = ref<View>("list")
</script>
<template>
    <select class="select" v-model="view">
        <option v-for="view in views" :value="view.value">
            {{ view.name }}
        </option>
    </select>
    <template v-if="view === 'table'">
        <table class="table table-zebra select-none">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Genres</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="game in games">
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
