import PlaylistItemImage from "../PlaylistItemImage/PlaylistItemImage"
import styles from "./PlaylistItem.module.scss"
import Link from "next/link";
import Image from "next/image";

export default function PlaylistItem(playlist: any) {
    playlist = playlist.playlist;

    return (
        <Link href={"/playlist/" + playlist.id} className={styles.playlist_item}>
            <Image className={styles.play_button} alt="play button" src={"/play-outline.svg"} style={{"margin": 0, "color": "white"}} width={50} height={50} />
            <PlaylistItemImage className={styles.vinyl} image={playlist.image}/>
            <div className={styles.board}>
                <p>{playlist.name}</p>
            </div>
        </Link>
    )
}