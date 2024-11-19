<script setup lang="ts">
import { ref } from "vue"
import "./index.css"
import { invoke } from "@tauri-apps/api/core"
import NavMenu from "./components/NavMenu.vue"
const greetMsg = ref("")
const name = ref("")

async function greet() {
    greetMsg.value = await invoke("greet", { name: name.value })
}
</script>

<template>
    <NavMenu />
    <main>
        <RouterView />
    </main>
</template>
