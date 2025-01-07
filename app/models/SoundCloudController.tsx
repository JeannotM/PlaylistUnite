import EventNames from "../components/EventNames/EventNames";
import DataController from "./DataController";
import SongController from "./SongController";
import ReactPlayer from "react-player";

class SoundCloudController extends SongController {
    createPlayer(dataController: DataController, song: any) {
        const currentData = dataController.userInfo.current;
        const url = "https://soundcloud.com/" + song.code;
        const onReady = (data: any) => {
            this.videoPlayer = data.player.player;
            this.SetVolume(currentData.volume);
            this.SetTime(currentData.time);
            this.Toggle(currentData.paused);

            if(song.time === undefined) { 
                song.time = this.videoPlayer.getDuration();
                dataController.sendRangeData();
                dataController.sendPlaylistData(dataController.userInfo.current.playlist);
            }
        }


        const config = { soundcloud: {
            // eslint-disable-next-line camelcase
            auto_play: (currentData.paused ? 0 : 1),
            height: 200,
            width: 200
        } }


        const onEnd = (data: any) => {
            window.dispatchEvent(new CustomEvent(EventNames.song.change, { detail: {
                isTrusted: false,
                indexCounter: 1,
            }}));
        }

        // @ts-ignore
        dataController.setVideoPlayer(<ReactPlayer onReady={onReady} onEnded={onEnd} config={config} width={200} height={200} url={url} />);
    }

    SetVolume(volume: number): void {
        if(this.videoPlayer === undefined) { return; }
        this.videoPlayer.setVolume(volume * 0.01);
    }

    Toggle(isPaused: boolean): void {
        if(this.videoPlayer === undefined) { return; }
        if(isPaused) {
            this.videoPlayer.pause();
        } else {
            this.videoPlayer.play();
        }
    }

    SetTime(time: number): void {
        if(this.videoPlayer === undefined) { return; }
        this.videoPlayer.seekTo(time); 
    }
    GetCurrentTime(): number { return this.videoPlayer !== undefined ? this.videoPlayer.getCurrentTime() : 0; }
    GetDuration(): number { return this.videoPlayer !== undefined ? this.videoPlayer.getDuration() : 100; }
}


export default SoundCloudController;