<script setup lang="ts">
import router, { routes } from "../router"
import { RouteRecordSingleView } from "vue-router"

function onClick(route: RouteRecordSingleView, ev: Event) {
    ev.preventDefault()
    router.push(route.path)
}
</script>
<template>
    <v-navigation-drawer>
        <v-list-item
            v-for="route in routes"
            :title="route.name"
            :href="route.path"
            @click="onClick(route, $event)"
        />
    </v-navigation-drawer>
</template>
