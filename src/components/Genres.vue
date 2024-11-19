<script setup lang="ts">
import { getGenreIndex } from "../common/genres.ts"
import { computed } from "vue"

const props = defineProps<{ genres: string[] }>()

const mappedGenres = computed(() =>
    props.genres.map((genre) => ({
        name: genre,
        colorIndex: getGenreIndex(genre),
    }))
)
console.log(mappedGenres.value)
</script>

<template>
    <div
        v-for="genre in mappedGenres"
        class="badge"
        :class="{
            'badge-neutral': genre.colorIndex === 1,
            'badge-primary': genre.colorIndex === 2,
            'badge-secondary': genre.colorIndex === 3,
            'badge-accent': genre.colorIndex === 4,
            'badge-ghost': genre.colorIndex === 5,
        }"
    >
        {{ genre.name }}
    </div>
</template>

<style scoped></style>
