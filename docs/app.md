# app.js

Entry point — initializes Speech, creates AppViewModel, starts UI.

## Functions

### DOMContentLoaded

```
document.addEventListener('DOMContentLoaded', callback)
```

Initializes the application on page load:
- Calls `Speech.init()` to initialize voice synthesis
- Creates `AppViewModel` with `ProgressStorage`
- Initializes `UI` with the view model
- Navigates to splash screen