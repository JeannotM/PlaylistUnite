"use client";
import styles from "./PlaylistSongs.module.scss";
import EventNames from "../../components/EventNames/EventNames";
import { useState, useCallback, useRef, MouseEvent, FocusEvent, TouchEvent } from 'react';
import Image from "next/image";
import { DelayedEffect } from "@/app/models/DelayedEffect";
import OptionsMenu from "../SongOptionsMenu/SongOptionsMenu";
import FormatDate from "../Functions/FormatDate";

export default function PlaylistSongs(params: { parentStyle: any, trackId: number }) {
    const [songs, setSongs]: [songs: {id: number, cover: string, name: string, time: number, code: string, artist: string, typeSite: number}[], setSongs: any] = useState([]);
    const [keys, setKeys] = useState([]); // @ts-ignore
    const [optionsMenu, setOptionsMenu] = useState(<></>);
    const [currentFocus, setCurrentFocus] = useState(-1);
    const beforeClass = params.parentStyle.before;
    const afterClass = params.parentStyle.after;
    const playlistId = params.trackId;
    
    let playSpecificSong = useRef((playlistId: number, songId: number) => {});
    let removeSongFunc = useRef((playlistId: number, songId: number, index: number) => {});
    let addToQueueFunc = useRef((songId: number) => {});

    let currentTarget: any = useRef(null);
    let draggedItem: any = useRef(null);

    function dragStart(event: any) {
        let target = getTarget(event);
        if(!target) return;

        draggedItem.current = target;
    }

    function dragEnd(event: any) {
        if((draggedItem.current !== null && currentTarget.current !== null) 
                && (draggedItem.current.getAttribute("data-index") !== currentTarget.current.getAttribute("data-index"))) {
            if(event.nativeEvent.offsetY < 25) {
                currentTarget.current.parentNode.insertBefore(draggedItem.current, currentTarget.current);
            } else {
                currentTarget.current.after(draggedItem.current);
            }

            const playlistRow = document.getElementById("playlist_row");
            if(playlistRow !== null) {
                const children = playlistRow.children;
                const newOrder = [];

                for(let i = 0; i < children.length; i++) {
                    const id = children[i].getAttribute("data-id");

                    if(id !== null && id !== undefined) {
                        children[i].setAttribute('data-index', i.toString());
                        newOrder.push(id);
                    }
                }

                window.dispatchEvent(new CustomEvent(EventNames.playlist.change, { detail: {
                    playlistId: playlistId,
                    order: newOrder
                }}));
            }
        }

        currentTarget.current = null;
        draggedItem.current = null;
    }


    /**
     * Gets the correct target from an event. Sometimes it selects the child of an item.
     * @param event Generic Event
     * @returns an HTML item or false if nothing is found
     */
    function getTarget(event: any) {
        let target = event.target;

        let tryCount = 4;
        let currentCount = 0;
        while(currentCount < tryCount) {
            if(target.getAttribute("draggable") === "true") { return target; }
            target = target.parentNode; 
        }

        return false;
    }


    function dragOver(event: any) {
        let target = getTarget(event);
        if(!target) return;

        // When the cursor is scrolling on the bottom of the song item
        if(event.nativeEvent.offsetY < 25) {
            if(!target.classList.contains(beforeClass)) {
                currentTarget.current = target;
                target.classList.remove(afterClass);
                target.classList.add(beforeClass);
            }

        // Top of the song item
        } else if(!target.classList.contains(afterClass)) {
            currentTarget.current = target;
            target.classList.remove(beforeClass);
            target.classList.add(afterClass);
        }
    }

    
    function dragLeave(event: any) { 
        let target = getTarget(event);
        if(!target) return;

        target.className = "";
    }


    let touchStarted = useRef(setTimeout(() => {}, 1));
    function touchStart(event: TouchEvent) {
        let target = getTarget(event);
        if(!target) return;

        const data = {
            preventDefault: () => event.preventDefault(),
            pageX: event.touches[0].pageX,
            pageY: event.touches[0].pageY
        }

        touchStarted.current = setTimeout(() => openOptionsMenu(data, target.getAttribute("data-id")), 500);
    }


    function touchEnd(event: any) {
        clearTimeout(touchStarted.current);
    }


    const data = useCallback((event: Event) => { // @ts-ignore
        const songData = event.detail.songs();
        setSongs(songData); // @ts-ignore
        setKeys(Object.keys(songData));

        // @ts-ignore
        playSpecificSong.current = (playlistId: number, songId: number) => event.detail.playSpecificSong(playlistId, songId); // @ts-ignore
        removeSongFunc.current = (playlistId: number, songId: number, index: number) => event.detail.removeSongFunc(playlistId, songId, index); // @ts-ignore
        addToQueueFunc.current = (songId: number) => {event.detail.addToQueueFunc(songId)};
    }, [setSongs, setKeys]);


    const openOptionsMenu = (e: {pageX: number, pageY: number, preventDefault: any} | MouseEvent, index: number) => {
        e.preventDefault();

        
        const songId = songs[keys[index]].id;
        window.dispatchEvent(new CustomEvent(EventNames.options.song, { detail: { songId: songId, playlistId: playlistId, index: index,
            left: e.pageX + 10, top: e.pageY + 10 } }))
    };


    DelayedEffect(EventNames.playlist, data, { trackId: params.trackId });
    return (<>
        {keys.map((value, index) => ( // @ts-ignore
            songs[keys[index]] === undefined ? (<></>) : (
                <div onContextMenu={(e) => { e.button === 2 ? openOptionsMenu(e, index) : "" }}
                    onMouseEnter={() => { setCurrentFocus(index) }} 
                    onMouseLeave={() => { setCurrentFocus(-1) }} key={index} data-index={index} data-id={songs[keys[index]].id}
                    onTouchStart={touchStart} onTouchEnd={touchEnd} className={params.parentStyle.playlist_row_item}
                    draggable={true} onDragOver={dragOver} onDragStart={dragStart} onDragLeave={dragLeave} onDragEnd={dragEnd}> 
                    <div className={params.parentStyle.song_id}>
                        {currentFocus == index 
                            ? <Image onClick={() => playSpecificSong.current(playlistId, songs[keys[index]].id)} alt="play button" src={"/play-outline.svg"} width={21} height={21} />
                            : <>{index}</>}  
                    </div>
                    <div className={params.parentStyle.song_origin}><Image src={"/" + songs[keys[index]].typeSite + ".svg"} width={25} height={25} alt="Music origin logo" /></div>
                    <div className={params.parentStyle.song_title} data-id={"container"} >
                        <Image width={39} height={39} alt="song cover image" src={(songs[keys[index]].typeSite === 0 
                            ? "https://i.ytimg.com/vi/" + songs[keys[index]].code + "/hqdefault.jpg"
                            : "https://i1.sndcdn.com/artworks-" + songs[keys[index]].cover + "-t200x200.jpg")} />
                        <div>
                            <a target="_blank" href={(songs[keys[index]].typeSite === 0 
                                ? "https://www.youtube.com/watch?v="
                                : "https://soundcloud.com/") + songs[keys[index]].code}>{songs[keys[index]].name}</a>
                            <span>{songs[keys[index]].artist}</span>
                        </div>
                    </div>
                    <div className={params.parentStyle.song_time}>{FormatDate(songs[keys[index]].time)}</div>
                    <button onClick={(e) => { openOptionsMenu(e, index); }} className={params.parentStyle.song_options}><span>...</span></button>
                </div>
            )
        ))}
    </>)
}