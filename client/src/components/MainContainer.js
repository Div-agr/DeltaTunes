import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../styles/MainContainer.css";
import { Banner } from "./Banner";
import { SongCard } from './SongCard';
import tracks from './tracks';
import { MusicPlayer } from './MusicPlayer';
import { NavBar } from './NavBar';

function MainContainer() {
  const [currentTrack, setCurrentTrack] = useState(tracks[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const recordActivity = async (track) => {
    const currentUserId = localStorage.getItem('userId');
    const listenedAt = new Date();

    try {
      await axios.post('http://localhost:3001/listen', {
        userId: currentUserId,
        genre: track.genre,
        artistName: track.artistName,
        language: track.language,
        listenedAt,
      });
    } catch (error) {
      console.error('Error recording activity:', error);
    }
  };

  const handlePlay = (track) => {
    setCurrentTrack(track);
    setIsPlaying(false); // Reset play state to ensure the new song starts playing
    setTimeout(() => setIsPlaying(true), 0); // Start playing the new song
    recordActivity(track); // Record the activity
  };

  const categories = ['Recommended', 'Featured', 'Trending', 'Most Played'];

  // Filter tracks based on search query
  const filteredTracks = tracks.filter(track => {
    return (
      track.songName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artistName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const renderTracksByCategory = (category) => {
    const tracksToRender = category === 'Searched' ? filteredTracks : tracks.filter(track => track.category === category);

    return (
      <div key={category}>
        <div className='list'>{category}</div>
        <div className='songCards'>
          {tracksToRender.map((track, index) => (
            <SongCard 
              key={index}
              image={track.image}
              songName={track.songName}
              artistName={track.artistName}
              category={track.category}
              song={track.song}
              onPlay={() => handlePlay(track)}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className='mainContainer'>
      <NavBar />

      <Banner />

      {/* Render searched tracks */}
      {searchQuery.length > 0 && (
        <div>
          {renderTracksByCategory('Searched')}
        </div>
      )}

      {/* Render tracks by categories */}
      {categories.map(category => renderTracksByCategory(category))}

      <MusicPlayer 
        imgSrc={currentTrack.image} 
        song={currentTrack.song} 
        songName={currentTrack.songName}
        artistName={currentTrack.artistName} 
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
      />
    </div>
  );
}

export { MainContainer };
