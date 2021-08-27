const got = require('got');
const fs = require('fs');
const formData = require('form-data')
const getSession = require('./session')
const xml2js = require('xml2js')

const uploadFile = (file,cookie) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { size } = await fs.promises.stat(file)
            console.log(`uploading ${file} - ${cookie.name} - ${cookie.username} - size: ${size}`)
            const sessionKey = await getSession(cookie)
            const url = `https://ecommerce.upphoto.naver.com/${sessionKey}/simpleUpload/0?userId=${cookie.username}&extractExif=false&extractAnimatedCnt=true&autorotate=true&extractDominantColor=false&type=`
            const headers = {
                'Referer': `https://post.editor.naver.com/`,
                'User-Agent': process.env.USER_AGENT,
                'Cache-Control': 'no-cache'
            }
            const form = new formData()
            const data = {
                'image': fs.createReadStream(file),
            }
            Object.keys(data).map((key, index) => {
                form.append(key, data[key])
            })
            const response = await got.post(url, {
                body: form,
                headers: headers
            });
            const parser = new xml2js.Parser()
            const response_data = await parser.parseStringPromise(response.body)
            if(response_data.result){
                reject(new Error(response_data.result.errors[0].error[0].reason[0].cause[0]))
            }
            else{
                const data_url = response_data.item.url[0]
                console.log(`uploaded ${file} to ${data_url}`)
                resolve(data_url)    
            }
        }
        catch (err) {
            console.error(err.message)
            reject(err)
        }
    })
}

// uploadFile('./test.png')
module.exports = uploadFile