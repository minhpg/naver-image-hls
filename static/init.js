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
    };
    player.setup(object);
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
        initPlayer(`/api/m3u8/${id}/master.m3u8`)
    })
}
getInfo().catch((err) => {
    console.error(err)
})