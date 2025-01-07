"use client"
import { useCallback, useEffect, useState } from "react";
import EventNames from "../EventNames/EventNames";
import styles from "./MessageModal.module.scss";

export default function MessageModal() {
    const [message, setMessage] = useState("");

    const data = useCallback((event: Event) => {
        setTimeout(() => { setMessage(""); }, 4000); // @ts-ignore
        setMessage(event.detail.message);
    }, []);

    useEffect(() => {
        window.addEventListener(EventNames.msgmodal.message, data);
        return () => window.addEventListener(EventNames.msgmodal.message, data);
    }, [data]);

    return (
        message === "" ? (<></>) : (
            <div className={styles.message_modal}>
                {message}
            </div>
        )
    )
}