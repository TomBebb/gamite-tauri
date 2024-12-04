<script setup lang="ts">
import "./index.css"
import NavMenu from "./components/NavMenu.vue"
import Titlebar from "./components/Titlebar.vue"
import { VaLayout } from "vuestic-ui"
import { ref } from "vue"

const showDrawer = ref(false)
</script>
<template>
    <VaLayout>
        <template #top>
            <Titlebar />
        </template>

        <template #left>
            <NavMenu />
        </template>

        <template #content>
            <RouterView />
        </template>
    </VaLayout>
</template>
