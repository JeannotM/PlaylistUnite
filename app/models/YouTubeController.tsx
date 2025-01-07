import EventNames from "../components/EventNames/EventNames";
import DataController from "./DataController";
import SongController from "./SongController";
import ReactPlayer from "react-player";

class YouTubeController extends SongController {
    createPlayer(dataController: DataController, song: any) {
        const currentData = dataController.userInfo.current;
        const onReady = (data: any) => {
            this.videoPlayer = data.getInternalPlayer();

            this.videoPlayer.setPlaybackQuality("small");
            this.SetVolume(currentData.volume);
            this.SetTime(currentData.time);
            this.Toggle(currentData.paused);

            if(song.time === undefined) {
                const videoData = this.videoPlayer.getVideoData();
                song.time = this.videoPlayer.getDuration();
                song.artist = videoData['author'];
                song.name = videoData['title'];

                dataController.sendDisplayData();
                dataController.sendRangeData();
            }
        }

        const opts = { youtube: {
            vq: "small",
            width: '200',
            height: '200',
            playerVars: {
                // https://developers.google.com/youtube/player_parameters
                autoplay: currentData.paused ? 0 : 1,
                start: currentData.time,
                vq: "small",
                enablejsapi: 1,
                disablekb: 1,
                controls: 0,
                loop: 0,
            }, }
        };

        const onEnd = () => {
            window.dispatchEvent(new CustomEvent(EventNames.song.change, { detail: {
                isTrusted: false,
                indexCounter: 1,
            }}));
        }
        // @ts-ignore
        dataController.setVideoPlayer(<ReactPlayer onReady={onReady} config={opts} onEnded={onEnd} url={"https://www.youtube.com/watch?v=" + song.code} />);
    }

    Toggle(isPaused: boolean): void {
        if(this.videoPlayer === undefined) { return; }
        if(isPaused) {
            this.videoPlayer.pauseVideo();
        } else {
            this.videoPlayer.playVideo();
        }
    }

    SetVolume(volume: number): void {
        if(this.videoPlayer === undefined) { return; }
        this.videoPlayer.setVolume(volume); 
    }

    SetTime(time: number): void {
        if(this.videoPlayer === undefined) { return; }
        this.videoPlayer.seekTo(time, true); 
    }
    
    GetCurrentTime(): number { return this.videoPlayer !== undefined ? this.videoPlayer.getCurrentTime() : 0; }
    GetDuration(): number { return this.videoPlayer !== undefined ? this.videoPlayer.getDuration() : 100; }
}

export default YouTubeController;