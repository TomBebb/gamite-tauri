<script setup lang="ts">
import { routes } from "../router"
import { Icon } from "@iconify/vue"
</script>
<template>
    <Menu :model="routes">
        <template #item="{ item }">
            <router-link v-ripple :to="item.path" class="reset w-full my-nav">
                <Icon :icon="item.icon!" />
                <span class="ml-2">{{ item.name }}</span>
            </router-link>
        </template>
    </Menu>
</template>
<style scoped>
.reset {
    text-decoration: none !important;
    color: inherit !important;
}
</style>
