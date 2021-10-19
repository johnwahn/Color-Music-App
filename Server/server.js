const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const SpotifyWebApi = require('spotify-web-api-node')

const app = express()
var count = 0
app.use(cors())
app.use(bodyParser.json())

//setting a route to refresh our token
app.post('/refresh', (req, res)=>{
    const refreshToken = req.body.refreshToken
    const spotifyApi = new SpotifyWebApi({
        redirectUri: 'http://localhost:3000',
        clientId: 'e2561e3c12f4418cb5713c610f9ea9eb',
        clientSecret: 'c40e7f247361422090c1a0832cb45a24',
        refreshToken
    })
    // clientId, clientSecret and refreshToken has been set on the api object previous to this call.
    spotifyApi.refreshAccessToken().then(
        (data) => {
            //count+=1
            //console.log("in server.js refresh")
            //console.log(data.body)
            res.json({ 
                accessToken: data.body.accessToken,
                expiresIn: data.body.expiresIn
            })
        }).catch((err) => {
            console.log("Error in refresh accesstoken api "+err)

            res.sendStatus(400)
        }) 
})


app.post('/login', (req, res) =>{
    const code = req.body.code
    const spotifyApi = new SpotifyWebApi({
        redirectUri: 'http://localhost:3000',
        clientId: 'e2561e3c12f4418cb5713c610f9ea9eb',
        clientSecret: 'c40e7f247361422090c1a0832cb45a24',
    })
    spotifyApi.authorizationCodeGrant(code).then(data=>{
        //console.log("data info in server.js login "+data.body.access_token)
        res.json({
            accessToken: data.body.access_token,
            refreshToken: data.body.refresh_token,
            expiresIn: data.body.expires_in

        })
    }).catch((err)=>{
        console.log("this is an error in /login app.post: " + err)
        res.sendStatus(400)
    })
})
app.listen(3001)
