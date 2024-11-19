<script setup lang="ts">
import { routes } from "../router"
</script>
<template>
    <ul class="menu menu-md w-56 rounded-box bg-base-200">
        <li v-for="route in routes" :class="{ disabled: true }">
            <RouterLink :to="route.path">
                {{ route.name }}
            </RouterLink>
        </li>
    </ul>
</template>
