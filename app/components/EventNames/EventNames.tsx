const EventNames = {
    settings: {
        keys: {
            register: "keysregister",
            data: "keysdata",
        },
        quality: {
            register: "qualityregister",
            data: "qualitydata",
        }
    },
    modal: {
        open: "modalopen",
        edit: "modaledit",
        save: "modalsave",
    },
    controls: {
        volume: {
            register: "volumeregister",
            data: "volumedata",
        },
        play: {
            register: "playregister",
            data: "playdata",
        },
        order: {
            register: "orderregister",
            data: "orderdata"
        },
        shuffle: {
            register: "shufleregister",
            data: "shufledata",
        },
        loop: {
            register: "loopregister",
            data: "loopdata",
        },
        range: {
            register: "rangeregister",
            data: "rangedata"
        },
        register: "controlsregister",
        data: "controlsdata",
    },
    display: {
        register: "displayregister",
        data: "displaydata",
    },
    msgmodal: {
        message: "msgmodalmessage",
    },
    song: {
        change: "songchange",
        toggle: "songplaytoggle", // Song Paused
        delete: "delete",
        add: "songadd"
    },
    playlist: {
        add: "playlistadd",
        play: "playlistplay",
        register: "playlistregister",
        change: "playlistchange", // Change order
        data: "playlistdata",
        cover: {
            register: "coverregister",
            data: "coverdata",
        },
    },
    options: {
        register: "optionsregister",
        playlist: {
            register: "optionsplaylistregister",
            change: "optionsplaylist",
            data: "optionsplaylistdata",
        },
        song: "optionssong",
        data: "optionsdata",
    },
    library: {
        side: {
            register: "librarysideregister",
            data: "librarysidedata"
        },
        home: {
            register: "libraryhomeregister",
            data: "libraryhomedata"
        }
    },
    queue: {
        register: "queueregister",
        data: "queuedata",
        loop: "looptoggle",
        shuffle: "shuffle",
    }
}

export default EventNames;