"use client"

import Image from "next/image"
import EventNames from "../EventNames/EventNames";

export default function PlayPlaylistButton(props: { playlistId: any }) {
    const changePlaylist = () => {
        window.dispatchEvent(new CustomEvent(EventNames.playlist.play, { detail: { playlistId: props.playlistId }}))
    };

    return (
        <button onClick={changePlaylist}>
            <Image width={25} height={25} src="/play-outline.svg" alt="Play playlist" />
        </button>
    )
}