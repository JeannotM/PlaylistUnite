"use client"
import { useEffect } from "react";

/**
 * A modified useEffect function which is called after all the localStorage data has been loaded in
 * @param props Contains the data and register strings of the events
 * @param data A callback function that should be executed
 * @param params Extra parameters than need to be sent with the call (Like playlistId or something similar)
 */
export function DelayedEffect(props: {data: string, register: string}, data: (event: Event) => void, params: {} | number = 0) {
    useEffect(() => {
        setTimeout(() => {
            window.addEventListener(props.data, data);
            window.dispatchEvent(new CustomEvent(props.register, { detail: params }));
            return () => window.removeEventListener(props.data, data);
        }, 2);
    }, [props.register, props.data, data, params]);
}