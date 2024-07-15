// tracks.js
import { singer, artist } from "../assets";
import { cheques, checkitout } from "../assets";
const tracks = [
    {
      image: singer,
      songName: 'cheques',
      artistName: 'Shubh',
      category: 'Recommended',
      song: cheques,
      genre:"relax",
      language:"punjabi"
    },
    {
      image: artist,
      songName: 'check it out',
      artistName: 'Parmish Verma',
      category: 'Recommended',
      song: checkitout,
      genre:"workout",
      language:"punjabi"
    },
    {
      image: '/path/to/image3.jpg',
      songName: 'Song 3',
      artistName: 'Artist 3',
      category: 'Featured',
      genre:"relax",
      language:"hindi"
    },
    {
      image: '/path/to/image4.jpg',
      songName: 'Song 4',
      artistName: 'Artist 4',
      category: 'Featured',
      genre:"chill",
      language:"hindi",
    },
    {
      image: '/path/to/image5.jpg',
      songName: 'Song 5',
      artistName: 'Artist 5',
      category: 'Trending',
      genre:"pop",
      language:"english"
    },
    {
      image: '/path/to/image6.jpg',
      songName: 'Song 6',
      artistName: 'Artist 6',
      category: 'Trending',
      genre:"jazz",
      language:"english"
    },
    {
      image: '/path/to/image7.jpg',
      songName: 'Song 7',
      artistName: 'Artist 7',
      category: 'Most Played',
      genre:"90s",
      language:"tamil"
    },
    {
      image: '/path/to/image8.jpg',
      songName: 'Song 8',
      artistName: 'Artist 8',
      category: 'Most Played',
      genre:"hip hop",
      language:"telgu"
    },
    // Add more song objects here
  ];
  
  export default tracks;
  