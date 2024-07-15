import React,{useState} from 'react';
import { useLocation } from 'react-router-dom';
import tracks from './tracks'; // Importing the tracks data
import { SongCard } from './SongCard';
import { MusicPlayer } from './MusicPlayer';
import { NavBar } from './NavBar';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchResults({ searchQuery }) {
  let query = useQuery();
  searchQuery = query.get('q') || '';

  // Filter tracks based on search query
  const [currentTrack, setCurrentTrack] = useState(tracks[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = (track) => {
    setCurrentTrack(track);
    setIsPlaying(false); // Reset play state to ensure the new song starts playing
    setTimeout(() => setIsPlaying(true), 0); // Start playing the new song
  };

  const filteredTracks = tracks.filter(track => {
    return (
      track.songName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artistName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="filteredTracksContainer">
      <NavBar />
      <div className="filteredTracks">
        {filteredTracks.map((track, index) => (
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
      
      <div className="audioRack">
        <MusicPlayer 
            imgSrc={currentTrack.image} 
            song={currentTrack.song} 
            songName={currentTrack.songName}
            artistName={currentTrack.artistName} 
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
        />
      </div>
    </div>
  );
}

export { SearchResults };
