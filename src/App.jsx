import { useState, useEffect, useRef } from 'react';
import { Music, Search, Play, Pause, SkipBack, SkipForward, Volume2, Share2, PlusCircle, Trash2, Heart, Save, List, User } from 'lucide-react';

// Mock data to simulate API responses
const mockPlaylists = [
  { id: 1, name: "Favorites", tracks: [0, 1, 3], owner: "You", isPublic: true },
  { id: 2, name: "Workout Mix", tracks: [2, 4], owner: "You", isPublic: false }
];

const mockTracks = [
  { 
    id: 0, 
    title: "Summer Breeze", 
    artist: "Coastal Waves", 
    album: "Ocean Sounds", 
    duration: 237, 
    cover: "/api/placeholder/300/300",
    audio: "https://example.com/audio/track1.mp3"
  },
  { 
    id: 1, 
    title: "Mountain Echo", 
    artist: "Nature Sounds", 
    album: "Wilderness", 
    duration: 184, 
    cover: "/api/placeholder/300/300",
    audio: "https://example.com/audio/track2.mp3"
  },
  { 
    id: 2, 
    title: "Urban Rhythm", 
    artist: "City Beats", 
    album: "Downtown", 
    duration: 198, 
    cover: "/api/placeholder/300/300",
    audio: "https://example.com/audio/track3.mp3"
  },
  { 
    id: 3, 
    title: "Midnight Jazz", 
    artist: "Smooth Quartet", 
    album: "Late Hours", 
    duration: 245, 
    cover: "/api/placeholder/300/300",
    audio: "https://example.com/audio/track4.mp3"
  },
  { 
    id: 4, 
    title: "Electronic Dreams", 
    artist: "Digital Artist", 
    album: "Future Sounds", 
    duration: 221, 
    cover: "/api/placeholder/300/300",
    audio: "https://example.com/audio/track5.mp3"
  }
];

// Format time in minutes:seconds
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' + secs : secs}`;
};

