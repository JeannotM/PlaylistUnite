"use client"
import { useCallback, useRef, useState } from "react";
import EventNames from "../EventNames/EventNames";
import { DelayedEffect } from "@/app/models/DelayedEffect";
import FormatDate from "../Functions/FormatDate";


export default function TimeRange(props: { className: string }) {
    let addToRangeCallback = useRef(setTimeout(() => {}, 1));
    let [songTimeStr, setSongTimeStr] = useState("0:00");
    let setTimeCallback = useRef((val: number) => {});
    let [currentTime, setCurrentTime] = useState(0);
    let [songTime, setSongTime] = useState(0);
    let currentTimeRef = useRef(currentTime);
    let draggingRef = useRef(false);
    let pausedRef = useRef(true);


    function setValue(value: string, upload: boolean = false) {
        let intValue = parseInt(value);

        currentTimeRef.current = intValue;
        setCurrentTime(intValue);

        if(upload) setTimeCallback.current(intValue);
    }


    const increaseTime = useCallback(() => {
        if(!pausedRef.current && !draggingRef.current) {
            currentTimeRef.current += 1
            setCurrentTime(currentTimeRef.current);
        }

        clearTimeout(addToRangeCallback.current);
        addToRangeCallback.current = setTimeout(increaseTime, 999);
    }, [setCurrentTime]);


    const data = useCallback((event: Event) => { // @ts-ignore
        setTimeCallback.current = (val: number) => event.detail.setTime(val); // @ts-ignore
        pausedRef.current = event.detail.paused(); // @ts-ignore
        const songTime = event.detail.songTime(); // @ts-ignore
        const time = event.detail.time();

        currentTimeRef.current = time;
        setSongTimeStr(FormatDate(songTime));
        setSongTime(songTime);
        setCurrentTime(time);

        clearTimeout(addToRangeCallback.current);
        addToRangeCallback.current = setTimeout(increaseTime, 1 - (time - Math.floor(time)));
    }, [increaseTime])


    DelayedEffect(EventNames.controls.range, data);
    return (
        <div className={props.className}>
            <p>{FormatDate(currentTime)}</p>
            <label htmlFor="timeRange">Time Range</label>
            <input type="range" name="time" id="timeRange" min="0" step={1} max={songTime} value={currentTime}
                onMouseUp={(e) => {draggingRef.current = false; setValue(e.currentTarget.value, true)}} onMouseDown={() => draggingRef.current = true}
                onInput={(e) => setValue(e.currentTarget.value, false)} />
            <p>{songTimeStr}</p>
        </div>
    )
}