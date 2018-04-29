import React, { Component } from 'react'
import queryString from 'query-string'
import './App.css'


let defaultStyle = {
  color: '#fff'
}
const minsInHour = 60
const secInMin = 60
let fakeServerData ={
  user: { 
    name : 'Adam',
    playlists : [
      {
        name : 'My favorites',
        songs: [
          {name : 'Biscuit jam', duration: 300}, 
          {name : 'Biskit beats', duration : 9000}, 
          {name : 'Its a good day for a biscuit', duration :5321}
        ]
      },
      {
        name : 'Discover Weekly',
        songs: [
          {name : 'Biscuit jam', duration: 5151}, 
          {name: 'Biskit beats', duration : 3231}, 
          {name : 'Its a good day for a biscuit', duration :1231}
        ]
      },
      {
        name : 'Biscuit playlist',
        songs: [
          {name : 'Biscuit jam', duration:700}, 
          {name : 'Biskit beats', duration : 231}, 
          {name : 'Its a good day for a biscuit', duration :60}
        ]
      },
      {
        name : 'Biscuit playlist 2',
        songs: [
          {name : 'Biscuit jam', duration: 130}, 
          {name : 'Biskit beats', duration : 300}, 
          {name : 'Its a good day for a biscuit', duration :60}
        ]
      }
    ]

  },
}
class PlaylistCounter extends Component{
  render(){
    return (
      <div style={{...defaultStyle, width: "40%", display: 'inline-block'}}>
        <h2 >{this.props.playlists.length} Playlists</h2>
      </div>
    )
  }
}

class HoursCounter extends Component{
  render(){
    let allSongs = this.props.playlists.reduce((songs, eachPlaylist) =>{
      return songs.concat(eachPlaylist.songs)
    } , [])
    let minutesOfMusic = allSongs.reduce((sum,eachSong) =>{
      return sum+Math.floor(eachSong.duration/ secInMin)
      }  ,0)
    let timeOfMusic = minutesOfMusic < minsInHour ?
      minutesOfMusic +' Minutes' :
      Math.floor(minutesOfMusic / minsInHour) +' Hours'

    return (
      <div style={{...defaultStyle, width: "40%", display: 'inline-block'}}>
          <h2 >{timeOfMusic}</h2>
      </div>
    )
  }
}

class Filter extends Component{
  render() {
    return (
      <div style={{defaultStyle}}>
        <img/>
        <input type="text" onKeyUp={ event => 
          this.props.onTextChange(event.target.value) }/>
      </div>
    )
  }
}

class Playlist extends Component {
  render() {
    let playlist = this.props.playlist
    return (
      <div style={{...defaultStyle, width: "20%", display:'inline-block'}}>
        <img src={playlist.imgUrl} style={{width : '160px', padding: '20px'}}/>
        <h3>{playlist.name}</h3>
        <ul>
          {playlist.songs.map(song =>
            <li>{song.name}</li>
          )}
        </ul>
      </div>
    )
  }
}

class App extends Component {
  constructor() {
    super()
    this.state = {
      filterString: ''
    }
  }

  componentDidMount(){
    let parsed = queryString.parse(window.location.search)
    let accessToken = parsed.access_token
    if(!accessToken)
      return;

    fetch('https://api.spotify.com/v1/me',{
      headers: {'Authorization': 'Bearer ' + accessToken}
    }).then((response) => response.json())
    .then(data => this.setState({
      user:{
        name : data.display_name
      }
    }))

    fetch('https://api.spotify.com/v1/me/playlists',{
      headers: {'Authorization': 'Bearer ' + accessToken}
    }).then((response) => response.json())
    .then( data => this.setState({
        playlists : data.items.map(item => {
          console.log(item);
          return {
            name: item.name,
            imgUrl: item.images[0].url, 
            songs:[]
          }
        })
      }))

  }

  render() {
    let serverData = this.state
    let playlistsToRender = 
    serverData.user &&
    serverData.playlists 
    ? serverData.playlists.filter(playlist =>
        playlist.name.toLowerCase().includes(
        this.state.filterString.toLowerCase())) 
    : []

    return (
      <div className="App">
        {
          serverData.user ?
          <div>
            <h1 style={{...defaultStyle, 'font-size': '54px'}}>
              {serverData.user.name}'s Playlists
            </h1>
            
            <PlaylistCounter playlists={playlistsToRender}/>
            <HoursCounter playlists={playlistsToRender}/>
            <Filter onTextChange={text => this.setState({filterString :text})}/>
            {playlistsToRender.map(playlist => 
              <Playlist playlist={playlist}/>
            )}

          </div> : <button onClick={() => {
            window.location = window.location.href.includes('localhost')
            ?'http://localhost:8888/login' 
            :'https://spotify-sucks-backend-herokuapp.com/login'}} 
           style={{padding : '20px', 'font-size' : '50px', 'margin-top': '20px'}}>
           Sign in with Spotify
           </button>
        }
      </div>
    )
  }
}

export default App
