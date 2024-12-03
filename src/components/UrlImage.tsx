import { createSignal, onMount } from "solid-js"
import mapUrl from "../common/mapUrl"

export default function UrlImage({
    src,
    ...rest
}: Partial<HTMLImageElement> & { src: URL | string }) {
    const [mappedUrl, setMappedUrl] = createSignal<string>()
    onMount(() => {
        mapUrl(src).then(setMappedUrl).catch(console.error)
    })
    return <img alt="..." src={mappedUrl()!} {...(rest as any)}></img>
}
