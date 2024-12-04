<script setup lang="ts">
import { window } from "@tauri-apps/api"
import { ref } from "vue"

const main = window.getCurrentWindow()
const maximized = ref(false)
function toggleMaximize() {
    main.toggleMaximize()
        .then((_) => (maximized.value = !maximized.value))
        .catch(console.error)
}
</script>
<template>
    <v-app-bar @dblclick="toggleMaximize">
        <v-app-bar-title tag="h1">Gamite</v-app-bar-title>
        <div
            class="flex-1 bg-gray-100"
            @mousedown="
                (ev) => {
                    if (ev.buttons === 1 && ev.detail === 1) {
                        main.startDragging().catch(console.error)
                    }
                }
            "
        />
        <v-btn-group>
            <v-btn
                :icon="`mdi-window-${maximized ? 'restore' : 'maximize'}`"
                @click="toggleMaximize"
            />
            <v-btn
                icon="mdi-window-minimize"
                @click="main.minimize().catch(console.error)"
            />
            <v-btn
                icon="mdi-window-close"
                @click="main.close().catch(console.error)"
            />
        </v-btn-group>
    </v-app-bar>
</template>
