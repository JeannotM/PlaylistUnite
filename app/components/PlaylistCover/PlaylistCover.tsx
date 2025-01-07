"use client"
import { DelayedEffect } from "@/app/models/DelayedEffect";
import EventNames from "../EventNames/EventNames";
import styles from "./PlaylistCover.module.scss"
import { useCallback, useState } from "react";

export default function PlaylistCover() {
    const [cover, setCover] = useState("");
    const [paused, setPaused] = useState(true);
    const data = useCallback((event: Event) => { // @ts-ignore
        setPaused(event.detail.paused()); // @ts-ignore
    }, []);

    const coverData = useCallback((event: Event) => { // @ts-ignore
        const playlist = event.detail.playlist();
        setCover(playlist.cover === undefined || playlist.cover === null ? "" : playlist.cover);
    }, []);


    DelayedEffect(EventNames.controls.play, data);
    DelayedEffect(EventNames.playlist.cover, coverData);
    return (
        <div className={styles.playlist_cover}>
            <div className={styles.image + " " + (paused ? styles.paused : styles.running)} style={{backgroundImage: "url(" + cover + ")"}} />
        </div>
    )
}