import EventNames from "../components/EventNames/EventNames";
import SongController from "./SongController";
import YouTubeController from "./YouTubeController";
import SoundCloudController from "./SoundCloudController";
import ReactPlayer from "react-player";
import { eventNames } from "process";
import { useRef } from "react";

class DataController {
    songController: SongController | undefined;
    setSongDownloader: any;
    setVideoPlayer: any;
    playlists: Playlist;
    userInfo: UserInfo;
    window: Window;
    songs: Song; 

    readonly functionNames: { [key: number]: { name: string, func: () => void } } = {
        0: { name: "togglePause",       func: () => this.togglePause(!this.userInfo.current.paused),
        },
        1: { name: "nextSong",          func: () => this.changeSong({ isTrusted: true, indexCounter: 1}),
        },
        2: { name: "previousSong",      func: () => this.changeSong({ isTrusted: true, indexCounter: -1}),
        },
        3: { name: "toggleShuffle",     func: () => this.toggleShuffle(!this.userInfo.current.shuffle),
        },
        4: { name: "toggleLoop",        func: () => this.changeLoop((this.userInfo.current.loop + 1 < 3 ? this.userInfo.current.loop + 1 : 0)),
        },
    }

    constructor(window: Window, setVideoPlayer: any, setSongDownloader: any) {
        this.setSongDownloader = setSongDownloader;
        this.setVideoPlayer = setVideoPlayer;
        this.window = window;


        const playlists = this.window.localStorage.getItem("playlists");
        if(playlists === null) {
            this.playlists = {
                0: { id: 0, songs: [], cover: null, playCount: 0, isFavorite: true, name: "tracks", lastPlayed: Date.now() }
            }
            this.window.localStorage.setItem("playlists", JSON.stringify(this.playlists));
        } else { this.playlists = JSON.parse(playlists); }


        const userInfo = this.window.localStorage.getItem("userInfo");
        if(userInfo === null) {
            this.userInfo = {
                keys: {
                    "Space": {
                        type: "none",
                        func: 0,
                    },
                    "ArrowRight": {
                        type: "alt",
                        func: 1,
                    },
                    "ArrowLeft": {
                        type: "alt",
                        func: 2,
                    },
                },
                songAmount: 0, playlistAmount: 1, user: { name: null },
                auth: { soundcloud: null, spotify: null, youtube: null },
                current: { time: 0.0, song: { id: -1, auto: true }, playlist: 0, paused: true, loop: 0, shuffle: false, volume: 50, queue: { auto: [], user: [] } }
            }
            this.window.localStorage.setItem("userInfo", JSON.stringify(this.userInfo));
        } else { this.userInfo = JSON.parse(userInfo); }
        
        
        const songs = this.window.localStorage.getItem("songs");
        if(songs === null) {
            this.songs = {};
            this.window.localStorage.setItem("songs", JSON.stringify(this.songs));
        } else { this.songs = JSON.parse(songs); }


        setTimeout(() => {
            this.registerEvents();
            this.changeSong({ indexCounter: 0, isTrusted: true })
        }, 1);
    }


    private updateData() {
        this.window.localStorage.setItem("playlists", JSON.stringify(this.playlists));
        this.window.localStorage.setItem("userInfo", JSON.stringify(this.userInfo));
        this.window.localStorage.setItem("songs", JSON.stringify(this.songs));
        return true;
    }


