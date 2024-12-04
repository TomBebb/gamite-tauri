<script setup lang="ts">
import { routes } from "../router"
import {
    VaIcon,
    VaSidebar,
    VaSidebarItem,
    VaSidebarItemContent,
} from "vuestic-ui"
</script>
<template>
    <VaSidebar :model-value="true">
        <VaSidebarItem
            v-for="route in routes"
            :active="route.path === $route.fullPath"
        >
            <RouterLink :to="route.path">
                <VaSidebarItemContent>
                    <VaIcon :name="route.icon" />
                    <VaSidebarItemContent>
                        {{ route.name }}
                    </VaSidebarItemContent>
                </VaSidebarItemContent>
            </RouterLink>
        </VaSidebarItem>
    </VaSidebar>
</template>
