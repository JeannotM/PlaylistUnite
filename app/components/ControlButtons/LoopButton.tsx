"use client"
import { useCallback, useRef, useState } from "react"
import EventNames from "../EventNames/EventNames";
import { DelayedEffect } from "@/app/models/DelayedEffect";
import styles from "./LoopButton.module.scss";

export default function LoopButton() {
    const [loop, setLoop] = useState(0);
    let changeLoop = useRef(() => {});
    const data = useCallback((event: Event) => { // @ts-ignore
        setLoop(event.detail.loop()); // @ts-ignore
        changeLoop.current = () => event.detail.changeLoop();
    }, []);


    DelayedEffect(EventNames.controls.loop, data);
    return (
        <button aria-label="Loop button" data-code="loop" onClick={() => changeLoop.current()} className={loop === 0 ? "" : loop === 1 ? styles.active : loop === 2 ? styles.single : ""}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" strokeLinecap="round" fill={"none"} stroke={"currentColor"} strokeWidth={"48px"}>
                <path d="M256 256s-48-96-126-96c-54.12 0-98 43-98 96s43.88 96 98 96c30 0 56.45-13.18 78-32M256 256s48 96 126 96c54.12 0 98-43 98-96s-43.88-96-98-96c-29.37 0-56.66 13.75-78 32"/></svg>
        </button>
    )
}