"use client";
import styles from "./PlayerMainFrame.module.scss";
import { useCallback, useEffect, useRef, useState } from "react";
import DataController from "@/app/models/DataController";

/** Starts loading the data and the songplayer */
export default function PlayerMainFrame() {
    const dataController = useRef((window: Window, setVideoPlayer: any, setSongDownloader: any) => new DataController(window, setVideoPlayer, setSongDownloader));
    const [songDownloader, setSongDownloader] = useState(<div></div>);
    const [videoPlayer, setVideoPlayer] = useState(<div></div>);
    let hasInstance = useRef(false);

    useEffect(() => { 
        if(!hasInstance.current) {
            hasInstance.current = true;
            dataController.current(window, setVideoPlayer, setSongDownloader);
        }
     }, []);
    return (
        <div className={styles.player_main_frame}>
            {videoPlayer}
            {songDownloader}
        </div>
    );
}