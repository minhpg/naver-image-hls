const axios = require('axios')

const upload = async (image_url, authorization, channel_id) => {

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
        if (!embeds) throw new Error('proxy failed!')
        else {
            if (embeds[0].thumbnail) return embeds[0].thumbnail.proxy_url

        }
    }


}


module.exports = upload