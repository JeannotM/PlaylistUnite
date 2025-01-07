"use client";
import EventNames from "../EventNames/EventNames"
import { useCallback, useState } from "react";
import styles from "./Display.module.scss";
import Image from "next/image";
import { DelayedEffect } from "@/app/models/DelayedEffect";
import Link from "next/link";

export default function Display() {
    let [playlistLink, setPlaylistLink] = useState(0);
    let [imageSource, setImageSource] = useState("/placeholder.svg");
    let [artist, setArtist] = useState("artist");
    let [title, setTitle] = useState("title");


    const data = useCallback((event: Event) => { // @ts-ignore
        const song = event.detail.song();
        if (song !== undefined) {
            setTitle(song.name);
            setArtist(song.artist); // @ts-ignore
            setPlaylistLink(event.detail.playlistId());

            if(song.typeSite === 0) {
                setImageSource("https://i.ytimg.com/vi/" + song.code + "/hqdefault.jpg");
            } else if(song.typeSite === 1) {
                if(song.cover !== undefined) {
                    setImageSource("https://i1.sndcdn.com/artworks-" + song.cover + "-t200x200.jpg");
                } else { setImageSource(""); }
            }

            setTimeout(() => {
                const artistField: any = document.querySelector("[data-code='display-artist']");
                if(artistField === null) { return; }


                const canvas = document.createElement("canvas");


                const context = canvas.getContext("2d");
                if(context === null) { return; }

                context.font = "600 16px Roboto";
                const metrics = context.measureText(song.name);
                let time = 0, left = 0;


                const display = document.getElementById("display");
                if(display === null) { return; }
                const charsPerSecond = 3;


                const size: number = document.querySelector("[display-title]")?.clientWidth || 300;

                
                if(metrics.width > size) {
                    left = (size - metrics.width) * 1.1;
                    time = ((left < 0 ? left * -1 : left) / charsPerSecond) / 5;
                }

                // @ts-ignore
                display.style = "--trans-x: " + left + "px; --time: " + time + "s";
            }, 50);
        }
    }, []);

    
    DelayedEffect(EventNames.display, data)
    return (
        <div className={styles.display} id="display">
            <Image alt="Song picture" src={imageSource} width={60} height={60} />
            <div>
                <Link href={"/playlist/" + playlistLink} data-code="display-title">{title}</Link>
                <p data-code="display-artist">{artist}</p>
            </div>
        </div>
    );
}