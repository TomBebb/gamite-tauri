<script setup lang="ts">
import { GameData, GameInstallStatus } from "../common/models"
import { getActionData, getGameActions } from "../common/gameActions"
import { computed } from "vue"

const props = defineProps<{ game: GameData }>()

const actions = computed(() =>
    getGameActions(
        props.game?.installStatus ?? GameInstallStatus.InLibrary
    ).map(getActionData)
)
</script>
<template>
    <v-menu open-on-click activator="parent">
        <template v-slot:activator="{ on }">
            <v-btn color="primary" dark @contextmenu.prevent="on.click">
                Dropdown
            </v-btn>
        </template>
        <v-list>
            <v-list-item
                v-for="item in actions"
                :title="item.name"
                :prepend-icon="item.icon"
            />
        </v-list>
    </v-menu>
</template>
