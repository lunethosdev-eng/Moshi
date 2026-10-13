"use client";

import { AudioWaveform, CircleChevronLeft, CircleChevronRight, Ellipsis, PauseIcon, PlayIcon, Repeat, Star } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react';

const Music = () => {

    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    // track time
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [lyrics, setLyrics] = useState<{ time: number, text: string }[]>([]);

    const lyricRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        if (isPlaying) {
            const interval = setInterval(() => {
                setCurrentTime(audioRef.current?.currentTime || 0);
                setTimeLeft((audioRef.current?.duration || 0) - (audioRef.current?.currentTime || 0));
            }, 100);
            return () => clearInterval(interval);
        }
    }, [isPlaying])

    const playMusic = () => {
        audioRef.current?.play();
        setIsPlaying(true);
    };

    const pauseMusic = () => {
        audioRef.current?.pause();
        setIsPlaying(false);
    };

    function identifyClicks(second: number) {
        if (!audioRef.current) return
        setCurrentTime(second);
        setTimeLeft((audioRef.current?.duration || 0) - second);
        audioRef.current.currentTime = second;
        playMusic();
    }

    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === ' ') {
                e.preventDefault();
                isPlaying ? pauseMusic() : playMusic()
            }
        }
        document.addEventListener('keydown', handleKeyDown)
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [isPlaying])

    const renderTimerInFormat = useMemo(() => {
        const minute = Math.floor(timeLeft / 60);
        const second = Math.floor(timeLeft % 60).toString().padStart(2, '0');
        return (
            <>-{minute}:{second}</>
        )
    }, [timeLeft])

    const renderCurrentTimeInFormat = useMemo(() => {
        const minute = Math.floor(currentTime / 60);
        const second = Math.floor(currentTime % 60).toString().padStart(2, '0');
        return (
            <>{minute}:{second}</>
        )
    }, [currentTime])

    useEffect(() => {
        (async () => {
            const res = await fetch("/api/lyrics");
            const data = await res.json();
            if (data) {
                console.log(data.data)
                setLyrics(data.data);
            }
        })()
    }, [])

    const currentLyricIndex = lyrics.findIndex((lyr, ind) => {
        const start = lyr.time;
        const end = lyrics[ind + 1]?.time ?? duration;
        return currentTime >= start && currentTime <= end;
    });

    useEffect(() => {
        if (currentLyricIndex === -1) return;

        const el = lyricRefs.current[currentLyricIndex];
        if (el) {
            el.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }
    }, [currentLyricIndex]);

    return (
        <div className='liquid-glass grid grid-cols-1 sm:grid-cols-2 max-w-[780px] px-6 py-8 w-full max-h-[520px] h-full mx-4'>
            <div className='flex flex-col items-center justify-between gap-8 w-full h-full'>
                <div className={`album-glass p-1.5 w-max h-max ${isPlaying ? 'playing' : ''}`}>
                    <img alt='poster' src='/Rasputin Song Poster.jpeg' className="w-48 sm:w-52" />
                </div>
                <div className='flex flex-col gap-3 w-full max-w-xs'>
                    <div className='flex gap-4 items-center justify-between'>
                        <div>
                            <h3 className='font-semibold text-white text-lg tracking-tight'>Rasputin</h3>
                            <p className='text-white/60 text-sm'>Boney M. · The Essential Boney M.</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <button className='liquid-glass-chip p-2 w-max h-max' aria-label="Favorite">
                                <Star color='white' size={18} />
                            </button>
                            <button className='liquid-glass-chip p-2 w-max h-max' aria-label="More">
                                <Ellipsis color='white' size={18} />
                            </button>
                        </div>
                    </div>
                    <audio
                        onLoadedMetadata={() => {
                            const audio = audioRef.current;
                            if (!audio) return;

                            setDuration(audio.duration);
                            setTimeLeft(audio.duration);
                        }}
                        className='hidden' onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                        onEnded={() => setIsPlaying(false)} ref={audioRef} src="/Rasputin.mp3"
                    />
                    <div className='relative w-full mt-1'>
                        <div
                            className="liquid-glass-track w-full grid rounded-2xl p-0.5 h-2"
                            style={{
                                gridTemplateColumns: `repeat(${Math.max(1, Math.floor(duration))}, minmax(0, 1fr))`
                            }}
                        >
                            {
                                Array.from({ length: Math.max(1, Math.floor(duration)) }, (_, second) => (
                                    <div
                                        key={second}
                                        onClick={() => identifyClicks(second)}
                                        className="h-2 w-full cursor-pointer"
                                    />
                                ))
                            }
                        </div>
                        <div style={{
                            width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
                        }} className={`liquid-glass-fill absolute top-0 left-0 rounded-2xl h-2 pointer-events-none transition-[width] duration-100`}>
                        </div>
                    </div>
                    <div className='flex justify-between'>
                        <p className='font-medium text-white/70 text-[11px] tabular-nums'>{renderCurrentTimeInFormat}</p>
                        <p className='font-medium text-white/70 text-[11px] tabular-nums'>{renderTimerInFormat}</p>
                    </div>
                    <div className='flex items-center justify-between mt-1'>
                        <button className="p-1 opacity-70 hover:opacity-100 transition-opacity" aria-label="Waveform">
                            <AudioWaveform color='#fff' size={20} />
                        </button>
                        <div className='flex items-center justify-center gap-3'>
                            <button className="p-1 opacity-80 hover:opacity-100 transition-opacity" aria-label="Previous">
                                <CircleChevronLeft color='#fff' size={26} />
                            </button>
                            <button
                                onClick={isPlaying ? pauseMusic : playMusic}
                                className="liquid-glass-chip p-3 flex items-center justify-center"
                                aria-label={isPlaying ? "Pause" : "Play"}
                            >
                                {isPlaying ? <PauseIcon color='#fff' size={28} fill="white" /> : <PlayIcon color='#fff' size={28} fill="white" />}
                            </button>
                            <button className="p-1 opacity-80 hover:opacity-100 transition-opacity" aria-label="Next">
                                <CircleChevronRight color='#fff' size={26} />
                            </button>
                        </div>
                        <button className="p-1 opacity-70 hover:opacity-100 transition-opacity" aria-label="Repeat">
                            <Repeat color='#fff' size={20} />
                        </button>
                    </div>
                </div>
            </div>
            <div className='flex flex-col pt-12 sm:pt-16 gap-6 overflow-y-auto lyrics-glass pr-1 max-h-[420px]'>
                {
                    lyrics.map((lyr, ind) => {

                        const lyricsStart = lyr.time;
                        const lyricsEnd = lyrics[ind + 1] ? lyrics[ind + 1].time : duration;
                        const isCurrentLyrics = currentTime >= lyricsStart && currentTime <= lyricsEnd;
                        const durationOfSentence = lyricsEnd - lyricsStart;
                        const totalChars = lyr.text.length || 1;
                        const progress = Math.min(
                            Math.max((currentTime - lyricsStart) / (durationOfSentence || 1), 0),
                            1
                        );
                        return <div
                            ref={(el) => { lyricRefs.current[ind] = el; }}
                            onClick={() => identifyClicks(lyr.time)} key={ind}
                            className="cursor-pointer select-none">
                            {
                                lyr.text.split("").map((txt, index) => {

                                    const charProgress = index / totalChars;
                                    const isVisible = progress >= charProgress;
                                    const isPast = currentTime > lyricsStart;

                                    return <span style={{
                                        willChange: "transform, opacity, filter",
                                        display: "inline-flex",
                                        transitionDelay: `${index * 0.03}s`,
                                        transform: isPast || (isCurrentLyrics && isVisible) ? "translateY(0px)" : "translateY(8px)",
                                        filter: isPast || (isCurrentLyrics && isVisible) ? "blur(0px)" : "blur(1.5px)",
                                    }} className={`text-xl sm:text-2xl font-bold transition-[transform,opacity,filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${isPast || (isCurrentLyrics && isVisible) ? "opacity-100 scale-100 text-white" : "opacity-35 scale-95 text-white/50"}`}
                                        key={index}>
                                        {txt === " " ? "\u00A0" : txt}
                                    </span>
                                })
                            }
                        </div>
                    })
                }
            </div>
        </div>
    )
}

export default Music
