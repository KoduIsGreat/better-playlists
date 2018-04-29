import React, { Component } from 'react'
import './App.css'
let defaultStyle = {
  color: '#fff'
}
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
    let totalDurationInSeconds = allSongs.reduce((sum,eachSong) =>{
      return sum+eachSong.duration
      }  ,0)
    let totalDuration = Math.floor(totalDurationInSeconds / (60*60)) 

    return (
      <div style={{...defaultStyle, width: "40%", display: 'inline-block'}}>
      { totalDuration !== 0 ?
          <h2 >{totalDuration} Hours</h2>
        : <h2> Less than 1 Hour</h2>
      }
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
        <img />
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
      serverData: {},
      filterString: ''
    }
  }

  componentDidMount(){
    setTimeout(() => {
      this.setState({serverData: fakeServerData})
    }, 500)
  }

  render() {
    let serverData = this.state.serverData
    let playlistsToRender = serverData.user ? serverData.user.playlists
    .filter(playlist =>
      playlist.name.toLowerCase().includes(
        this.state.filterString.toLowerCase())
    ) : []

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

          </div> : <h1 style={defaultStyle}>Loading...</h1>
        }
      </div>
    )
  }
}

export default App
