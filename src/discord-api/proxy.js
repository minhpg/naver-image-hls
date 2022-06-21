const axios = require('axios')

const proxy = async (image_url, authorization, channel_id) => {

    const payload_json = {
        'content': image_url
    }

    const headers = {
        authorization: authorization,
        'Cache-Control': 'no-cache'
    }

    const url = `https://discord.com/api/v9/channels/${channel_id}/messages`
    while (true) {
        const response = await axios(
            {
                method: 'POST',
                url,
                data: payload_json,
                headers: headers,
            })
        const data = response.data
        console.log(response.data)
        const embeds = data.embeds
        if (embeds.length==0) {
            await new Promise(r => setTimeout(r, 3000));
            continue} //throw new Error('proxy failed!')
        else {
            if (embeds[0].thumbnail) return embeds[0].thumbnail.proxy_url
        }
    }


}


proxy('http://post-phinf.pstatic.net/MjAyMjA2MjFfMTA2/MDAxNjU1Nzk5MDM2NDQ0.FKsFgosBNK2DFUp9efvN6pudCprw9n4v2wzaLQy9ojQg.iVbk5Ovc9tBZ-AdT-WUGcJsN07KVisrJHcEUW6MpsBsg.PNG/video0.jpeg','OTE5ODMxODQxMTIzNTAwMDUy.YbbiXw.TUjkhscQIF0s6bIulzcvKYs6QY4','919832247039848471')

module.exports = proxy