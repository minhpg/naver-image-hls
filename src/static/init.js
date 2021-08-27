const isIos = () => {
    return _iOSDevice = /iPhone|iPod|iPad|Mac/.test(navigator.platform);
}
const loadScript = (src) => {
    return new Promise((resolve, reject) => {
        const script= document.createElement('script');
        script.type= 'text/javascript';
        script.onload = () => {
            resolve("OK");
        };
        script.onerror = () => {
            console.log("Failed to load script", src);
            resolve("ERROR");
        };
        script.src = src;
        document.head.appendChild(script);
    });
}
const getParams = (name, url) => {
    if (!url) url = location.href;
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(url);
    return results == null ? null : results[1];
}
const loadStyle = (src) => {
    return new Promise((resolve, reject) => {
        const link= document.createElement('link');
        link.rel = 'stylesheet';
        link.type= 'text/css';
        link.onload = () => {
            resolve();
        };
        link.onerror = () => {
            console.log("Failed to load CSS", src);
            reject();
        };
        link.href = src;
        document.head.appendChild(link);
    });
}
const showError = async(msg) => {
    await loadStyle("/static/error.css");
    $("body").html(`<div class="box">
        <div class="box__ghost">
        <div class="symbol"></div>
        <div class="symbol"></div>
        <div class="symbol"></div>
        <div class="symbol"></div>
        <div class="symbol"></div>
        <div class="symbol"></div>
        
        <div class="box__ghost-container">
            <div class="box__ghost-eyes">
            <div class="box__eye-left"></div>
            <div class="box__eye-right"></div>
            </div>
            <div class="box__ghost-bottom">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            </div>
        </div>
        <div class="box__ghost-shadow"></div>
        </div>
        
        <div class="box__description">
        <div class="box__description-container">
            <div class="box__description-title">Whoops!</div>
            <div class="box__description-text">${msg}</div>
        </div>
        
        </div>
    </div>`);
    await loadScript("/static/error.js");
}
const initPlayer = (link) =>  {
    let player = jwplayer("player");
    let object = {
        playbackRateControls: [0.75, 1, 1.25, 1.5, 2],
        controls: true,
        volume: 75,
        stretching: "uniform",
        width: "100%",
        height: "100%",
        file: link,
        type: "hls",
        preload: "auto",
        // image: `/embed/thumbnail/${id}`,
        skin: {
            name:'animevsub',
            url: '/static/animevsub.css',
        }
    };
    player.setup(object);
    player.addButton("/static/icons/skip-forward.svg", "Skip OP/ED", function() {
        skip_time = player.getPosition() + 90;
        player.seek(skip_time)
    }, "skipButton");
    player.addButton("/static/icons/forward.svg", "Tua tiếp 5s", function() {
        player.seek(player.getPosition() + 5);
    }, "Tua tiếp 5s");
    player.addButton("/static/icons/backward.svg", "Tua lại 5s", function() {
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
    player.on('ready', function() {
        $('#loading').hide(300);
    });
}

function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

const generatePlaylist = (playlist) => {
    let m3u8 = "#EXTM3U\n#EXT-X-VERSION:3\n";
    for(const item of playlist) {
        m3u8 += `#EXT-X-STREAM-INF:BANDWIDTH=${item.bandwidth},RESOLUTION=${item.resolution}\n`;
        let url = generateM3u8(item.content, item.duration);
        m3u8 += `${url}\n`;
    }
    const url = URL.createObjectURL(new Blob([m3u8], {type: "application/x-mpegURL"}));
    initPlayer(url);
}
const generateM3u8 = (content, duration) => {
    let m3u8 = `#EXTM3U\n#EXT-X-VERSION:3\n#EXT-X-TARGETDURATION:${duration}\n#EXT-X-PLAYLIST-TYPE:VOD\n`;
    for(const item of content) {
        m3u8 += `#EXTINF:${item.extinf}\n`;
        m3u8 += `https://${getRandomDomain()}/hls/${item.filename}\n`;
    }
    m3u8 += "#EXT-X-ENDLIST";
    const url = URL.createObjectURL(new Blob([m3u8], {type: "application/x-mpegURL"}));
    return url;
}

const getRandomDomain = () => {
    const domain_array = [
        'fbcdns.net',
        'cdnfb.live',
        'lotuscdn.live',
        'lotuscdn.video',
        'onepluscdn.video',
        'streamcdn.video',
        'cdnfb.video',
        'onepluscdn.live',
        'googleclouds.live',
        'googleclouds.video',
        'googlecloud.video',
    ]
    const domain = domain_array[Math.floor(Math.random() * domain_array.length)]
    return domain
}

const getInfo = () => {
    return new Promise((resolve, reject) => {
        // $.ajax({
        //     type: "GET",
        //     url: `/playlist/json/${id}`,
        //     success: function(data) {
        //         if(data.status == 'ok') {
        //             if(false) {generatePlaylist(data.content.playlist)}
        //             else {};
        //         } else {
        //             reject(data.msg);
        //         }
        //     },
        //     error: function() {
        //         reject(data.message);
        //     }
        // });
        initPlayer(`/playlist/${id}/playlist.m3u8`)
    })
}
getInfo().catch((err) => {
    showError(err);
})