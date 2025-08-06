import { useEffect, useState } from 'react';

const SoundManager = () => {
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [sounds, setSounds] = useState({});

  useEffect(() => {
    if (audioEnabled) {
      const engineSound = new Audio('data:audio/wav;base64,UklGRnoBAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmUZBDSH1Oxzd5WSSLKHaEaZcpqsodLbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBziR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmUZBDSH1O9zd5WSSKuHZ0aYcZirrZJhODVjodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmUZBDSH1O9zd5WSSKuHZ0aYcZirrZJhODVjodDbq2E=');
      const celebrationSound = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmUZBDSH1O9zd5WSSKuHZ0aYcZmrq5JgOTVjodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmUZBDSH1O9zd5WSSKuHZ0aYcZmrq5JgOTVjodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmUZBDSH1O9zd5WSSKuHZ0aYcZmrq5JgOTVjodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmUZBDSH1O9zd5WSSKuHZ0aYcZmrq5JgOTVjodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmUZBDSH1O9zd5WSSKuHZ0aYcZmrq5JgOTVjodDbq2E=');
      const tireScreechSound = new Audio('data:audio/wav;base64,UklGRnoBAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmUZBDSH1O9zd5WSSKuHZ0aYcZirrZJhODVjodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmUZBDSH1O9zd5WSSKuHZ0aYcZirrZJhODVjodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmUZBDSH1O9zd5WSSKuHZ0aYcZirrZJhODVjodDbq2E=');

      setSounds({
        engine: engineSound,
        celebration: celebrationSound,
        tireScreech: tireScreechSound
      });
    }
  }, [audioEnabled]);

  const playSound = (soundName) => {
    if (audioEnabled && sounds[soundName]) {
      sounds[soundName].currentTime = 0;
      sounds[soundName].volume = 0.3;
      sounds[soundName].play().catch(() => {});
    }
  };

  const enableAudio = () => {
    setAudioEnabled(true);
  };

  return { playSound, enableAudio, audioEnabled };
};

export default SoundManager;