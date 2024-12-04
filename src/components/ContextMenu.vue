<script setup lang="ts">
import { GameData, GameInstallStatus } from "../common/models"
import { getActionData, getGameActions } from "../common/gameActions"
import { Icon } from "@iconify/vue"
import { computed, onMounted, onUnmounted, useTemplateRef } from "vue"

export interface ContextMenuProps {
    game?: GameData
    pos: { x: number; y: number }

    clearGame(): void
}
const props = defineProps<ContextMenuProps>()
const show = ref(false)
let el = useTemplateRef<HTMLDivElement>("el")

const actions = computed(() =>
    getGameActions(
        props.game?.installStatus ?? GameInstallStatus.InLibrary
    ).map(getActionData)
)

const handleClick = (event: MouseEvent) => {
    if (!el.value!.contains(event.target as Node) && props.game) {
        console.log("click outside")
        props.clearGame()
    }
}
onMounted(() => {
    document.addEventListener("click", handleClick)
})

onUnmounted(() => {
    document.removeEventListener("click", handleClick)
})
</script>
<template>
    <ul
        ref="el"
        class="menu absolute z-10 w-60 rounded-box bg-base-200 transition-opacity"
        :class="{ 'opacity-0': props?.game === undefined }"
        :style="{ top: props.pos.y + 'px', left: props.pos.x + 'px' }"
    >
        <li
            v-for="item in actions"
            :class="`bg-${item.color}&quot; text-${item.color}-content flex flex-row items-center gap-5 rounded`"
        >
            <Icon :icon="item.icon" />
            {{ item.name }}
        </li>
    </ul>
</template>
