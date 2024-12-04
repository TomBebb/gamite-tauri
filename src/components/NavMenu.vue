<script setup lang="ts">
import { routes } from "../router"
import { Icon } from "@iconify/vue"
</script>
<template>
    <ul class="menu menu-md w-56 bg-base-200">
        <li v-for="route in routes">
            <RouterLink
                :to="route.path"
                class="cursor-pointer"
                :class="{ active: route.path === $route.fullPath }"
            >
                <Icon :icon="route.icon" />
                {{ route.name }}
            </RouterLink>
        </li>
    </ul>
</template>
