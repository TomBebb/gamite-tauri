const totalBadgeVariants = 6
export let genreIndexes: Record<string, number> = {}
export function getGenreIndex(name: string): number {
    const val = genreIndexes[name]
    if (val != null) return val
    console.debug("add genreIndex", {
        val,
        name,
        indexes: genreIndexes,
        total: genreIndexes.length,
    })
    const ind = Object.keys(genreIndexes).length % totalBadgeVariants
    genreIndexes = { ...genreIndexes, [name]: ind }
    return ind
}
