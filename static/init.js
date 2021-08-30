const initPlayer = (link) =>  {
    let player = jwplayer("play");
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