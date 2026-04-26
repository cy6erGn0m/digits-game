# speech.js

Speech — Web Speech API wrapper (ru-RU). Gracefully falls back silently if unavailable.

## Module

### Speech

Voice synthesis module for speaking task questions and feedback.

## Properties

### Speech.enabled

```javascript
Speech.enabled: boolean
```

Whether speech synthesis is available in this browser.

## Methods

### Speech.init

```
Speech.init(): void
```

Initialize speech synthesis. Check browser support. Sets `enabled` to true if available.

### Speech.speak

```
Speech.speak(text: string): void
```

Speak text using Web Speech API.

**Parameters:**
- `text` — Text to speak

### Speech.speakTask

```
Speech.speakTask(audioText: string): void
```

Speak task question.

**Parameters:**
- `audioText` — Question text

### Speech.speakCorrect

```
Speech.speakCorrect(): void
```

Speak "Молодец!" (Great job!).

### Speech.speakWrong

```
Speech.speakWrong(): void
```

Speak "Попробуй ещё" (Try again).