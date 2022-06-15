const axios = require('axios')
const FormData = require('form-data')

const upload = async (image_url, authorization, channel_id) => {

    const form = new FormData()

    const payload_json = {
        'content' : image_url
    }

    form.append('payload_json',JSON.stringify(payload_json))

    const headers = {
        authorization: authorization,
        'Content-Type': `multipart/form-data; boundary=${form._boundary}`,
        'Cache-Control': 'no-cache'

    }

    const url = `https://discord.com/api/v9/channels/${channel_id}/messages`

        const response = await axios(
            {method: 'POST',
            url,
            data: form,
            headers: headers,
        })
        const data = response.data
        const embeds = data.embeds
        if(!embeds) throw new Error('proxy failed!')
        else {
            return embeds[0].thumbnail.proxy_url
        }

}


module.exports = upload