// Main App Component
export default function MusicPlayerApp() {
  const [tracks, setTracks] = useState(mockTracks);
  const [playlists, setPlaylists] = useState(mockPlaylists);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPlaylist, setCurrentPlaylist] = useState(null);
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [view, setView] = useState('library'); // 'library', 'playlist', 'search'
  
  const audioRef = useRef(null);
  const progressBarRef = useRef(null);

  // Filter tracks based on search query
  const filteredTracks = tracks.filter(track => 
    track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.album.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get tracks for current playlist
  const currentPlaylistTracks = currentPlaylist
    ? currentPlaylist.tracks.map(id => tracks.find(track => track.id === id))
    : [];

  // Get current track
  const currentTrack = tracks[currentTrackIndex];

  // Handle play/pause
  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Handle track change
  const changeTrack = (index) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play();
      }
    }, 100);
  };

  // Play next track
  const playNext = () => {
    if (currentTrackIndex < tracks.length - 1) {
      changeTrack(currentTrackIndex + 1);
    } else {
      changeTrack(0);
    }
  };

  // Play previous track
  const playPrevious = () => {
    if (currentTrackIndex > 0) {
      changeTrack(currentTrackIndex - 1);
    } else {
      changeTrack(tracks.length - 1);
    }
  };

  // Update progress bar
  useEffect(() => {
    const updateProgress = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
      }
    };

    const interval = setInterval(updateProgress, 1000);
    return () => clearInterval(interval);
  }, []);

  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  // Handle seeking in the song
  const handleSeek = (e) => {
    const seekTime = (e.nativeEvent.offsetX / progressBarRef.current.offsetWidth) * currentTrack.duration;
    setCurrentTime(seekTime);
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
    }
  };

  // Create new playlist
  const createPlaylist = () => {
    if (newPlaylistName.trim()) {
      const newPlaylist = {
        id: playlists.length + 1,
        name: newPlaylistName,
        tracks: [],
        owner: "You",
        isPublic: false
      };
      setPlaylists([...playlists, newPlaylist]);
      setNewPlaylistName('');
      setShowCreatePlaylist(false);
    }
  };

  // Add track to playlist
  const addToPlaylist = (playlistId, trackId) => {
    setPlaylists(playlists.map(playlist => {
      if (playlist.id === playlistId && !playlist.tracks.includes(trackId)) {
        return { ...playlist, tracks: [...playlist.tracks, trackId] };
      }
      return playlist;
    }));
  };

  // Remove track from playlist
  const removeFromPlaylist = (playlistId, trackId) => {
    setPlaylists(playlists.map(playlist => {
      if (playlist.id === playlistId) {
        return { ...playlist, tracks: playlist.tracks.filter(id => id !== trackId) };
      }
      return playlist;
    }));
  };

  // Toggle playlist public/private
  const togglePlaylistVisibility = (playlistId) => {
    setPlaylists(playlists.map(playlist => {
      if (playlist.id === playlistId) {
        return { ...playlist, isPublic: !playlist.isPublic };
      }
      return playlist;
    }));
  };

  // Open playlist view
  const openPlaylist = (playlist) => {
    setCurrentPlaylist(playlist);
    setView('playlist');
  };

  // Share playlist (mock functionality)
  const sharePlaylist = (playlist) => {
    if (playlist.isPublic) {
      setShowShareModal(true);
    } else {
      alert("Make this playlist public first to share it!");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white overflow-hidden">
      {/* Audio Element (hidden) */}
      <audio 
        ref={audioRef}
        src={currentTrack?.audio} 
        onEnded={playNext}
        className="hidden"
      />
      
      {/* Top Navigation */}
      <header className="bg-gray-800 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Music className="text-purple-500" size={24} />
          <h1 className="text-xl font-bold">Rhythm Sync</h1>
        </div>
        <div className="flex-1 mx-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search tracks, artists, albums..."
              className="w-full py-2 px-4 pr-10 rounded-full bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value) {
                  setView('search');
                }
              }}
            />
            <Search className="absolute right-3 top-2.5 text-gray-400" size={18} />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <User className="text-gray-400 hover:text-white cursor-pointer" size={20} />
        </div>
      </header>
      
      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Playlists */}
        <div className="w-64 bg-gray-800 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">Your Playlists</h2>
              <button 
                onClick={() => setShowCreatePlaylist(true)}
                className="text-purple-500 hover:text-purple-400"
              >
                <PlusCircle size={20} />
              </button>
            </div>
            
            {/* Create Playlist Form */}
            {showCreatePlaylist && (
              <div className="mb-4 p-3 bg-gray-700 rounded-md">
                <input
                  type="text"
                  placeholder="Playlist name"
                  className="w-full p-2 mb-2 rounded bg-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                />
                <div className="flex justify-end space-x-2">
                  <button 
                    onClick={() => setShowCreatePlaylist(false)}
                    className="px-3 py-1 text-sm text-gray-300 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={createPlaylist}
                    className="px-3 py-1 text-sm bg-purple-600 rounded hover:bg-purple-700"
                  >
                    Create
                  </button>
                </div>
              </div>
            )}
            
            {/* Playlist List */}
            <ul className="space-y-1">
              <li 
                className={`p-2 rounded cursor-pointer ${view === 'library' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
                onClick={() => {
                  setView('library');
                  setCurrentPlaylist(null);
                }}
              >
                <div className="flex items-center">
                  <List size={18} className="mr-2 text-gray-400" />
                  Library
                </div>
              </li>
              {playlists.map((playlist) => (
                <li 
                  key={playlist.id}
                  className={`p-2 rounded cursor-pointer ${currentPlaylist?.id === playlist.id ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
                  onClick={() => openPlaylist(playlist)}
                >
                  <div className="flex items-center justify-between">
                    <span className="truncate">{playlist.name}</span>
                    <span className="text-xs text-gray-400">
                      {playlist.tracks.length} track{playlist.tracks.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {view === 'library' && (
            <>
              <h2 className="text-2xl font-bold mb-6">Your Library</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tracks.map((track, index) => (
                  <div key={track.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                    <img src={track.cover} alt={track.title} className="w-full h-48 object-cover" />
                    <div className="p-4">
                      <h3 className="font-bold text-lg truncate">{track.title}</h3>
                      <p className="text-gray-400 truncate">{track.artist}</p>
                      <p className="text-gray-500 text-sm">{track.album}</p>
                      <div className="mt-4 flex justify-between items-center">
                        <button 
                          onClick={() => changeTrack(index)}
                          className="text-purple-500 hover:text-purple-400"
                        >
                          {isPlaying && currentTrackIndex === index ? <Pause size={20} /> : <Play size={20} />}
                        </button>
                        <div className="flex space-x-2">
                          <button className="text-gray-400 hover:text-purple-500">
                            <Heart size={18} />
                          </button>
                          <div className="relative group">
                            <button className="text-gray-400 hover:text-purple-500">
                              <PlusCircle size={18} />
                            </button>
                            <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg z-10 hidden group-hover:block">
                              <div className="py-1">
                                <p className="px-4 py-2 text-sm font-medium border-b border-gray-600">Add to playlist:</p>
                                {playlists.map(playlist => (
                                  <button
                                    key={playlist.id}
                                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-600"
                                    onClick={() => addToPlaylist(playlist.id, track.id)}
                                  >
                                    {playlist.name}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          
          {view === 'playlist' && currentPlaylist && (
            <>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold">{currentPlaylist.name}</h2>
                  <p className="text-gray-400">{currentPlaylist.tracks.length} tracks • Created by {currentPlaylist.owner}</p>
                </div>
                <div className="flex space-x-3">
                  <button 
                    onClick={() => togglePlaylistVisibility(currentPlaylist.id)}
                    className={`px-3 py-1 rounded text-sm ${currentPlaylist.isPublic ? 'bg-green-600' : 'bg-gray-600'}`}
                  >
                    {currentPlaylist.isPublic ? 'Public' : 'Private'}
                  </button>
                  <button 
                    onClick={() => sharePlaylist(currentPlaylist)}
                    className="flex items-center space-x-1 px-3 py-1 bg-purple-600 rounded hover:bg-purple-700"
                  >
                    <Share2 size={16} />
                    <span>Share</span>
                  </button>
                </div>
              </div>
              
              {currentPlaylistTracks.length > 0 ? (
                <div className="bg-gray-800 rounded-lg overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-gray-700">
                      <tr>
                        <th className="p-3 w-12">#</th>
                        <th className="p-3">Title</th>
                        <th className="p-3">Artist</th>
                        <th className="p-3">Album</th>
                        <th className="p-3 w-16">Duration</th>
                        <th className="p-3 w-12"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentPlaylistTracks.map((track, index) => (
                        <tr 
                          key={track.id} 
                          className={`border-b border-gray-700 hover:bg-gray-700 ${currentTrackIndex === tracks.findIndex(t => t.id === track.id) && isPlaying ? 'bg-gray-700' : ''}`}
                        >
                          <td className="p-3 text-center">
                            <button onClick={() => changeTrack(tracks.findIndex(t => t.id === track.id))}>
                              {currentTrackIndex === tracks.findIndex(t => t.id === track.id) && isPlaying 
                                ? <Pause size={16} className="text-purple-500" /> 
                                : <Play size={16} />
                              }
                            </button>
                          </td>
                          <td className="p-3 font-medium">{track.title}</td>
                          <td className="p-3 text-gray-400">{track.artist}</td>
                          <td className="p-3 text-gray-400">{track.album}</td>
                          <td className="p-3 text-gray-400">{formatTime(track.duration)}</td>
                          <td className="p-3">
                            <button 
                              onClick={() => removeFromPlaylist(currentPlaylist.id, track.id)}
                              className="text-gray-400 hover:text-red-500"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-800 rounded-lg">
                  <p className="text-gray-400">This playlist is empty. Add some tracks!</p>
                </div>
              )}
            </>
          )}
          
          {view === 'search' && (
            <>
              <h2 className="text-2xl font-bold mb-6">Search Results: "{searchQuery}"</h2>
              {filteredTracks.length > 0 ? (
                <div className="bg-gray-800 rounded-lg overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-gray-700">
                      <tr>
                        <th className="p-3 w-12"></th>
                        <th className="p-3">Title</th>
                        <th className="p-3">Artist</th>
                        <th className="p-3">Album</th>
                        <th className="p-3 w-16">Duration</th>
                        <th className="p-3 w-12"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTracks.map((track, index) => (
                        <tr 
                          key={track.id} 
                          className="border-b border-gray-700 hover:bg-gray-700"
                        >
                          <td className="p-3 text-center">
                            <button onClick={() => changeTrack(tracks.findIndex(t => t.id === track.id))}>
                              {currentTrackIndex === tracks.findIndex(t => t.id === track.id) && isPlaying 
                                ? <Pause size={16} className="text-purple-500" /> 
                                : <Play size={16} />
                              }
                            </button>
                          </td>
                          <td className="p-3 font-medium">{track.title}</td>
                          <td className="p-3 text-gray-400">{track.artist}</td>
                          <td className="p-3 text-gray-400">{track.album}</td>
                          <td className="p-3 text-gray-400">{formatTime(track.duration)}</td>
                          <td className="p-3">
                            <div className="relative group">
                              <button className="text-gray-400 hover:text-purple-500">
                                <PlusCircle size={16} />
                              </button>
                              <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg z-10 hidden group-hover:block">
                                <div className="py-1">
                                  <p className="px-4 py-2 text-sm font-medium border-b border-gray-600">Add to playlist:</p>
                                  {playlists.map(playlist => (
                                    <button
                                      key={playlist.id}
                                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-600"
                                      onClick={() => addToPlaylist(playlist.id, track.id)}
                                    >
                                      {playlist.name}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-800 rounded-lg">
                  <p className="text-gray-400">No tracks found matching "{searchQuery}"</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
      {/* Now Playing Bar */}
      <div className="bg-gray-800 border-t border-gray-700 p-4">
        <div className="flex items-center justify-between">
          {/* Track Info */}
          <div className="flex items-center w-1/4">
            {currentTrack && (
              <>
                <img src={currentTrack.cover} alt={currentTrack.title} className="w-12 h-12 rounded object-cover mr-3" />
                <div className="truncate">
                  <h4 className="font-medium truncate">{currentTrack.title}</h4>
                  <p className="text-sm text-gray-400 truncate">{currentTrack.artist}</p>
                </div>
              </>
            )}
          </div>
          
          {/* Player Controls */}
          <div className="flex flex-col items-center w-2/4">
            <div className="flex items-center mb-2">
              <button onClick={playPrevious} className="mx-2 text-gray-400 hover:text-white">
                <SkipBack size={20} />
              </button>
              <button onClick={togglePlay} className="mx-2 w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center hover:bg-purple-700">
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>
              <button onClick={playNext} className="mx-2 text-gray-400 hover:text-white">
                <SkipForward size={20} />
              </button>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full flex items-center">
              <span className="text-xs text-gray-400 w-10">{formatTime(currentTime)}</span>
              <div 
                ref={progressBarRef}
                className="flex-1 mx-2 h-1 bg-gray-600 rounded-full overflow-hidden cursor-pointer"
                onClick={handleSeek}
              >
                <div 
                  className="h-full bg-purple-500" 
                  style={{ width: `${currentTrack ? (currentTime / currentTrack.duration) * 100 : 0}%` }}
                ></div>
              </div>
              <span className="text-xs text-gray-400 w-10">{currentTrack ? formatTime(currentTrack.duration) : '0:00'}</span>
            </div>
          </div>
          
          {/* Volume Control */}
          <div className="flex items-center justify-end w-1/4">
            <Volume2 size={18} className="text-gray-400 mr-2" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>
      
      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-96">
            <h3 className="text-lg font-bold mb-4">Share Playlist</h3>
            <p className="mb-4 text-sm text-gray-300">Share this playlist with your friends:</p>
            <div className="flex mb-4">
              <input
                type="text"
                value={`https://rhythmsync.example/playlist/${currentPlaylist?.id}`}
                readOnly
                className="flex-1 p-2 bg-gray-700 rounded-l focus:outline-none"
              />
              <button className="bg-purple-600 text-white px-4 py-2 rounded-r hover:bg-purple-700">
                Copy
              </button>
            </div>
            <div className="flex justify-end">
              <button 
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 text-white bg-gray-600 rounded hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}