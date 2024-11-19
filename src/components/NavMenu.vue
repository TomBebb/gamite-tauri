<script setup lang="ts">
import { routes } from "../router"
</script>
<template>
    <ul class="menu menu-md bg-base-200 rounded-box w-56">
        <li v-for="route in routes" :class="{ disabled: true }">
            <RouterLink :to="route.path">
                {{ route.name }}
            </RouterLink>
        </li>
    </ul>
</template>
