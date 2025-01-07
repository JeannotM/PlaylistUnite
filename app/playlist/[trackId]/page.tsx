import styles from './page.module.scss'
import Search from '../../components/Search/Search';
import PlaylistSongs from '@/app/components/PlaylistSongs/PlaylistSongs';
import PlayPlaylistButton from '@/app/components/PlayPlaylistButton/PlayPlaylistButton';

export default function Playlist({params}: any) { 
  return (
  <div className={styles.playlist_container}>
    <div className={styles.button_container}>
      <PlayPlaylistButton playlistId={params.trackId} />
      <Search playlistId={params.trackId} />
    </div>

    <div className={styles.playlist_row_container}>
      <div className={styles.playlist_row}>{/** @ts-ignore */}
        <div className={styles.playlist_row_item} style={{"--col-index": "0"}}>
            <div data-header={1} className={styles.song_id}>#</div>
            <div data-header={1} className={styles.song_origin}>Origin</div>
            <div data-header={1} className={styles.song_title}>Title</div>
            <div data-header={1} className={styles.song_time}>Time</div>
            <div data-header={1} className={styles.song_options}></div>
        </div>
        <hr />
      </div>

      <div className={styles.playlist_scrollable}>
        <div id="playlist_row" className={styles.playlist_row}>
          <PlaylistSongs parentStyle={styles} trackId={params.trackId} />
        </div>
      </div>
    </div>
  </div>);
}