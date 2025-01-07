"use client"
import styles from "./Queue.module.scss"
import { MouseEvent, useCallback, useRef, useState } from "react"
import EventNames from "../EventNames/EventNames"
import QueueItem from "../QueueItem/QueueItem";
import { DelayedEffect } from "@/app/models/DelayedEffect";
import Image from "next/image";

export default function Queue() {
    const [currentQueue, setCurrentQueue]: [currentQueue: {name: string, code: string, artist: string, typeSite: number}[], setCurrentQueue: any] = useState([]);
    const [playlistName, setPlaylistName] = useState("");
    const currentPlaylist = useRef({});
    const data = useCallback((event: Event) => { // @ts-ignore
        currentPlaylist.current = event.detail.playlist(); // @ts-ignore
        setPlaylistName(currentPlaylist.current.name); // @ts-ignore
        setCurrentQueue(event.detail.queue());
    }, [setPlaylistName, setCurrentQueue]);


    const openModal = useCallback(() => {
        window.dispatchEvent(new CustomEvent(EventNames.modal.open, { detail: {  // @ts-ignore
            playlistId: currentPlaylist.current.id, // @ts-ignore
            cover: currentPlaylist.current.cover, // @ts-ignore
            name: currentPlaylist.current.name,
        }}));
    }, [currentPlaylist]);


    DelayedEffect(EventNames.queue, data);
    return (
        <div className={styles.queue}>
            <div className={styles.queue_name}>
                <h2>{playlistName}</h2>
                <Image onClick={openModal} src={"/create.svg"} alt="Edit playlist" width={25} height={25} />
            </div>
            <div className={styles.list} data-code="queue">
                {currentQueue.map((song, index) => (
                    <QueueItem key={index} index={index} name={song.name} code={song.code} artist={song.artist}
                        origin={song.typeSite} vertical_line={styles.vertical_line} />
                ))}
            </div>
        </div>
    )
}