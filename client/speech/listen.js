export function listen() {
  return new Promise((resolve) => {
    const recognition = new webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (e) => resolve(e.results[0][0].transcript);
    recognition.start();
  });
}
