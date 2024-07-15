import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { FaHeart, FaRegHeart, FaStepBackward, FaStepForward, FaShareAlt, FaHeadphones } from "react-icons/fa";
import { FaBackward, FaPause, FaPlay, FaForward } from 'react-icons/fa6';
import "../styles/MusicPlayer.css";

function MusicPlayer({ song, imgSrc, songName, artistName, isPlaying, setIsPlaying, onEnded }) {
    const [isFavorite, setIsFavorite] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const [lyrics, setLyrics] = useState('');
    const [loadingLyrics, setLoadingLyrics] = useState(false);
    const [isDJMode, setIsDJMode] = useState(false);

    const audioPlayer = useRef(null);
    const progressBar = useRef(null);
    const animationRef = useRef(null);
    const highlightIndexRef = useRef(0);

    const highlights = useMemo(() => [
        { start: 0, end: 30},
        { start: 40, end: 50 },
        { start: 60, end: 75 },
        { start: 90, end: 100},
        { start: 120, end: 135 },
        { start: 150, end: 165},
        { start: 180, end: 195}
    ], []);

    const changeCurrentTime = useCallback(() => {
        if (audioPlayer.current) {
            const currentProgress = (audioPlayer.current.currentTime / duration) * 100;
            if (progressBar.current) {
                progressBar.current.style.setProperty('--player-played', `${currentProgress}%`);
            }
            setCurrentTime(audioPlayer.current.currentTime);
        }
    }, [duration]);

    const togglePlayPause = useCallback(() => {
        setIsPlaying(prevState => !prevState);
    }, [setIsPlaying]);

    useEffect(() => {
        const audio = audioPlayer.current;

        const updateDuration = () => {
            const seconds = Math.floor(audio.duration);
            setDuration(seconds);
            if (progressBar.current) {
                progressBar.current.max = seconds;
            }
            setIsLoaded(true);
        };

        if (audio) {
            audio.addEventListener('loadedmetadata', updateDuration);

            return () => {
                audio.removeEventListener('loadedmetadata', updateDuration);
            };
        }
    }, []);

    useEffect(() => {
        const whilePlaying = () => {
            if (audioPlayer.current) {
                progressBar.current.value = audioPlayer.current.currentTime;
                changeCurrentTime();
                animationRef.current = requestAnimationFrame(whilePlaying);

                if (isDJMode) {
                    const currentHighlight = highlights[highlightIndexRef.current];
                    if (audioPlayer.current.currentTime >= currentHighlight.end) {
                        highlightIndexRef.current += 1;
                        if (highlightIndexRef.current < highlights.length) {
                            audioPlayer.current.currentTime = highlights[highlightIndexRef.current].start;
                        } else {
                            setIsPlaying(false);
                            highlightIndexRef.current = 0;
                            audioPlayer.current.currentTime = 0;
                        }
                    }
                }
            }
        };

        if (audioPlayer.current) {
            if (isPlaying && isLoaded) {
                if (isDJMode) {
                    audioPlayer.current.currentTime = highlights[highlightIndexRef.current].start;
                }
                audioPlayer.current.play();
                animationRef.current = requestAnimationFrame(whilePlaying);
            } else {
                audioPlayer.current.pause();
                cancelAnimationFrame(animationRef.current);
            }
        }

        return () => {
            cancelAnimationFrame(animationRef.current);
        };
    }, [isPlaying, isLoaded, song, changeCurrentTime, isDJMode, highlights, setIsPlaying]);

    useEffect(() => {
        const audio = audioPlayer.current;

        if (audio) {
            const handleEnded = () => {
                if (onEnded) onEnded();
            };

            audio.addEventListener('ended', handleEnded);

            return () => {
                audio.removeEventListener('ended', handleEnded);
            };
        }
    }, [onEnded]);

    useEffect(() => {
        const fetchLyrics = async () => {
            setLoadingLyrics(true);
            setLyrics('');
            try {
                const response = await fetch(`http://localhost:3001/lyrics?songName=${encodeURIComponent(songName)}&artistName=${encodeURIComponent(artistName)}`);
                const data = await response.json();
                if (data.message && data.message.body && data.message.body.lyrics) {
                    const lyricsText = data.message.body.lyrics.lyrics_body;
                    setLyrics(lyricsText);
                } else {
                    setLyrics('Lyrics not found.');
                }
            } catch (error) {
                console.error('Error fetching lyrics:', error);
                setLyrics('Error fetching lyrics.');
            } finally {
                setLoadingLyrics(false);
            }
        };

        if (songName && artistName) {
            fetchLyrics();
        }
    }, [songName, artistName]);

    const calculateTime = (sec) => {
        const minutes = Math.floor(sec / 60);
        const returnMin = minutes < 10 ? `0${minutes}` : `${minutes}`;
        const seconds = Math.floor(sec % 60);
        const returnSec = seconds < 10 ? `0${seconds}` : `${seconds}`;
        return `${returnMin}:${returnSec}`;
    };

    const toggleFavorite = () => {
        setIsFavorite(prevState => !prevState);
    };

    const changeProgress = () => {
        if (audioPlayer.current && progressBar.current) {
            const newTime = progressBar.current.value;
            audioPlayer.current.currentTime = newTime;
            changeCurrentTime();
        }
    };

    const skipTime = (seconds) => {
        if (audioPlayer.current) {
            audioPlayer.current.currentTime = Math.min(
                duration,
                Math.max(0, audioPlayer.current.currentTime + seconds)
            );
            changeCurrentTime();
        }
    };

    const toggleDJMode = () => {
        setIsDJMode(prevState => !prevState);
        highlightIndexRef.current = 0; // Reset highlight index when toggling DJ mode
    };

    return (
        <div className="musicPlayer">
            <div className='SongImage'>
                <img src={imgSrc} alt="song-cover" />
            </div>
            <div className="lyricsSection">
                <h3>Lyrics</h3>
                {loadingLyrics ? (
                    <p>Loading lyrics...</p>
                ) : (
                    <p>{lyrics}</p>
                )}
            </div>
            <div className="songAttributes">
                <audio src={song} preload="metadata" ref={audioPlayer} />
                <div className="top">
                    <div className="left">
                        <div className='loved' onClick={toggleFavorite}>
                            {isFavorite ? <FaHeart /> : <FaRegHeart />}
                        </div>
                        <div>{songName}</div>
                        <div style={{color: "#9a9a9a", fontWeight:"normal"}}>{artistName}</div>
                    </div>
                    <div className="middle">
                        <div className='back' onClick={() => skipTime(-10)}>
                            <FaStepBackward />
                            <FaBackward />
                        </div>
                        <div className='playPause' onClick={togglePlayPause}>
                            {isPlaying ? <FaPause /> : <FaPlay />}
                        </div>
                        <div className='forward' onClick={() => skipTime(10)}>
                            <FaForward />
                            <FaStepForward />
                        </div>
                    </div>
                    <div className="right">
                        <FaShareAlt />
                    </div>
                </div>
                <div className="bottom">
                    <div className='currentTime'>{calculateTime(currentTime)}</div>
                    {isLoaded && (
                        <input
                            type="range"
                            className='progressBar'
                            ref={progressBar}
                            min="0"
                            max={duration}
                            value={currentTime}
                            onChange={changeProgress}
                        />
                    )}
                    <div className='duration'>
                        {duration && !isNaN(duration) ? calculateTime(duration) : "00:00"}
                    </div>

                    <div className="djModeToggle">
                        <button onClick={toggleDJMode}>
                            
                            {isDJMode ? 'Exit DJ Mode' : 'Enter DJ Mode'}
                        </button>
                    </div>
                </div>
            </div>
            
        </div>
    );
}

export { MusicPlayer };
