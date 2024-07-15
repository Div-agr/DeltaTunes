import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Playlist.css';
import tracks from './tracks';
import { MusicPlayer } from './MusicPlayer';
import { SongCard } from './SongCard';
import { NavBar } from './NavBar';
import likedSongs from './SongCard';

const Playlist = () => {
  const [playlists, setPlaylists] = useState([]);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [newPlaylistImage, setNewPlaylistImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  
  useEffect(() => {
    const fetchPlaylists = async () => {
      const result = await axios.get('http://localhost:3001/playlists');
      setPlaylists(result.data);
    };
    fetchPlaylists();
  }, []);

  if(playlists.length===0){
    const liked={
      name: "Liked Songs",
      isPublic: false,
      songs: likedSongs,
      image: null
    };
    playlists.push(liked);
  }

  const addPlaylist = async () => {
    if (newPlaylistName.trim() === '') return;

    const newPlaylist = {
      name: newPlaylistName,
      isPublic: isPublic,
      songs: selectedSongs,
      image: newPlaylistImage
    };

    const result = await axios.post('http://localhost:3001/playlists', newPlaylist);
    setPlaylists([...playlists, result.data]);
    setNewPlaylistName('');
    setIsPublic(false);
    setNewPlaylistImage(null);
    setSelectedSongs([]);
    setIsModalOpen(false);
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewPlaylistImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const toggleSongSelection = (song) => {
    if (selectedSongs.includes(song)) {
      setSelectedSongs(selectedSongs.filter(s => s !== song));
    } else {
      setSelectedSongs([...selectedSongs, song]);
    }
  };

  const filteredTracks = tracks.filter(track =>
    track.songName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    track.artistName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePlaylistClick = (playlist) => {
    setSelectedPlaylist(playlist);
    if (playlist.songs.length > 0) {
      setCurrentTrackIndex(0);
      setIsPlaying(true);
    }
  };

  const playNextTrack = () => {
    if (selectedPlaylist) {
      const nextTrackIndex = currentTrackIndex + 1;
      if (nextTrackIndex < selectedPlaylist.songs.length) {
        setCurrentTrackIndex(nextTrackIndex);
        setIsPlaying(true); // Ensure the next track starts playing automatically
      } else {
        setIsPlaying(false); // Stop playing if it's the last track
      }
    }
  };

  return (
    <div className="PlaylistContainer">
      <NavBar />
      <h2>Your Playlists</h2>
      <div className="PlaylistGrid">
        <div className="PlaylistCard CreateCard" onClick={() => setIsModalOpen(true)}>
          <span>+</span>
        </div>

        {playlists.map((playlist, index) => (
          <div className="PlaylistCard" key={index} onClick={() => handlePlaylistClick(playlist)}>
            {playlist.image && <img src={playlist.image} alt={playlist.name} />}
            <div className="title">{playlist.name}</div>
            <div className="type">{playlist.isPublic ? 'Public' : 'Private'}</div>
          </div>
        ))}
      </div>

      {selectedPlaylist && (
        <div className="PlaylistDetails">
          <h3>{selectedPlaylist.name}</h3>
          <div className="SongsGrid">
            {selectedPlaylist.songs.map((song, index) => (
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

      {isModalOpen && (
        <div className="Modal">
          <div className="ModalContent">
            <h3>Create New Playlist</h3>
            <input
              type="text"
              placeholder="Playlist Name"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
            />
            <div>
              <label className='checktext'>
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                />
                Make Public
              </label>
            </div>
            <div>
              <label htmlFor="image-upload">Upload Image</label>
              <input type="file" id="image-upload" onChange={handleImageChange} />
            </div>
            <div>
              <input
                type="text"
                placeholder="Search for songs"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="SongSelection">
              {filteredTracks.map((track, index) => (
                <div
                  className={`SongItem ${selectedSongs.includes(track) ? 'selected' : ''}`}
                  key={index}
                  onClick={() => toggleSongSelection(track)}
                >
                  <SongCard 
                    key={index}
                    image={track.image}
                    songName={track.songName}
                    artistName={track.artistName}
                  />
                  <div className="add">{selectedSongs.includes(track) ? 'REMOVE' : 'ADD'}</div>
                </div>
              ))}
            </div>
            <button onClick={addPlaylist}>Add Playlist</button>
            <button onClick={() => setIsModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
      {selectedPlaylist && selectedPlaylist.songs.length > 0 && (
        <div className="MusicPlayerContainer">
          <MusicPlayer
            imgSrc={selectedPlaylist.songs[currentTrackIndex].image}
            song={selectedPlaylist.songs[currentTrackIndex].song}
            songName={selectedPlaylist.songs[currentTrackIndex].songName}
            artistName={selectedPlaylist.songs[currentTrackIndex].artistName}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            onEnded={playNextTrack}
          />
        </div>
      )}
    </div>
  );
};

export { Playlist };
