"use client"
import styles from "./QueueItem.module.scss"
import Image from 'next/image'

export default function QueueItem(props: any) { 
    const origin = "/" + props.origin + ".svg";

    return (<>
        {props.index > 1 ? (
            <div className={props.vertical_line} />
        ) : (<></>)}

        <div className={styles.queueItem}>
            <Image src={origin} width={25} height={25} alt="Music origin logo" />
            <div>
                <a target="_blank" href={(props.origin === 0 
                        ? "https://www.youtube.com/watch?v="
                        : "https://soundcloud.com/") + props.code} data-code="queue-item-name">{props.name}</a>
                <p>{props.artist}</p>
            </div>
        </div>

        {props.index === 0 ? (
            <hr />
        ) : (<></>)}
    </>)
}