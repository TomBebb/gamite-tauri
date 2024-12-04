<script setup lang="ts">
import "./index.css"
import Titlebar from "./components/Titlebar.vue"
import NavMenu from "./components/NavMenu.vue"
</script>
<template>
    <Titlebar />
    <NavMenu />
    <RouterView />
</template>
