<script setup lang="ts">
import "./index.css"
import NavMenu from "./components/NavMenu.vue"
import Titlebar from "./components/Titlebar.vue"
</script>
<template>
    <div class="w-full">
        <Titlebar />
        <div class="drawer drawer-open">
            <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
            <div class="drawer-content flex flex-col p-5">
                <label for="my-drawer-2" class="btn btn-primary drawer-button">
                    Open drawer
                </label>
                <RouterView />
            </div>
            <div class="drawer-side">
                <label
                    for="my-drawer-2"
                    aria-label="close sidebar"
                    class="drawer-overlay"
                ></label>
                <NavMenu />
            </div>
        </div>
    </div>
</template>
