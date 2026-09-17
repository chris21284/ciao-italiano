/**
 * Prononciation du mot par la voix italienne du téléphone (Web Speech API).
 * Aucun fichier son à héberger, et la voix est déjà installée sur iOS comme
 * sur Android. Sans voix italienne disponible, on reste silencieux plutôt que
 * de lire le mot avec l'accent français.
 */
export function speakItalian(text: string) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'it-IT';
    // Un peu plus lent que la normale : on apprend, on ne discute pas.
    utterance.rate = 0.85;
    const italianVoice = window.speechSynthesis
      .getVoices()
      .find((voice) => voice.lang.toLowerCase().startsWith('it'));
    if (italianVoice) utterance.voice = italianVoice;
    window.speechSynthesis.speak(utterance);
  } catch {
    // Synthèse indisponible : l'exercice reste jouable en lecture.
  }
}

export function canSpeak(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}
