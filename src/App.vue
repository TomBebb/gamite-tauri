<script setup lang="ts">
import "./index.css"
import NavMenu from "./components/NavMenu.vue"
import Titlebar from "./components/Titlebar.vue"
</script>
<template>
    <Titlebar class="sticky top-0 z-[100]" />
    <div class="drawer drawer-open">
        <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
        <div class="drawer-content flex flex-col p-5">
            <RouterView />
        </div>
        <div class="drawer-side flex w-56 flex-row bg-base-200">
            <NavMenu class="flex-1" />
        </div>
    </div>
</template>
