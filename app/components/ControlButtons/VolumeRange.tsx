"use client"
import { DelayedEffect } from "@/app/models/DelayedEffect";
import EventNames from "../EventNames/EventNames";
import { useCallback, useRef, useState } from "react";
import Image from "next/image";


export default function VolumeRange(props: { className: string }) {
    let setVolumeCallback = useRef((volume: number) => {});
    const [volume, setVolume] = useState(50);
    let beforeMuteValue = useRef(-1);
    let volumeSrc = useRef("volume-medium");


    const toggleMute = useCallback(() => {
        if(volume == 0) {
            let value = 50;
            if(beforeMuteValue.current !== -1) { value = beforeMuteValue.current; }

            setVolumeCallback.current(value)
            beforeMuteValue.current = -1;
            setVolume(value)
        } else {
            beforeMuteValue.current = volume; 
            setVolumeCallback.current(0);
            setVolume(0);
        }
    }, [volume]);


    const data = useCallback((event: Event) => { // @ts-ignore
        const volumeValue = event.detail.volume();
        setVolume(volumeValue); // @ts-ignore
        setVolumeCallback.current = (volume: number) => event.detail.setVolume(volume);

        if(volumeValue == 0) {
            volumeSrc.current = "volume-mute";
        } else if (volumeValue <= 33) {
            volumeSrc.current = "volume-low";
        } else if (volumeValue <= 66) {
            volumeSrc.current = "volume-medium";
        } else {
            volumeSrc.current = "volume-high";
        }
    }, []);


    DelayedEffect(EventNames.controls.volume, data);
    return (
        <div className={props.className}>
            <button data-id="mute-button" onClick={(e) => toggleMute()}>
                <Image src={"/" + volumeSrc.current + ".svg"} width={25} height={25} alt="Volume" />
            </button>
            <input type="range" data-id="volume-range" min="0" step={1} max="100" value={volume}
                onInput={(e) => setVolumeCallback.current(parseInt(e.currentTarget.value))} />
        </div>
    )
}