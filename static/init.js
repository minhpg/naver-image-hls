const initPlayer = (link) =>  {
    let player = jwplayer("player");
    let object = {
        playbackRateControls: true,
        controls: true,
        volume: 75,
        stretching: "uniform",
        width: "100%",
        height: "100%",
        file: link,
        type: "hls",
        preload: "auto",
        skin: {
            name:'custom',
            url: '/static/custom.css',
        }
    };
    player.setup(object);
    player.addButton("/static/icons/skip-forward.svg", "Skip Intro", () => {
        skip_time = player.getPosition() + 90;
        player.seek(skip_time)
    }, "skipButton");
    player.addButton("/static/icons/forward.svg", "FF 5s", () => {
        player.seek(player.getPosition() + 5);
    }, "Tua tiếp 5s");
    player.addButton("/static/icons/backward.svg", "RW 5s", () => {
        player.seek(player.getPosition() - 5);
    }, "Tua lại 5s");
    if (Hls.isSupported() && p2pml.hlsjs.Engine.isSupported()) {
        var engine = new p2pml.hlsjs.Engine();
        jwplayer_hls_provider.attach();
        p2pml.hlsjs.initJwPlayer(player, {
            liveSyncDurationCount: 7, // To have at least 7 segments in queue
            loader: engine.createLoaderClass(),
        });
    }
    player.on('ready', () => {
        console.log(player)
    });
}

const getInfo = () => {
    return new Promise((resolve, reject) => {
        initPlayer(`/playlist/${id}/playlist.m3u8`)
    })
}
getInfo().catch((err) => {
    console.error(err)
})