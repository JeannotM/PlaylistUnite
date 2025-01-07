'use client'
import styling from "./Search.module.scss";
import EventNames from "../EventNames/EventNames";
import Image from "next/image";

export default function Search(props: {playlistId: any}) {
    async function AddSong(event: any) {
        event.preventDefault();
        const inputValue: string | null = event.target[0].value;

        if(inputValue === null) return;
        if(inputValue.includes("http")) {
            const playlistId = parseInt(event.target[1].value || 0);

            if(inputValue.includes("youtube")) {
                const url = inputValue.split("v=")[1].split("&")[0];
                
                
                window.dispatchEvent(new CustomEvent(EventNames.song.add, {detail: {
                    playlistId: playlistId,
                    typeSite: 0,
                    code: url
                }}));


                const input = document.querySelector("input[name='url']");
                if(input === null) { return; } // @ts-ignore
                input.value = "";
            } else if (inputValue.includes("soundcloud")) {
                const url = inputValue.split(".com/")[1].split("?")[0];


                window.dispatchEvent(new CustomEvent(EventNames.song.add, {detail: {
                    playlistId: playlistId,
                    typeSite: 1,
                    code: url
                }}));


                const input = document.querySelector("input[name='url']");
                if(input === null) { return; } // @ts-ignore
                input.value = "";
            }
        }
    }


    return (
        <form className={styling.searchBar} id="searchBar" onSubmit={AddSong}>
            <input type="text" name="url" placeholder="Add YouTube or SoundCloud Url Link.." />
            <input type="hidden" name="playlistId" value={props.playlistId} />
            <button aria-label="search button"><Image src={"/search.svg"} alt="" width={25} height={25} /></button>
        </form>
    );
}