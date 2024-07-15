import React, { useState } from 'react';
import { FaHeart, FaRegHeart, FaPlay } from 'react-icons/fa';

let likedSongs=[];

function SongCard({ image, songName, artistName, category, song, onPlay }) {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    if(isFavorite){
      likedSongs=likedSongs.filter(n => n.songName!==songName);
      console.log("here");
    }
    else{
      if(!({image: image, songName: songName, artistName: artistName, category: category, song: song} in likedSongs)){
        likedSongs.push({image: image, songName: songName, artistName: artistName, category: category, song: song});
      }
    }
  };

  return (
    <div className='songCard'>
      <div className={`favourite ${isFavorite ? 'filled' : ''}`} onClick={toggleFavorite}>
        {isFavorite ? <FaHeart /> : <FaRegHeart />}
      </div>
      <img src={image} alt={songName} className='songImage' />
      <div className='playButton' onClick={onPlay}>
        <i><FaPlay /></i>
      </div>
      <div className='songName'>{songName}</div>
      <div className='ArtistName'>{artistName}</div>
    </div>
  );
}

export { SongCard };
export default likedSongs;
