import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2021,
      globals: {
        document: 'readonly',
        window: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        localStorage: 'readonly',
        EventTarget: 'readonly',
        CustomEvent: 'readonly',
        SpeechSynthesisUtterance: 'readonly',
        SpeechSynthesis: 'readonly',
        Speech: 'readonly',
        Animations: 'readonly',
        AppViewModel: 'readonly',
        ProgressStorage: 'readonly',
        UI: 'readonly',
        TaskType: 'readonly',
        TaskGenerators: 'readonly',
        DistractionLevel: 'readonly',
        shuffle: 'readonly',
        randomInt: 'readonly',
        randomFrom: 'readonly',
        clamp: 'readonly'
      }
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-empty': 'warn'
    }
  }
];