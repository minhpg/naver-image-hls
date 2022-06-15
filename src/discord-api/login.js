const axios = require('axios')

const login = async (login, password) => {
    const payload = {
        login: login,
        password: password,
        undelete: false,
        captcha_key: null,
        login_source: null,
        gift_code_sku_id: null
    }

    const headers = {
        'user-agent' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.55 Safari/537.36',
        referer: 'https://discord.com/login',
        origin: 'https://discord.com'
    }

    try {
        const response = await axios({
            url: 'https://discord.com/api/v9/auth/login',
            method: 'POST',
            headers: headers,
            data: payload
        })
    
        console.log(response.data)
        console.log(`successful login - ${login} - token: ${response.data.token}`)
        return response.data.token
    }
    catch (error) {
        console.log(error.response.data)
        throw new Error(error.response.data.message)
    }



}


module.exports = login