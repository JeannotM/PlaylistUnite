import './globals.css'
import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import 'bootstrap/dist/css/bootstrap.css'
import styles from './layout.module.scss';
import PlayerMainFrame from '@/app/components/PlayerMainFrame/PlayerMainFrame';
import Display from './components/Display/Display'
import ShuffleButton from './components/ControlButtons/ShuffleButton'
import ArrowButton from './components/ControlButtons/ArrowButton'
import PlayButton from './components/ControlButtons/PlayButton'
import LoopButton from './components/ControlButtons/LoopButton'
import TimeRange from './components/ControlButtons/TimeRange'
import VolumeRange from './components/ControlButtons/VolumeRange'
import Link from 'next/link'
import Image from 'next/image'
import PlaylistCover from './components/PlaylistCover/PlaylistCover'
import Queue from './components/Queue/Queue'
import LibraryList from './components/LibraryList/LibraryList'
import Modal from './components/Modal/Modal';
import OptionsMenu from './components/SongOptionsMenu/SongOptionsMenu';
import SongOptionsMenu from './components/SongOptionsMenu/SongOptionsMenu';
import PlaylistOptionsMenu from './components/PlaylistOptionsMenu/PlaylistOptionsMenu';
import MessageModal from './components/MessageModal/MessageModal';

const roboto = Roboto({
  weight: ['300', '500', '700', '900'],
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: 'Playlist Unite',
  description: '',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={roboto.className}>
      <body>
        <div className={styles.container}>
          <Modal styles={styles} />
          <PlaylistOptionsMenu />
          <SongOptionsMenu />
          <MessageModal />

          {/* Top Container */}
          <div className={styles.top_container}>
            <PlayerMainFrame />

            {/* Left Container*/}
            <div className={styles.left_container} data-is-collapsed="1">
              <Link href="/" className={styles.playlist_item}>
                  <Image src={"/home.svg"} alt="home image" width={30} height={30} />
                  <p>Home</p>
              </Link>
              <Link href="/playlist/0" className={styles.playlist_item}>
                  <Image src={"/music_note.svg"} alt="tracks image" width={30} height={30} />
                  <p>Tracks</p>
              </Link>
              <Link href="/settings" className={styles.playlist_item}>
                  <Image src={"/settings.svg"} alt="settings image" width={30} height={30} />
                  <p>Settings</p>
              </Link>

              <LibraryList parent={styles.left_container} styles={styles} />
            </div>

            {/* Middle Container */}
            <div className={styles.middle_container}>
              {children}
            </div>

            {/* Right Container */}
            <div className={styles.right_container}>
              <PlaylistCover />
              <Queue />
            </div>

            {/* Alt Side Controls */}
            <div className={styles.side_controls}>
              <ShuffleButton />
              <ArrowButton reversed={true} />
              <PlayButton />
              <ArrowButton />
              <LoopButton />
          </div>
        </div>


        {/* Bottom Container */}
        <div className={styles.bottom_container}>
            <div className={styles.control_panel}>
                <Display />
                <div className={styles.controls}>
                    <div className={styles.control_button}>
                        <ShuffleButton />
                        <ArrowButton reversed={true} />
                        <PlayButton />
                        <ArrowButton />
                        <LoopButton />
                    </div>
                    <TimeRange className={styles.time_range} />
                </div>
                <VolumeRange className={styles.volume_range} />
            </div>
            

            <div className={styles.phone_tabs}>
                <Link href="/">
                    <Image src={"/home.svg"} alt="home image tab" width={30} height={30} />
                </Link>
                <Link href="/playlist/0">
                    <Image src={"/music_note.svg"} alt="tracks image tab" width={30} height={30} />
                </Link>
                <Link href="/settings">
                    <Image src={"/settings.svg"} alt="settings image tab" width={30} height={30} />
                </Link>
            </div>
        </div>
        </div>
      </body>
    </html>
  )
}
