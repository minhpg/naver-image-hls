const client = require('./discordClient')

const upload = async (file, channel_id='734808288239288324') => {
    await client.login('ODkzMTM4NjI1NzkxOTQ2ODQ1.YVXGKg.Mq_gOrrwTlbICRARqjLMleatJak');

    const channel = await client.channels.get(channel_id)
    const message = await channel.send('', { files: [file] });
    const attachments = message.attachments
    if(attachments){
        const url = attachments.array()[0].proxyURL
        console.log(`${file} uploaded to ${url}`)
        return attachments.array()[0].proxyURL
    }
    await client.destroy()
}

module.exports = upload

