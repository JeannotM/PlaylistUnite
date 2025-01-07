"use client"
import { DelayedEffect } from "@/app/models/DelayedEffect";
import styles from "./PlaylistOptionsMenu.module.scss";
import EventNames from "../EventNames/EventNames";
import { useCallback, useEffect, useRef, useState } from "react";

export default function PlaylistOptionsMenu() {
    const [showData, setShowData] = useState("0");
    const [position, setPosition] = useState({});
    const addToQueueFunc = useRef(() => {});
    const removeFunc = useRef(() => {});
    const playlistId = useRef(-1);
    
    const data = useCallback((event: Event) => { // @ts-ignore
        addToQueueFunc.current = () => event.detail.addToQueueFunc(playlistId.current); // @ts-ignore
        removeFunc.current = () => event.detail.removePlaylistFunc(playlistId.current);
    }, []);


    const changeShowState = useCallback((newValue: string) => {
        setTimeout(() => { setShowData(newValue); }, 100);
    }, []);
    

    const playlistData = useCallback((event: Event) => { // @ts-ignore
        setPosition({ left: event.detail.left, top: event.detail.top }); // @ts-ignore
        playlistId.current = event.detail.playlistId;


        changeShowState("1");
    }, [changeShowState]);


    DelayedEffect(EventNames.options.playlist, data);
    useEffect(() => {
        window.addEventListener(EventNames.options.playlist.change, playlistData);
        return () => window.removeEventListener(EventNames.options.playlist.change, playlistData);
    }, [playlistData]);
    return (
        <section className={styles.menu} style={position} data-show={showData} onBlur={() => changeShowState("0")}>
            {showData === "1" ? (<>
                <input autoFocus type="text" style={{opacity: "0", height: 0, border: 0}} />
                <button onClick={() => { addToQueueFunc.current() }}>Add all songs to Queue</button>
                <button onClick={() => { removeFunc.current()} }>Remove Playlist</button>
            </>) : (<></>)}
        </section>
    );
}