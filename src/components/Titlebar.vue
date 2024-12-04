<script setup lang="ts">
import { window } from "@tauri-apps/api"
import { ref } from "vue"
import { Icon } from "@iconify/vue"

const main = window.getCurrentWindow()
const maximized = ref(false)
function toggleMaximize() {
    main.toggleMaximize()
        .then((_) => (maximized.value = !maximized.value))
        .catch(console.error)
}
</script>
<template>
    <div class="flex flex-row gap-2" @dblclick="toggleMaximize">
        <div
            class="flex-1"
            @mousedown="
                (ev) => {
                    if (ev.buttons === 1 && ev.detail === 1) {
                        main.startDragging().catch(console.error)
                    }
                }
            "
        />
        <button class="btn btn-accent btn-sm" @click="toggleMaximize">
            <Icon
                size="2"
                :icon="`mdi:window-${maximized ? 'restore' : 'maximize'}`"
            />
        </button>
        <button
            class="btn btn-warning btn-sm"
            @click="main.minimize().catch(console.error)"
        >
            <Icon icon="mdi:window-minimize" />
        </button>
        <button
            class="btn btn-error btn-sm"
            @click="main.close().catch(console.error)"
        >
            <Icon icon="mdi:window-close" />
        </button>
    </div>
</template>