    /** Should only be called when the application starts */
    private registerEvents() {
        this.window.addEventListener("keyup", event => this.checkKey(event)); 
        this.window.addEventListener(EventNames.queue.register, event => this.sendQueueData(event));
        this.window.addEventListener(EventNames.display.register, event => this.sendDisplayData(event));
        this.window.addEventListener(EventNames.controls.play.register, event => this.sendPlayData(event));
        this.window.addEventListener(EventNames.controls.loop.register, event => this.sendLoopData(event));
        this.window.addEventListener(EventNames.settings.keys.register, event => this.sendKeysData(event));
        this.window.addEventListener(EventNames.options.register, event => this.sendSongOptionsData(event));
        this.window.addEventListener(EventNames.playlist.cover.register, event => this.sendCoverData(event));
        this.window.addEventListener(EventNames.controls.order.register, event => this.sendArrowData(event));
        this.window.addEventListener(EventNames.controls.range.register, event => this.sendRangeData(event));
        this.window.addEventListener(EventNames.controls.volume.register, event => this.sendVolumeData(event));
        this.window.addEventListener(EventNames.controls.shuffle.register, event => this.sendShuffleData(event));
        this.window.addEventListener(EventNames.library.home.register, event => this.sendAllPlaylistData(event));
        this.window.addEventListener(EventNames.library.side.register, event => this.sendAllPlaylistData(event));
        this.window.addEventListener(EventNames.options.playlist.register, event => this.sendPlaylistOptionsData(event)); // @ts-ignore

        this.window.addEventListener(EventNames.song.add, event => this.addSong(event)); // @ts-ignore;
        this.window.addEventListener(EventNames.song.delete, event => this.deleteSong(event)); // @ts-ignore
        this.window.addEventListener(EventNames.playlist.add, event => this.addPlaylist(event)); // @ts-ignore
        this.window.addEventListener(EventNames.playlist.change, event => this.changeOrder(event)); // @ts-ignore;
        this.window.addEventListener(EventNames.song.change, event => this.changeSong(event.detail)); // @ts-ignore
        this.window.addEventListener(EventNames.modal.open, event => this.openModal(event.detail)); // @ts-ignore;
        this.window.addEventListener(EventNames.playlist.play, event => this.changePlaylist(event.detail)); // @ts-ignore
        this.window.addEventListener(EventNames.modal.save, event => this.updatePlaylist(event.detail)); // @ts-ignore;
        this.window.addEventListener(EventNames.playlist.register, event => this.sendPlaylistData(event.detail.trackId));
    }


    /** Source: https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle */
    private shuffleArray(songs: number[], keepFirstSong = true): number[] {
        if(songs.length <= 1) return songs;
        const array: number[] = []

        // Make a copy, not a reference
        let shuffledSongs = array.concat(songs);
        let currentSong: number[] = [];
        if(keepFirstSong) { currentSong = shuffledSongs.splice(0, 1); }
        
        let currentIndex = shuffledSongs.length, randomIndex;

        while (currentIndex > 0) {
            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex--);
        
            // And swap it with the current element.
            [shuffledSongs[currentIndex], shuffledSongs[randomIndex]] = [shuffledSongs[randomIndex], shuffledSongs[currentIndex]];
        }

