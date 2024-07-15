import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Playlist.css';
import { SongCard } from './SongCard';
import { MusicPlayer } from './MusicPlayer';
import { NavBar } from './NavBar';

const Party = () => {
  const [publicPlaylists, setPublicPlaylists] = useState([]);
  const [firstPlaylist, setFirstPlaylist] = useState(null);
  const [secondPlaylist, setSecondPlaylist] = useState(null);
  const [combinedPlaylist, setCombinedPlaylist] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const fetchAllPlaylists = async () => {
      const result = await axios.get('http://localhost:3001/all-playlists');
      // Filter only public playlists
      const publicLists = result.data.filter(playlist => playlist.isPublic);
      setPublicPlaylists(publicLists);
    };
    fetchAllPlaylists();
  }, []);

  const combinePlaylists = () => {
    if (firstPlaylist && secondPlaylist) {
      const combined = [...firstPlaylist.songs, ...secondPlaylist.songs];
      setCombinedPlaylist(combined);
      if (combined.length > 0) {
        setCurrentTrackIndex(0);
        setIsPlaying(true);
      }
    }
  };

  const playNextTrack = () => {
    const nextTrackIndex = currentTrackIndex + 1;
    if (nextTrackIndex < combinedPlaylist.length) {
      setCurrentTrackIndex(nextTrackIndex);
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  };

  const togglePlaylistSelection = (playlist) => {
    if (!firstPlaylist) {
      setFirstPlaylist(playlist);
    } else if (!secondPlaylist && firstPlaylist !== playlist) {
      setSecondPlaylist(playlist);
    } else if (firstPlaylist === playlist) {
      setFirstPlaylist(null);
    } else if (secondPlaylist === playlist) {
      setSecondPlaylist(null);
    }
  };

  return (
    <div className="PlaylistContainer">
      <NavBar />
      <h2>Party Playlist</h2>
      <h3>Select 2 playlists that different users have created to combine them</h3>
      <div className="PlaylistGrid">
        {publicPlaylists.map((playlist, index) => (
          <div
            className={`PlaylistCard ${playlist === firstPlaylist || playlist === secondPlaylist ? 'selected' : ''}`}
            key={index}
            onClick={() => togglePlaylistSelection(playlist)}
          >
            {playlist.image && <img src={playlist.image} alt={playlist.name} />}
            <div className="title">{playlist.name}</div>
            <div className="type">{playlist.isPublic ? 'Public' : 'Private'}</div>
            <div className="add">
              {playlist === firstPlaylist || playlist === secondPlaylist ? 'REMOVE' : 'ADD'}
            </div>
          </div>
        ))}
      </div>

      <button className="combine" onClick={combinePlaylists} disabled={!firstPlaylist || !secondPlaylist}>Combine Playlists</button>

      {combinedPlaylist.length > 0 && (
        <div className="PlaylistDetails">
          <h3>Combined Playlist</h3>
          <div className="SongsGrid">
            {combinedPlaylist.map((song, index) => (
              <SongCard 
                key={index}
                image={song.image}
                songName={song.songName}
                artistName={song.artistName}
                onPlay={() => {
                  setCurrentTrackIndex(index);
                  setIsPlaying(true);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {combinedPlaylist.length > 0 && (
        <div className="MusicPlayerContainer">
          <MusicPlayer
            imgSrc={combinedPlaylist[currentTrackIndex].image}
            song={combinedPlaylist[currentTrackIndex].song}
            songName={combinedPlaylist[currentTrackIndex].songName}
            artistName={combinedPlaylist[currentTrackIndex].artistName}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            onEnded={playNextTrack}
          />
        </div>
      )}
    </div>
  );
};

export { Party };
