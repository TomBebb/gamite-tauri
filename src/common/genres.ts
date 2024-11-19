import { ref } from "vue"

const totalBadgeVariants = 6
export const genreIndexes = ref<Record<string, number>>({})
export function getGenreIndex(name: string): number {
    const val = genreIndexes.value[name]
    if (val != null) return val
    console.debug("add genreIndex", {
        val,
        name,
        indexes: genreIndexes.value,
        total: genreIndexes.value.length,
    })
    const ind = Object.keys(genreIndexes.value).length % totalBadgeVariants
    genreIndexes.value = { ...genreIndexes.value, [name]: ind }
    return ind
}