        if(keepFirstSong) { shuffledSongs.unshift(currentSong[0]); }
        return shuffledSongs;
    }

    
    private getCurrentPlaylist() { return this.playlists[this.userInfo.current.playlist]; }
    private getCurrentSong() { return this.songs[this.userInfo.current.song.id]; }


    sendDisplayData(event: Event | undefined = undefined) {
        const detail = { 
            song: () => this.getCurrentSong(),
            playlistId: () => this.userInfo.current.playlist
        }


        this.window.dispatchEvent(new CustomEvent(EventNames.display.data, { detail }));
    }


    sendSongOptionsData(event: Event | undefined = undefined) {
        
        const detail = { 
            removeSongFunc: (playlistId: number, songId: number, index: number) => { this.removeSong(playlistId, songId, index); },
            addToQueueFunc: (songId: number) => { 
                if(this.songs.hasOwnProperty(songId)) {
                    this.userInfo.current.queue.user.push(songId); this.updateData(); this.sendQueueData(); 
                }
            }
        }


        this.window.dispatchEvent(new CustomEvent(EventNames.options.data, { detail }));
    }


    sendKeysData(event: Event | undefined = undefined) {
        const detail = {
            changeFunction: (key: string, data: any) => this.changeKey(key, data),
            removeFunction: (key: string) => this.removeKey(key),
            functions: () => this.functionNames,
            addFunction: () => this.addKey(),
            keys: () => this.userInfo.keys
        }

        this.window.dispatchEvent(new CustomEvent(EventNames.settings.keys.data, { detail }))
    }


    sendCoverData(event: Event | undefined = undefined) {
        window.dispatchEvent(new CustomEvent(EventNames.playlist.cover.data, { detail: { playlist: () => this.getCurrentPlaylist() }}));
    }


    sendVolumeData(event: Event | undefined = undefined) {
        if(!this.userInfo.current.hasOwnProperty("volume")) {
            this.userInfo.current.volume = 50;
        }

        const detail = {
            volume: () => this.userInfo.current.volume,
            setVolume: (volume: number) => this.setVolume(volume),
        }

        this.window.dispatchEvent(new CustomEvent(EventNames.controls.volume.data, { detail }))
    }


    sendQueueData(event: Event | undefined = undefined) {
        const playlist = this.getCurrentPlaylist();
        const currentQueue = this.userInfo.current.queue;
        const backlogQueueSize = 4; // Incl. currentSong
        const queue: any = [];

        
        let userIndex = 0, autoIndex = 0;
        if(this.userInfo.current.song.id !== -1) {
            queue.push(this.getCurrentSong());
        }

        while(queue.length < backlogQueueSize) {
            if(currentQueue.user.length > userIndex) {
                queue.push(this.songs[currentQueue.user[userIndex++]]);
            } else if (currentQueue.auto.length > autoIndex) {
                queue.push(this.songs[currentQueue.auto[autoIndex++]]);
            } else break;
        }

        const detail = {
            playlist: () => playlist,
            queue: () => queue,
        }


        this.window.dispatchEvent(new CustomEvent(EventNames.queue.data, { detail }));
    }


    /** TODO::change to 1 event for home and side bar */ 
    sendAllPlaylistData(event: Event | undefined = undefined) {
        const detail = { playlists: () => this.playlists }


        this.window.dispatchEvent(new CustomEvent(EventNames.library.home.data, { detail }));
        this.window.dispatchEvent(new CustomEvent(EventNames.library.side.data, { detail }));
    }


    sendPlaylistOptionsData(event: Event | undefined = undefined) {
        const detail = { 
            removePlaylistFunc: (playlistId: number) => { 
                if(!this.playlists.hasOwnProperty(playlistId) || playlistId === 0) { return; }
                delete this.playlists[playlistId];
                this.updateData();
                this.sendAllPlaylistData();
            },
            addToQueueFunc: (playlistId: number) => { 
                if(!this.playlists.hasOwnProperty(playlistId)) { return; }
                this.userInfo.current.queue.user = this.userInfo.current.queue.user.concat(this.playlists[playlistId].songs); 
                this.updateData(); 
                this.sendQueueData();
            }
        }

        this.window.dispatchEvent(new CustomEvent(EventNames.options.playlist.data, { detail }));
    }


    sendPlayData(event: Event | undefined = undefined) {
        const detail = {
            paused: () => this.userInfo.current.paused,
            togglePause: () => this.togglePause(!this.userInfo.current.paused)
        };


        this.window.dispatchEvent(new CustomEvent(EventNames.controls.play.data, { detail }));
    }


    sendLoopData(event: Event | undefined = undefined) {
        const detail = {
            loop: () => this.userInfo.current.loop,
            changeLoop: () => this.changeLoop((this.userInfo.current.loop + 1 < 3 ? this.userInfo.current.loop + 1 : 0))
        };


        this.window.dispatchEvent(new CustomEvent(EventNames.controls.loop.data, { detail }));
    }


    sendPlaylistData(id: number) {
        const songsFromPlaylist: any = [];


        if(id in this.playlists) {
            const playlistSongs = this.playlists[id].songs;
            const length = playlistSongs.length;


            for(let i = 0; i < length; i++) {
                let song = this.songs[playlistSongs[i]];
                songsFromPlaylist.push(song);
            }
        }


        const detail = {
            songs: () => songsFromPlaylist,
            playlist: () => this.playlists[id],
            playSpecificSong: (playlistId: number, songId: number, index: number) => { this.playSpecificSong(playlistId, songId, index); },
            removeSongFunc: (playlistId: number, songId: number, index: number) => { this.removeSong(playlistId, songId, index); },
            addToQueueFunc: (songId: number) => { this.userInfo.current.queue.user.push(songId); this.updateData(); this.sendQueueData(); }
        }


        this.window.dispatchEvent(new CustomEvent(EventNames.playlist.data, { detail }));
    }


    sendArrowData(event: Event | undefined = undefined) {
        const detail = {
            changeSongFunc: (indexCounter: number) => this.changeSong({ isTrusted: true, indexCounter: indexCounter }) }


        this.window.dispatchEvent(new CustomEvent(EventNames.controls.order.data, { detail }));
    }


    sendShuffleData(event: Event | undefined = undefined) {
        const detail = {
            shuffle: () => this.userInfo.current.shuffle,
            toggleShuffle: () => this.toggleShuffle(!this.userInfo.current.shuffle)
        }


        this.window.dispatchEvent(new CustomEvent(EventNames.controls.shuffle.data, { detail }));
    }


    sendRangeData(event: Event | undefined = undefined) {
        const currentSong = this.getCurrentSong();
        const detail = {
            songTime: () => currentSong === undefined ? 100 : currentSong.time,
            setTime: (val: number) => this.changeSongTime(val),
            time: () => this.userInfo.current.time,
            paused: () => this.userInfo.current.paused,
        }


        this.window.dispatchEvent(new CustomEvent(EventNames.controls.range.data, { detail }));
    }


    changeSongTime(time: number) {
        this.songController?.SetTime(time);
        this.userInfo.current.time = time;


        this.updateData();
        this.sendRangeData();
    }

    
    playSpecificSong(playlistId: number, songId: number, index: number) {
        const playlist = this.playlists[playlistId];
        if(playlist === undefined) { return; }


        const song = this.songs[songId];
        if(song === undefined) { return; }


        if(this.getCurrentPlaylist().id != playlistId) {
            this.changePlaylist({ playlistId });
        }


        this.userInfo.current.time = 0;
        this.userInfo.current.paused = false;
        if(this.getCurrentSong().id == songId) {
            this.songController?.SetTime(0);
            this.songController?.Toggle(this.userInfo.current.paused);
            this.updateData();
            this.sendRangeData();
            return;
        }


        if(!this.userInfo.current.shuffle) {
            const queue = this.userInfo.current.queue;
            const index = queue.auto.indexOf(songId);


            queue.auto.splice(0, index + 1);
        }

        this.userInfo.current.song = { id: songId, auto: true };
        this.changeSong({ isTrusted: true, indexCounter: 0 });
    }


    removeSong(playlistId: number, songId: number, index: number) {
        const playlist = this.playlists[playlistId];
        if(playlist === undefined) { return; }


        const songIndex = playlist.songs[index] == songId ? index : playlist.songs.indexOf(songId);
        playlist.songs.splice(songIndex, 1);


        this.updateData();
        if(playlist.songs.indexOf(songId) !== -1) { return; }


        const queue = this.userInfo.current.queue;
        const song = this.getCurrentSong();


        if(song.id === songId) { this.changeSong({ isTrusted: false, indexCounter: 1 }); }

        
        queue.auto = queue.auto.filter((v: number) => { return v != songId; });
        if(playlistId === 0) {
            queue.user = queue.user.filter((v: number) => { return v != songId; });
            delete this.songs[songId];
        }


        this.updateData();
        this.sendQueueData();
        this.sendDisplayData();
    }


    openModal(props: { playlistId: number }) {
        if(!this.playlists.hasOwnProperty(props.playlistId)) { return; }
        const pl = this.playlists[props.playlistId];
        window.dispatchEvent(new CustomEvent(EventNames.modal.edit, { detail: { playlistId: pl.id, name: pl.name, cover: pl.cover }}));
    }


    changePlaylist(props: { playlistId: number }) {
        if(!this.playlists.hasOwnProperty(props.playlistId)) { return; }

        
        this.userInfo.current.loop = this.userInfo.current.loop === 2 ? 1 : this.userInfo.current.loop; 
        this.userInfo.current.playlist = props.playlistId;
        this.userInfo.current.queue.user = [];
        this.userInfo.current.queue.auto = [];
        this.userInfo.current.paused = false;
        
        this.toggleShuffle(this.userInfo.current.shuffle);
        this.changeSong({ isTrusted: true, indexCounter: 0 });        
        this.togglePause(this.userInfo.current.paused);
        this.sendCoverData();
    }


    /**
     * ChangeSong is called whenever the next or previous song starts playing
     * This will be called automatically when a songs ends or when the user clicks on Next/ Prev button
     * @param props Contains which song to go to and if it was called by the user
     */
    changeSong(props: { isTrusted: boolean, indexCounter: number }): void {
        const currentPlaylist = this.getCurrentPlaylist();
        if(currentPlaylist.songs.length === 0) return; 


        const queue = this.userInfo.current.queue;
        let chosenId, removedId = -1;


        // Next Song
        if(props.indexCounter === 1) {
            this.userInfo.current.time = 0;


            // Called when singlelooping
            if(!props.isTrusted && this.userInfo.current.loop === 2) {
                chosenId = queue.user.length === 0 ? queue.auto[0] : queue.user[0];
                this.songController?.SetTime(0);
            } else {
                if(props.isTrusted && this.userInfo.current.loop === 2){
                    this.userInfo.current.loop = 1;
                    this.updateData();
                    this.sendLoopData();
                }


                if(queue.user.length !== 0) {
                    chosenId = queue.user.splice(0, 1)[0];
                    this.userInfo.current.song.auto = false;
                } else {
                    chosenId = queue.auto.splice(0, 1)[0];
                    this.userInfo.current.song.auto = true;
                }

                
                if(!props.isTrusted && removedId !== -1
                        && currentPlaylist.songs[currentPlaylist.songs.length - 1] === removedId) { 
                    this.userInfo.current.paused = this.userInfo.current.loop === 0;
                }
            }

        // Previous song
        } else if (props.indexCounter === -1) {
            this.userInfo.current.time = 0.0;
            let index = queue.user.length > 1
                ? currentPlaylist.songs.indexOf(queue.user[0])
                : currentPlaylist.songs.indexOf(queue.auto[0]);


            index = index <= 0 ? currentPlaylist.songs.length - 1 : index - 1;
            chosenId = currentPlaylist.songs[index];

            
            if (queue.user.length >= 1) {
                removedId = queue.user[0];
                queue.user[0] = chosenId;
                this.userInfo.current.song.auto = false;
            } else {
                queue.user = [];
                removedId = queue.auto[0];
                queue.auto[0] = chosenId;
                this.userInfo.current.song.auto = true;
                queue.auto.splice(queue.auto.length - 1, 1);
            }

        // Called when IndexCounter is 0, meaning it will start the current song in the playlist
        } else { chosenId = this.getCurrentSong().id; }


        // Add the playlist songs to the queue if the queue is running out
        if((queue.auto.length + queue.user.length) <= currentPlaylist.songs.length) {
            if(this.userInfo.current.shuffle) {
                if(removedId !== -1) {
                    queue.auto = queue.auto.concat(this.shuffleArray(currentPlaylist.songs, false));
                }
            } else {
                queue.auto = queue.auto.concat(currentPlaylist.songs);
            }
        }


        this.updateData();
        if(this.userInfo.current.song.id == chosenId && props.indexCounter !== 0) {
            this.songController?.SetTime(0);
            this.songController?.Toggle(this.userInfo.current.paused);
        } else {
            const chosenSong = this.songs[chosenId];
            this.userInfo.current.song.id = chosenId;
            switch(chosenSong.typeSite) {
                case 0: // YouTube
                    this.songController = new YouTubeController();
                    break;
                case 1: // SoundCloud
                    this.songController = new SoundCloudController();
                    break;
            }
            this.songController!.createPlayer(this, chosenSong);
        }


        this.sendQueueData();
        this.sendDisplayData();
        this.sendRangeData();
    }


    changeLoop(loop: number) {
        this.userInfo.current.loop = loop;

        
        this.updateData();
        this.sendLoopData();
    }


    togglePause(paused: boolean) {
        if(this.getCurrentPlaylist().songs.length === 0 && !paused) { return; }
        this.userInfo.current.paused = paused;
        this.userInfo.current.time = this.songController?.GetCurrentTime() || 0;
        this.songController?.Toggle(paused);


        this.updateData();
        this.sendPlayData();
        this.sendRangeData();
    }


    toggleShuffle(shuffle: boolean) {
        this.userInfo.current.shuffle = shuffle;
        let songs: number[] = this.getCurrentPlaylist().songs;
        if(!shuffle) {
            let empty: number[] = [];
            this.userInfo.current.queue.auto = empty.concat(songs);
        } else this.userInfo.current.queue.auto = this.shuffleArray(songs);


        this.updateData();
        this.sendQueueData();
        this.sendShuffleData();
    };


    setVolume(volume: number) {
        this.userInfo.current.volume = volume;

        this.songController?.SetVolume(volume);
        this.sendVolumeData();
    }


    addKey() {
        if(!this.userInfo.keys.hasOwnProperty("")) {
            this.userInfo.keys[""] = {
                type: "none",
                func: 0,
            }

            this.updateData();
            this.sendKeysData();
        }
    }


    updatePlaylist(props: { playlistId: number, name: string, cover: string }) {
        if(!this.playlists.hasOwnProperty(props.playlistId)) { return; }


        this.playlists[props.playlistId].cover = props.cover;
        this.playlists[props.playlistId].name = props.name;


        this.updateData();
        this.sendCoverData();
        this.sendQueueData();
        this.sendAllPlaylistData();
        this.sendPlaylistData(props.playlistId);
    }


    changeKey(oldKey: string, newData: {key: string, type: "none" | "alt" | "ctrl", func: number}) {
        if(this.userInfo.keys.hasOwnProperty(oldKey)) {
            if(oldKey !== newData.key) { delete this.userInfo.keys[oldKey]; }
            this.userInfo.keys[newData.key] = {
                type: newData.type,
                func: newData.func,
            }


            this.updateData();
            this.sendKeysData();
        }
    }


    removeKey(key: string) {
        if(this.userInfo.keys.hasOwnProperty(key)) {
            delete this.userInfo.keys[key];
            this.updateData();
            this.sendKeysData();
        }
    }


    addSong(props: { detail: { playlistId: number, code: string, typeSite: number }}) {
        const playlistId = props.detail.playlistId;


        if(this.playlists.hasOwnProperty(playlistId)) {
            const code = props.detail.code;
            let songId = this.userInfo.songAmount;


            let shouldAddSong = true;
            const songKeys = Object.keys(this.songs);
            for (let key in songKeys) {
                if (songKeys[key] === undefined) { continue; }

                const songKey = parseInt(songKeys[key]);
                if (this.songs[songKey].code == code) {
                    shouldAddSong = false;
                    songId = parseInt(key);
                    break;
                }
            }


            if(shouldAddSong) {
                // Add the song- and artist name (if it's available)
                this.addVideoData(code, async (data: any) => {
                    if(data === undefined) { 
                        this.window.dispatchEvent(new CustomEvent(EventNames.msgmodal.message, { detail: { message: "Song can't be added because it was disabled by the owner" }}))
                        return;
                    }

                    this.songs[songId] = {
                        played: 0,
                        id: songId,
                        code: code,
                        name: data.name,
                        time: data.time,
                        cover: data.cover,
                        artist: data.artist,
                        typeSite: props.detail.typeSite
                    }
    
                    this.userInfo.songAmount++;
                    const songAmount = this.userInfo.songAmount;

                    this.userInfo.current.queue.auto.push(songId);
                    this.playlists[playlistId].songs.push(songId);
    
                    if(songAmount === 1) {
                        this.userInfo.current.song = { auto: true, id: songId };
                        this.changeSong({ isTrusted: true, indexCounter: 0 });
                    }

                    await this.updateData();

                    const queue = this.userInfo.current.queue;
                    if(songAmount === 1) { this.sendDisplayData(); }
                    if((queue.auto.length + queue.user.length) < 4) { this.sendQueueData(); }
                    this.sendPlaylistData(playlistId);
                }, props.detail.typeSite);
            } else {
                this.userInfo.current.queue.auto.push(songId);
                this.playlists[playlistId].songs.push(songId);
                this.updateData();

                const queue = this.userInfo.current.queue;
                if((queue.auto.length + queue.user.length) < 4) { this.sendQueueData(); }
                this.sendPlaylistData(playlistId);
            }
        }
    }


    /**
     * Add song data to a song without that isn't played right now
     * @param songId
     * @param callback A callback function that needs to be called once it has been added
     * @param type The site it comes from
     */
    async addVideoData(code: string, callback: CallableFunction, type: number) {
        if(type === 1) {
            fetch("https://soundcloud.com/oembed?url=https://soundcloud.com/" + code + "&format=json")
                .then(async (response) => {
                    let data: any = { };
                    if(response.status === 200) {
                        response.json().then(body => {
                            data.artist = body.author_name;
                            data.name = body.title.split(" by " + data.artist)[0];
                            data.cover = body.thumbnail_url.split("artworks-")[1].split("-t")[0];
                            callback(data);
                        });
                    } else {
                        let body = code.split("/");
                        const artist = body[0].split("-");
                        const name = body[1].split("-");

                        data.artist = "";
                        data.name = "";

                        const upperCaseFirstLetter = (text: string) => {
                            return text.charAt(0).toUpperCase() + text.substring(1).toLowerCase();
                        }

                        for(let type in artist) {
                            if(data.artist !== "") { data.artist += " "; }
                            data.artist += upperCaseFirstLetter(artist[type]);
                        }

                        for(let type in name) {
                            if(data.name !== "") { data.name += " "; }
                            data.name += upperCaseFirstLetter(name[type]);
                        }

                        callback(data);
                    }
                });
        } else if (type === 0) {
            let onReadyTimeout = setTimeout(() => {});
            let onReady = (event: any) => {
                const videoPlayer = event.getInternalPlayer();

                if(videoPlayer === null || videoPlayer === undefined) {
                    callback(undefined);
                    return;
                }

                videoPlayer.setPlaybackQuality("small");
    
                const videoData = videoPlayer.getVideoData();
                const data = {
                    time: videoPlayer.getDuration(),
                    artist: videoData['author'],
                    name: videoData['title'],
                    cover: undefined,
                }
    
                if(data.artist.length === 0) { data.artist = "Unknown"; }
                this.setSongDownloader(<></>);
                callback(data);
            };

            const onError = (event: any) => {
                clearTimeout(onReadyTimeout);
                if(event == 150 || event == 101 || event == 100) {
                    callback(undefined);
                    return;
                }
            }

    
            const config = { youtube: {
                videoId: code,
                vq: "small",
                width: '1',
                height: '1',
                playerVars: {
                    // https://developers.google.com/youtube/player_parameters
                    enablejsapi: 1,
                    disablekb: 1,
                    controls: 0,
                    autoplay: 0,
                    vq: "tiny",
                    start: 0,
                    loop: 0
                }, }
            };
    
    
            this.setSongDownloader(<ReactPlayer onError={onError} onReady={(e) => onReadyTimeout = setTimeout(() => onReady(e), 200)}
                config={config} url={"https://www.youtube.com/watch?v=" + code} />);
        }
    }


    deleteSong(props: { detail: { songIndex: number }}) {
        const songIndex = props.detail.songIndex;


        this.playlists[this.userInfo.current.playlist].songs.splice(songIndex, 1);
        this.updateData();
    }


    addPlaylist(){
        if(Object.keys(this.playlists).length >= 100) { return; }

        const nextPlaylistId = this.userInfo.playlistAmount++;
        this.playlists[nextPlaylistId] = {
            id: nextPlaylistId,
            songs: [],
            cover: null,
            playCount: 0,
            isFavorite: true,
            name: `Playlist ${nextPlaylistId}`,
            lastPlayed: Date.now()
        };

        this.updateData();
        this.sendAllPlaylistData();
    }


    /** 
     * Change the order of the songs in the playlists
     * @TODO change current song when the current song playing changed pos 
     */
    changeOrder(props: { detail: { playlistId: number, order: number[]}}) {
        const playlistId = props.detail.playlistId; // @ts-ignore
        const newOrder = props.detail.order;


        if(!this.playlists.hasOwnProperty(playlistId)) { return; }


        this.playlists[playlistId].songs = newOrder;
        this.updateData();
        this.sendPlaylistData(playlistId);
    }


    checkKey(event: KeyboardEvent) {
        if(document.activeElement !== null && document.activeElement.tagName === "INPUT") { return; }

        if(this.userInfo.keys.hasOwnProperty(event.code)) {
            const key = this.userInfo.keys[event.code];

            let shouldRunFunction = (key.type === "ctrl" && event.ctrlKey)
                || (key.type === "alt" && event.altKey)
                || (key.type === "none");

            if(shouldRunFunction) { this.functionNames[key.func].func(); }
        }
    }
}


interface Song {
    [key: number]: {
        id: number,
        cover?: string,
        name?: string,
        code: string,
        time?: number,
        artist?: string,
        typeSite: number,
        played: number,
    }
}


interface Playlist {
    [key: number]: {
        id: number,
        cover: string | null,
        songs: number[],
        playCount: number,
        isFavorite: boolean,
        name: string,
        lastPlayed: number
    }
}


interface UserInfo {
    songAmount: number,
    playlistAmount: number,
    user: { name: string | null },
    auth: { soundcloud: string | null, spotify: string | null, youtube: string | null},
    keys: {
        [key: string]: {
            type: "ctrl" | "alt" | "none"
            func: number
        }
    }
    current: { time: number, song: { id: number, auto: boolean }, playlist: number, paused: boolean, loop: number, shuffle: boolean, volume: number,
        queue: {
            auto: number[],
            user: number[]
        }
    }
}


export default DataController;