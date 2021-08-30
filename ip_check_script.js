const express = require('express');
const app = express()


ALLOWED_IP = ['27.79.237.240','77.73.67.234','141.164.54.156','158.247.216.178','178.175.137.114']

app.get('/', (req,res) => {
    const  ip = req.query.ip
    console.log()
    if(ALLOWED_IP.includes(ip)){
        res.json({status:true})
    }
    else {
        res.json({status:false})
    }
})

app.listen(3000,() => {
    console.log('verification server started')
})
