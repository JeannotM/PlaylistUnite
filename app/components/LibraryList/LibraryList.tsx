"use client"
import EventNames from "../EventNames/EventNames"
import { useCallback, useState } from "react";
import Link from "next/link";
import { DelayedEffect } from "@/app/models/DelayedEffect";
import Image from "next/image";

export default function LibraryList(props: { parent: string, styles: any }) {
    const [playlists, setPlaylists] = useState({});
    const [keys, setKeys] = useState([]);


    const toggleCollapse = () => {
        const attr = document.getElementsByClassName(props.parent)[0].getAttribute("data-is-collapsed") == "0" ? "1" : "0";
        document.getElementsByClassName(props.parent)[0].setAttribute("data-is-collapsed", attr);
        window.localStorage.setItem("isCollapsed", attr);
    }


    const data = useCallback((event: Event) => { // @ts-ignore
        const playlistData: { [key: number] } = event.detail.playlists();
        setPlaylists(playlistData); // @ts-ignore
        setKeys(Object.keys(playlistData));

        let isCollapsed = window.localStorage.getItem("isCollapsed");

        if(isCollapsed === null) {
            isCollapsed = "0";
            window.localStorage.setItem("isCollapsed", "0");
        }

        document.getElementsByClassName(props.parent)[0].setAttribute("data-is-collapsed", isCollapsed);
    }, [props.parent])


    const openPlaylistMenu = useCallback((e: {pageX: number, pageY: number, preventDefault: any} | MouseEvent, id: number) => {
        e.preventDefault();
        
        window.dispatchEvent(new CustomEvent(EventNames.options.playlist.change, { detail: { playlistId: id,
            left: e.pageX + 10, top: e.pageY + 10 } }));
    }, []);
        


    DelayedEffect(EventNames.library.side, data);
    return (<>
        <button onClick={toggleCollapse} className={props.styles.playlist_item}>
            <Image src={"/library.svg"} alt="library image" width={30} height={30} />
            <p>Library</p>
        </button>

        <div className={props.styles.library_container}>
            <div data-code={"library"} className={props.styles.library_list}>
                {keys.map((value, index) => (
                    <div key={index} className={props.styles.library_item} onContextMenu={(e) => openPlaylistMenu(e, playlists[value]['id'])}>
                        <div style={{backgroundImage: "url(" + (playlists[value]['cover'] == null ? "/placeholder.svg" : playlists[value]['cover']) + ")", backgroundSize: "cover"}} />
                        <Link href={"/playlist/" + value}>{playlists[value]['name']}</Link>
                    </div>
                ))}
            </div>
        </div>
    </>
        
    );
}