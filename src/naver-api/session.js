const got = require('got')

const getSession = async (cookie) => {
    const response = await got.get(`https://post.editor.naver.com/PhotoUploader/SessionKey.json?uploaderType=simple&userId=${cookie.name}&serviceId=post`,{
        headers: {
            'Accept': 'application/json',
            'Referer': `https://post.editor.naver.com/editor/canvas?serviceId=post&deviceType=desktop&docType=normal`,
            'User-Agent': process.env.USER_AGENT,
            // 'Cookie': cookie.cookie
        }
    }).json()
    if(response.isSuccess != true){
        throw new Error('get token failed')
    }
    else {
        return response.result.sessionKey
    }
}

module.exports = getSession