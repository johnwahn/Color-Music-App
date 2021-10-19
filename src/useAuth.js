import { useState, useEffect } from 'react'
import axios from "axios"

export default function useAuth(code) {
    const [accessToken,setAccessToken] = useState()
    const [refreshToken,setRefreshToken] = useState()
    const [expiresIn, setExpiresIn] = useState()

    useEffect(()=>{ 
        axios.post('http://localhost:3001/login', {
            code,
        }).then(res => {
            //console.log("in useAuth.js login useEffect")
            setAccessToken(res.data.accessToken)
            setRefreshToken(res.data.refreshToken)
            setExpiresIn(res.data.expiresIn)

            window.history.pushState({}, null,'/')
        })
        .catch(() => {
            window.location = '/'
        })
    }, [code])

    //hook to automatically refresh token for user
    useEffect(()=>{
        //console.log("in refresh useEffect")
        if (!refreshToken || !expiresIn) return
        const interval = setInterval(()=>{
            axios.post('http://localhost:3001/refresh', {
                refreshToken,
            }).then(res => {    
                //console.log("in useAuth.js refresh useEffect")
                setAccessToken(res.data.accessToken)
                setExpiresIn(res.data.expiresIn)
            })
            .catch(() => {
                window.location = '/'
            })
        }, (expiresIn-60)*1000)

        return () => clearInterval(interval)
    }, [refreshToken, expiresIn])
    return accessToken
}

