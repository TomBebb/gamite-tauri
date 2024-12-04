<script setup lang="ts">
import { window } from "@tauri-apps/api"
import { ref } from "vue"
import { Icon } from "@iconify/vue"
import { ButtonGroup } from "primevue"

const main = window.getCurrentWindow()
const maximized = ref(false)
function toggleMaximize() {
    main.toggleMaximize()
        .then((_) => (maximized.value = !maximized.value))
        .catch(console.error)
}
</script>
<template>
    <div
        class="flex h-3rem flex-row align-items-center gap-2 bg-gray-100 px-1"
        @dblclick="toggleMaximize"
    >
        <div
            class="flex-1 bg-gray-100"
            @mousedown="
                (ev) => {
                    console.log(ev)
                    if (ev.buttons === 1 && ev.detail === 1) {
                        main.startDragging().catch(console.error)
                    }
                }
            "
        />
        <ButtonGroup>
            <Button severity="info" @click="toggleMaximize">
                <template #icon>
                    <Icon
                        size="2"
                        :icon="`mdi:window-${maximized ? 'restore' : 'maximize'}`"
                    />
                </template>
            </Button>
            <Button @click="main.minimize().catch(console.error)">
                <template #icon>
                    <Icon icon="mdi:window-minimize" />
                </template>
            </Button>
            <Button severity="warn" @click="main.close().catch(console.error)">
                <template #icon>
                    <Icon icon="mdi:window-close" />
                </template>
            </Button>
        </ButtonGroup>
    </div>
</template>
