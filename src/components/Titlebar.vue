<script setup lang="ts">
import { window } from "@tauri-apps/api"
import { ref } from "vue"
import { VaButton, VaNavbar, VaNavbarItem } from "vuestic-ui"

const main = window.getCurrentWindow()
const maximized = ref(false)
function toggleMaximize() {
    main.toggleMaximize()
        .then((_) => (maximized.value = !maximized.value))
        .catch(console.error)
}
</script>
<template>
    <VaNavbar
        color="primary"
        class="flex h-10 flex-row items-center gap-2 bg-gray-100 px-1"
        @dblclick="toggleMaximize"
    >
        <template #center>
            <VaNavbarItem class="title"> TODO </VaNavbarItem>
        </template>
        <template #right>
            <VaButton
                :icon="`window-${maximized ? 'restore' : 'maximize'}`"
                @click="toggleMaximize"
            />
            <VaButton
                icon="window-minimize"
                @click="main.minimize().catch(console.error)"
            />
            <VaButton
                icon="window-close"
                @click="main.close().catch(console.error)"
            />
        </template>
    </VaNavbar>
</template>
<style scoped>
.title {
    font-weight: bold;
    font-size: 2em;
}
</style>
