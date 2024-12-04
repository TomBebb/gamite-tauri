<script setup lang="ts">
import { routes } from "../router"
</script>
<template>
    <v-navigation-drawer>
        <v-list-item
            link
            v-for="route in routes"
            :title="route.name"
            :href="route.path"
        />
    </v-navigation-drawer>
</template>
