"use client"
import { useCallback, useRef } from "react";
import EventNames from "../EventNames/EventNames";
import { DelayedEffect } from "@/app/models/DelayedEffect";

export default function ArrowButton(props: { reversed?: boolean }) {
    const isReversed = props === undefined ? false : props.reversed;
    let changeSong = useRef((val: number) => {});
    
    // @ts-ignore
    const data = useCallback((event: Event) => changeSong.current = (val: number) => event.detail.changeSongFunc(val), []);


    DelayedEffect(EventNames.controls.order, data);
    return (
        <button aria-label="Song change button" onClick={() => changeSong.current(isReversed ? -1 : 1)} data-code={"arrow" + (isReversed ? "-reverse" : "")}>
            <svg xmlns="http://www.w3.org/2000/svg" style={isReversed ? {transform: "scale(-1, 1)"} : {}} viewBox="0 0 512 512"><path fill="currentColor" stroke="currentColor" d="M400 64a16 16 0 00-16 16v136.43L151.23 77.11a35.13 35.13 0 00-35.77-.44C103.46 83.47 96 96.63 96 111v290c0 14.37 7.46 27.53 19.46 34.33a35.14 35.14 0 0035.77-.45L384 295.57V432a16 16 0 0032 0V80a16 16 0 00-16-16z"/></svg>
        </button>
    )
}