import React, { useEffect } from "react";

const playReminderSound = () => {
  try {
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext ||
      window.AudioContext)();
    if (audioContext.state === "suspended") {
      audioContext.resume(); // Resume if suspended (e.g., on iOS)
    }

    const playBeep = (frequency, duration = 0.2, volume = 0.3) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.type = "sine"; // Smooth, pleasant tone

      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    };

    playBeep(440, 0.3); // First note: A4 at 0s
    setTimeout(() => playBeep(523.25, 0.3), 800); // Second note: C5 (after 800ms)
    setTimeout(() => playBeep(659.25, 0.3), 1600); // Third note: E5 (after 1600ms)
    setTimeout(() => playBeep(783.99, 0.3), 2400); // Fourth note: G5 (after 2400ms)
    setTimeout(() => playBeep(880, 0.5), 3200); // Fifth note: A5 (after 3200ms, longer duration)

  } catch (error) {
    console.warn("Failed to play reminder sound:", error);
    window.alert("Reminder!");
  }
};

const ReminderSound = ({ play }) => {
  useEffect(() => {
    if (play) {
      playReminderSound();
    }
  }, [play]);

  return null;
};

export default ReminderSound;