<script setup lang="ts">
import mapUrl from "../common/mapUrl"
import { onMounted, ref } from "vue"

const props = defineProps<{src: URL|string}>()
const mappedUrl = ref<string>()
onMounted(() => mapUrl(props.src).then(v => mappedUrl.value = v).catch(console.error))
</script>
<template>
    <img alt="..." :src='mappedUrl' v-bind="$attrs"></img>
</template>
