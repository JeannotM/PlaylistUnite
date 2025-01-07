"use client"
import { useCallback, useRef, useState } from "react"
import EventNames from "../EventNames/EventNames";
import { DelayedEffect } from "@/app/models/DelayedEffect";
import styles from "./ShuffleButton.module.scss";

export default function ShuffleButton() {
    const [shuffle, setShuffle] = useState(false);
    let toggleShuffle = useRef((val: boolean) => {});
    const data = useCallback((event: Event) => { // @ts-ignore
        setShuffle(event.detail.shuffle()); // @ts-ignore
        toggleShuffle.current = (val: boolean) => event.detail.toggleShuffle(val);
    }, []);


    DelayedEffect(EventNames.controls.shuffle, data);
    return (
        <button aria-label="shuffle button" data-code="shuffle" onClick={() => toggleShuffle.current(!shuffle)} className={shuffle ? styles.active : ""}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" strokeLinecap={"round"} strokeLinejoin={"round"} fill={"none"} stroke={"currentColor"} strokeWidth={"32px"}>
                <path d="M400 304l48 48-48 48M400 112l48 48-48 48M64 352h85.19a80 80 0 0066.56-35.62L256 256" /><path d="M64 160h85.19a80 80 0 0166.56 35.62l80.5 120.76A80 80 0 00362.81 352H416M416 160h-53.19a80 80 0 00-66.56 35.62L288 208"/></svg>
        </button>
    )
}