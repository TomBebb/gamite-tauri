<script setup lang="ts">
import { routes } from "../router"
import { Icon } from "@iconify/vue"
</script>
<template>
    <ul class="menu menu-md w-56 rounded-box bg-base-200">
        <li v-for="route in routes">
            <a
                :href="route.path"
                :class="{ active: route.path === $route.fullPath }"
            >
                <Icon :icon="route.icon" />
                {{ route.name }}
            </a>
        </li>
    </ul>
</template>
