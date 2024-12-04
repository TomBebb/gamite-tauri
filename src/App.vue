<script setup lang="ts">
import "./index.css"
import NavMenu from "./components/NavMenu.vue"
import Titlebar from "./components/Titlebar.vue"
</script>
<template>
    <Titlebar class="sticky top-0 z-[100]" />
    <v-app>
        <NavMenu />
        <v-main>
            <RouterView />
        </v-main>
    </v-app>
</template>
