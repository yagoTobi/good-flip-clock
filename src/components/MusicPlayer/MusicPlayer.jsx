import { useState, useEffect, useRef } from "react";
import { FaMusic, FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaTimes } from "react-icons/fa";
import "./MusicPlayer.css";

// Curated study music stations — update videoId if a stream goes offline
const STATIONS = [
  { id: "lofi", name: "Lofi", videoId: "jfKfPfyJRdk" },
  { id: "jazz", name: "Jazz", videoId: "Dx5qFachd3A" },
  { id: "house", name: "House", videoId: "fPOcBsbu-5Q" },
  { id: "focus", name: "Focus", videoId: "WPni755-Krg" },
];

function loadYTScript() {
  if (document.getElementById("yt-iframe-api")) return;
  const tag = document.createElement("script");
  tag.id = "yt-iframe-api";
  tag.src = "https://www.youtube.com/iframe_api";
  document.head.appendChild(tag);
}

function MusicPlayer({ isOpen, onToggle, onPlayingChange, hasControls }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [stationIdx, setStationIdx] = useState(0);
  const [ready, setReady] = useState(false);
  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const station = STATIONS[stationIdx];

  // Load YouTube IFrame API once
  useEffect(() => {
    loadYTScript();
  }, []);

  // Create player lazily on first open — persists while component is mounted
  // so music keeps playing when the panel is collapsed
  useEffect(() => {
    if (!isOpen || playerRef.current) return;

    const init = () => {
      if (playerRef.current) return;
      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId: station.videoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
        },
        events: {
          onReady: () => setReady(true),
          onStateChange: (e) => {
            const playing = e.data === window.YT.PlayerState.PLAYING;
            setIsPlaying(playing);
            onPlayingChange?.(playing);
          },
        },
      });
    };

    if (window.YT?.Player) {
      init();
    } else {
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prev?.();
        init();
      };
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Switch station
  useEffect(() => {
    if (!playerRef.current || !ready) return;
    if (isPlaying) {
      playerRef.current.loadVideoById(station.videoId);
    } else {
      playerRef.current.cueVideoById(station.videoId);
    }
  }, [stationIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  const togglePlay = () => {
    if (!playerRef.current || !ready) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  const toggleMute = () => {
    if (!playerRef.current || !ready) return;
    if (isMuted) {
      playerRef.current.unMute();
      setIsMuted(false);
    } else {
      playerRef.current.mute();
      setIsMuted(true);
    }
  };

  return (
    <div className={`music-player-root${hasControls ? " has-controls" : ""}`}>
      {/* Always-mounted hidden YouTube player container */}
      <div className="yt-hidden">
        <div ref={containerRef} />
      </div>

      {/* Expanded panel — floats above the toggle button */}
      {isOpen && (
        <div className="music-panel" role="region" aria-label="Music player">
          <div className="music-panel-header">
            <span className="music-panel-label">Study Beats</span>
            <button
              className="music-panel-close"
              onClick={onToggle}
              aria-label="Close music player"
            >
              <FaTimes size={12} aria-hidden="true" />
            </button>
          </div>

          <div className="music-stations" role="group" aria-label="Stations">
            {STATIONS.map((s, i) => (
              <button
                key={s.id}
                className={`station-btn${i === stationIdx ? " active" : ""}`}
                onClick={() => setStationIdx(i)}
                aria-pressed={i === stationIdx}
              >
                {s.name}
              </button>
            ))}
          </div>

          <div className="music-controls">
            <button
              className="ctrl-btn play-btn"
              onClick={togglePlay}
              disabled={!ready}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <FaPause size={13} aria-hidden="true" /> : <FaPlay size={13} aria-hidden="true" />}
            </button>
            <button
              className="ctrl-btn"
              onClick={toggleMute}
              disabled={!ready}
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <FaVolumeMute size={14} aria-hidden="true" /> : <FaVolumeUp size={14} aria-hidden="true" />}
            </button>
          </div>
        </div>
      )}

      {/* Toggle button — always visible */}
      <button
        className={`music-toggle${isPlaying ? " is-playing" : ""}`}
        onClick={onToggle}
        aria-label={isOpen ? "Close music player" : "Open music player"}
        title="Study beats"
      >
        <FaMusic size={20} aria-hidden="true" />
      </button>
    </div>
  );
}

export default MusicPlayer;
