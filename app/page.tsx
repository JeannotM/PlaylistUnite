"use client"
import styles from './page.module.scss'
import React, { useCallback, useEffect, useState } from 'react';
import EventNames from './components/EventNames/EventNames';
import PlaylistItem from './components/PlaylistItem/PlaylistItem';
import { DelayedEffect } from './models/DelayedEffect';

export default function Home() {
  const [playlists, setPlaylists] = useState({});
  const [keys, setKeys] = useState([]);
  const data = useCallback((event: Event) => { // @ts-ignore
    const playlistData = event.detail.playlists();
    setPlaylists(playlistData); // @ts-ignored
    setKeys(Object.keys(playlistData));
  }, []);

  
  function AddPlaylist() {
    window.dispatchEvent(new CustomEvent(EventNames.playlist.add));
  }


  DelayedEffect(EventNames.library.home, data);
  return (
    <main className={styles.page}>
      <div className={styles.title_container}>
        <h1 className={styles.title}>Recente</h1>
        <button onClick={AddPlaylist}>+ Add</button>
      </div>
      <div className={styles.playlist_containers}>
        <div className={styles.playlist_items}>
          {keys.map((key, index) => ( <PlaylistItem key={index} playlist={playlists[key]} /> ))}
        </div>
      </div>
    </main>
  )  
}