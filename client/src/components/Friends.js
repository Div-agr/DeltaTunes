import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Playlist.css'; // Ensure you have the same styles as Playlist
import "../styles/Friends.css"
import { MusicPlayer } from './MusicPlayer';
import { SongCard } from './SongCard';
import { NavBar } from './NavBar';

const Friends = () => {
    const [name, setName] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [currentUserId, setCurrentUserId] = useState('');
    const [currentUserInfo, setCurrentUserInfo] = useState(null);
    const [currentUserPlaylists, setCurrentUserPlaylists] = useState([]);
    const [selectedUserInfo, setSelectedUserInfo] = useState(null);
    const [selectedUserPlaylists, setSelectedUserPlaylists] = useState([]);
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            setCurrentUserId(userId);
            fetchUserInfo(userId);
        }
    }, []);

    useEffect(() => {
        if (name) {
            handleSearch();
        } else {
            setSearchResults([]);
        }
    }, [name]);

    const fetchUserInfo = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:3001/users/${userId}`);
            setCurrentUserInfo(response.data.user);
            setCurrentUserPlaylists(response.data.playlists);
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    };

    const handleSearch = async () => {
        try {
            const response = await axios.get('http://localhost:3001/users/search', {
                params: { name }
            });
            setSearchResults(response.data);
        } catch (error) {
            console.error('Error searching users:', error);
        }
    };

    const handleFollow = async (followId) => {
        try {
            await axios.put('http://localhost:3001/friends/follow', {
                followId,
                userId: currentUserId
            });
            alert('Followed successfully!');
            handleSearch(); // Refresh search results
            fetchUserInfo(currentUserId); // Refresh current user info
        } catch (error) {
            console.error('Error following user:', error);
            alert('Error following user');
        }
    };

    const handleUnfollow = async (unfollowId) => {
        try {
            await axios.put('http://localhost:3001/friends/unfollow', {
                unfollowId,
                userId: currentUserId
            });
            alert('Unfollowed successfully!');
            handleSearch(); // Refresh search results
            fetchUserInfo(currentUserId); // Refresh current user info
        } catch (error) {
            console.error('Error unfollowing user:', error);
            alert('Error unfollowing user');
        }
    };

    const handleUserClick = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:3001/users/${userId}`);
            setSelectedUserInfo(response.data.user);
            setSelectedUserPlaylists(response.data.playlists);
        } catch (error) {
            console.error('Error fetching user info:', error);
            alert('Error fetching user info');
        }
    };

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
                setIsPlaying(true);
            } else {
                setIsPlaying(false);
            }
        }
    };

    return (
        <div className="friends-container">
            <NavBar />
            <h2>Search Users</h2>
            <input
                className="searchuser"
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <div>
                {searchResults.map(user => (
                    <div key={user._id} style={{ margin: '10px 0' }}>
                        <p onClick={() => handleUserClick(user._id)} style={{ cursor: 'pointer', color: 'blue' }}>
                            {user.name}
                        </p>
                        <button className="unfollowfollow" onClick={() => handleFollow(user._id)}>Follow</button>
                        <button className="unfollowfollow" onClick={() => handleUnfollow(user._id)}>Unfollow</button>
                    </div>
                ))}
            </div>
            {selectedUserInfo && (
                <div>
                    <h3>User's Info</h3>
                    <p>Name: {selectedUserInfo.name}</p>
                    <p>Email: {selectedUserInfo.email}</p>
                    <p>Followers: {selectedUserInfo.followers.length}</p>
                    <p>Following: {selectedUserInfo.following.length}</p>
                    <h4>User's Playlists</h4>
                    <div className="PlaylistGrid">
                        {selectedUserPlaylists.map((playlist, index) => (
                            <div className="PlaylistCard" key={index} onClick={() => handlePlaylistClick(playlist)}>
                                {playlist.image && <img src={playlist.image} alt={playlist.name} />}
                                <div className="title">{playlist.name}</div>
                                <div className="type">{playlist.isPublic ? 'Public' : 'Private'}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {currentUserInfo && (
                <div>
                    <h3>Your Info</h3>
                    <p>Email: {currentUserInfo.email}</p>
                    <p>Followers: {currentUserInfo.followers.length}</p>
                    <p>Following: {currentUserInfo.following.length}</p>
                    <h4>Your Followers</h4>
                    {currentUserInfo.followers.map(follower => (
                        <p key={follower._id} onClick={() => handleUserClick(follower._id)} style={{ cursor: 'pointer', color: 'blue' }}>
                            {follower.name}
                        </p>
                    ))}
                    <h4>Your Following</h4>
                    {currentUserInfo.following.map(following => (
                        <p key={following._id} onClick={() => handleUserClick(following._id)} style={{ cursor: 'pointer', color: 'blue' }}>
                            {following.name}
                        </p>
                    ))}
                    <h4>Your Playlists</h4>
                    <div className="PlaylistGrid">
                        {currentUserPlaylists.map((playlist, index) => (
                            <div className="PlaylistCard" key={index} onClick={() => handlePlaylistClick(playlist)}>
                                {playlist.image && <img src={playlist.image} alt={playlist.name} />}
                                <div className="title">{playlist.name}</div>
                                <div className="type">{playlist.isPublic ? 'Public' : 'Private'}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
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

export { Friends };
