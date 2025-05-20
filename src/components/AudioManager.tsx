"use client";

import { Howl, Howler } from 'howler';
import { useEffect, useRef, FC, ReactNode } from 'react';

interface SoundMap {
  [key: string]: Howl | undefined;
}

interface AudioManagerProps {
  soundsToLoad: Array<{ name: string; path: string; loop?: boolean; volume?: number }>;
  children?: ReactNode; // Optional: if you ever want to wrap content
}

const AudioManagerComponent: FC<AudioManagerProps> = ({ soundsToLoad }) => {
  const soundsRef = useRef<SoundMap>({});

  useEffect(() => {
    // Initialize Howler global settings if needed
    // Howler.volume(0.5); // Example: set global volume

    soundsToLoad.forEach(soundInfo => {
      if (!soundsRef.current[soundInfo.name]) {
        const newSound = new Howl({
          src: [soundInfo.path],
          loop: soundInfo.loop || false,
          volume: soundInfo.volume || 1.0,
          html5: true, // Often helps with browser compatibility and resource management
          onload: () => {
            console.log(`Sound loaded: ${soundInfo.name}`);
          },
          onloaderror: (id, err) => {
            console.error(`Error loading sound ${soundInfo.name}: `, err);
          },
          onplayerror: (id, err) => {
            console.error(`Error playing sound ${soundInfo.name} (${id}): `, err);
          }
        });
        soundsRef.current[soundInfo.name] = newSound;
      }
    });

    // Cleanup function
    return () => {
      console.log("AudioManagerComponent: Cleaning up sounds...");
      Object.values(soundsRef.current).forEach(sound => {
        if (sound) {
          sound.stop();
          sound.unload(); // Release audio resources
        }
      });
      soundsRef.current = {};
    };
  }, [soundsToLoad]); // Re-run if soundsToLoad changes

  // Expose methods to play/stop sounds via a ref or context if needed,
  // For now, this component primarily preloads sounds.
  // Actual playback control might be better managed by a global audio service/context
  // or by passing down control functions.

  return null; // This component does not render anything itself
};

// --- More sophisticated AudioManager class approach (can be used globally) ---

class AudioManager {
  private sounds: SoundMap = {};
  private static instance: AudioManager;

  private constructor() {
    // Global Howler settings can be set here
    // Howler.volume(0.8);
  }

  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  public loadSound(name: string, path: string, loop: boolean = false, volume: number = 1.0, html5: boolean = true): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.sounds[name]) {
        console.log(`Sound '${name}' already loaded.`);
        resolve();
        return;
      }
      const sound = new Howl({
        src: [path],
        loop: loop,
        volume: volume,
        html5: html5,
        onload: () => {
          console.log(`Sound loaded: ${name} from ${path}`);
          this.sounds[name] = sound;
          resolve();
        },
        onloaderror: (id, err) => {
          console.error(`Error loading sound ${name} from ${path}: `, err);
          reject(err);
        },
        onplayerror: (id, err) => { 
          console.error(`Error playing sound ${name} (id: ${id}): `, err);
        }
      });
    });
  }

  public playSound(name: string, allowOverlap: boolean = true): number | null {
    const sound = this.sounds[name];
    if (sound) {
      if (!allowOverlap && sound.playing()) {
        // console.log(`Sound '${name}' is already playing and overlap is not allowed. Stopping first.`);
        // sound.stop(); // Option: stop existing instance
        return null; // Option: don't play new instance
      }
      const soundId = sound.play();
      // console.log(`Playing sound: ${name}, ID: ${soundId}`);
      // sound.on('play', () => console.log(`Actually playing ${name} with id ${soundId}` ) );
      // sound.on('playerror', (id, err) => console.error(`Play error for ${name}, id ${id}`, err));
      return soundId;
    } else {
      console.warn(`Sound '${name}' not found or not loaded.`);
      return null;
    }
  }

  public stopSound(name: string, id?: number): void {
    const sound = this.sounds[name];
    if (sound) {
      if (id !== undefined) {
        sound.stop(id);
        // console.log(`Stopped sound: ${name}, specific ID: ${id}`);
      } else {
        sound.stop();
        // console.log(`Stopped all instances of sound: ${name}`);
      }
    } else {
      // console.warn(`Sound '${name}' not found, cannot stop.`);
    }
  }
  
  public pauseSound(name: string, id?: number): void {
    const sound = this.sounds[name];
    if (sound) {
      if (id !== undefined) {
        sound.pause(id);
      } else {
        sound.pause();
      }
    } else {
      // console.warn(`Sound '${name}' not found, cannot pause.`);
    }
  }

  public resumeSound(name: string, id?: number): void {
    const sound = this.sounds[name];
    if(sound) {
        if (id !== undefined) {
            if (!sound.playing(id)) sound.play(id);
        } else {
            // This attempts to resume the first playing instance or starts a new one if none are paused.
            // Howler's generic pause/play without ID might not work as expected for resuming a specific paused instance
            // if multiple instances were played. Consider tracking IDs if precise resume is needed.
            sound.play(); 
        }
    } else {
        // console.warn(`Sound '${name}' not found, cannot resume.`);
    }
  }

  public isPlaying(name: string, id?: number): boolean {
    const sound = this.sounds[name];
    if (sound) {
      if (id !== undefined) {
        return sound.playing(id);
      }
      return sound.playing();
    }
    return false;
  }

  public getSound(name: string): Howl | undefined {
    return this.sounds[name];
  }

  public unloadSound(name: string): void {
    const sound = this.sounds[name];
    if (sound) {
      sound.unload();
      delete this.sounds[name];
      console.log(`Unloaded sound: ${name}`);
    }
  }

  public unloadAllSounds(): void {
    console.log("Unloading all sounds from AudioManager instance...");
    for (const name in this.sounds) {
      this.sounds[name]?.unload();
    }
    this.sounds = {};
  }

  public setVolume(name: string, volume: number, id?: number): void {
    const sound = this.sounds[name];
    if (sound) {
      if (id !== undefined) {
        sound.volume(volume, id);
      } else {
        sound.volume(volume);
      }
    } else {
      // console.warn(`Sound '${name}' not found, cannot set volume.`);
    }
  }
}

export const audioManager = AudioManager.getInstance();
export default AudioManagerComponent; // Exporting the component for potential direct use 