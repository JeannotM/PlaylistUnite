"use client"
import { DelayedEffect } from "@/app/models/DelayedEffect";
import styles from "./SongOptionsMenu.module.scss";
import EventNames from "../EventNames/EventNames";
import { useCallback, useEffect, useRef, useState } from "react";

export default function SongOptionsMenu() {

    const [showData, setShowData] = useState("0");
    const [position, setPosition] = useState({});
    const addToQueueFunc = useRef(() => {});
    const removeFunc = useRef(() => {});
    const playlistId = useRef(-1);
    const songId = useRef(-1);
    const index = useRef(-1);
    
    const data = useCallback((event: Event) => { // @ts-ignore
        addToQueueFunc.current = () => event.detail.addToQueueFunc(songId.current); // @ts-ignore
        removeFunc.current = () => event.detail.removeSongFunc(playlistId.current, songId.current, index.current);
    }, []);


    const changeShowState = useCallback((newValue: string) => {
        setTimeout(() => { setShowData(newValue); }, 100);
    }, []);
    

    const songData = useCallback((event: Event) => { // @ts-ignore
        setPosition({ left: event.detail.left, top: event.detail.top }); // @ts-ignore
        playlistId.current = event.detail.playlistId; // @ts-ignore
        songId.current = event.detail.songId; // @ts-ignore
        index.current = event.detail.index;


        changeShowState("1");
    }, [changeShowState]);


    DelayedEffect(EventNames.options, data);
    useEffect(() => {
        window.addEventListener(EventNames.options.song, songData);
        return () => window.removeEventListener(EventNames.options.song, songData);
    }, [songData]);
    return (
        <section className={styles.menu} style={position} data-show={showData} onBlur={() => changeShowState("0")}>
            {showData === "1" ? (<>
                <input autoFocus type="text" style={{opacity: "0", height: 0, border: 0}} />
                <button onClick={() => { addToQueueFunc.current() }}>Add to Queue</button>
                <button onClick={() => { removeFunc.current()} }>Remove from Playlist</button>
            </>) : (<></>)}
        </section>
    );
}