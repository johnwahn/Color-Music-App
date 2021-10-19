import React, {useState, useEffect} from 'react'
import useAuth from './useAuth'
import { Container, Form } from 'react-bootstrap'
import SpotifyWebApi from 'spotify-web-api-node'
import TrackSearchResult from './TrackSearchResult'
import Player from './Player'

const spotifyApi = new SpotifyWebApi({
    clientId: 'e2561e3c12f4418cb5713c610f9ea9eb'
})

const Dashboard = ({code}) => {
    const accessToken = useAuth(code)
    const [search, setSearch] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [playingTrack, setPlayingTrack] = useState()
    const [lyrics, setLyrics] = useState("")
    const [albumImg, setAlbumImg] = useState()

    function chooseTrack(track){
        setPlayingTrack(track)
        setSearch("")
        setLyrics("")
        setAlbumImg(track.albumUrl)
    }

    //console.log(searchResults)

    //useEffect hook to display lyrics


    // useEffect for accessToken
    useEffect(()=>{
        if (!accessToken) return
        spotifyApi.setAccessToken(accessToken)
    }, [accessToken])

    //useEffect for searching
    useEffect(()=>{
        if (!search) return setSearchResults([])
        if (!accessToken) return
        let cancel = false
        spotifyApi.searchTracks(search).then(res=>{    
            if (cancel) return 
           
            setSearchResults(res.body.tracks.items.map(track =>{
                const smallestAlbumImage = track.album.images.reduce((smallest, image)=>{
                    //console.log(image)
                    if (image.height < smallest.height) return image
                    return smallest
                }, track.album.images[0])
                
                return{
                    artist: track.artists[0].name,
                    title: track.name,
                    uri: track.uri,
                    albumUrl: smallestAlbumImage.url
                }
            }))
        })
        return () => cancel = true
    }, [search, accessToken])

    let gradStyle = {"background": "linear-gradient(45deg, red, blue", 
                      "height": "40%"}
    return (
        <Container className='d-flex flex-column py-2' style = {{height: '100vh'}}>
            <Form.Control 
            type = 'search'
            placeholder = 'Search Songs/Artists'
            value = {search} 
            onChange={(e) => setSearch(e.target.value)}
            />
            <div style={gradStyle}> </div>

            <div className='flex-grow-1 my-2' style={{overflowY: "auto"}}>
                {searchResults.map(track => (
                    <TrackSearchResult track={track} key={track.uri} chooseTrack={chooseTrack}/>
                ))}
                {searchResults.length === 0 && (
                    <div className='text-center' style ={{whiteSpce: "pre"}}>
                        {lyrics}
                    </div>
                )}
            </div>
            <div><Player accessToken= {accessToken} trackUri = {playingTrack?.uri}/></div>
        </Container>
    )
}

export default Dashboard
