import { getGenreIndex } from "../common/genres"
import { createMemo, For } from "solid-js"

export default function (props: { genres: string[] }) {
    const mappedGenres = createMemo(() =>
        props.genres.map((genre) => ({
            name: genre,
            colorIndex: getGenreIndex(genre),
        }))
    )
    return (
        <For each={mappedGenres()}>
            {(genre) => (
                <div
                    class="badge"
                    classList={{
                        "badge-neutral": genre.colorIndex === 1,
                        "badge-primary": genre.colorIndex === 2,
                        "badge-secondary": genre.colorIndex === 3,
                        "badge-accent": genre.colorIndex === 4,
                        "badge-ghost": genre.colorIndex === 5,
                    }}
                >
                    {genre.name}
                </div>
            )}
        </For>
    )
}
