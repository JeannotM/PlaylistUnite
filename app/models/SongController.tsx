import DataController from "./DataController";

abstract class SongController {
    videoPlayer: any;

    /** Initialise the player and add all callback functions */
    abstract createPlayer(dataController: DataController, song: any): void;
    abstract Toggle(isPaused: boolean): void;
    
    abstract SetVolume(volume: number): void;
    abstract SetTime(time: number): void;
    abstract GetCurrentTime(): number;
    abstract GetDuration(): number;
}

export default SongController;