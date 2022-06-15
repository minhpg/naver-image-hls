const axios = require('axios')
const FormData = require('form-data')
const fs = require('fs')

const upload = async (file, authorization, channel_id) => {

    const form = new FormData()

    const payload_json = {
        'content' : ''
    }

    form.append('payload_json',JSON.stringify(payload_json))
    form.append('files[0]',fs.createReadStream(file))


    const headers = {
        authorization: authorization,
        'Content-Type': `multipart/form-data; boundary=${form._boundary}`,
    }

    const url = `https://discord.com/api/v9/channels/${channel_id}/messages`

        const response = await axios(
            {method: 'POST',
            url: url,
            data: form,
            headers: headers,
        })
        const data = response.data
        const attachments = data.attachments
        if(!attachments) throw new Error('upload failed!')
        else {
            console.log(`uploaded ${file} to ${attachments[0].proxy_url}`)
            return attachments[0].proxy_url
        }

}


module.exports = upload