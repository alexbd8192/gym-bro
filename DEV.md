# Gym Bro — Dev Instructions

## Start the dev server

```bash
cd "Claude Projects/Gym Bro"
npm run dev
```

Then open **http://localhost:5173** in your browser.  
The browser updates automatically whenever `gymbro.tsx` is saved.

## Access from another device (e.g. your GF's phone)

While the server is running, connect to the same Wi-Fi and open:  
**http://192.168.37.149:5173**

## Stop the server

Press `Ctrl+C` in the terminal where it's running.

## Project structure

```
Gym Bro/
├── gymbro.tsx        ← all app logic and UI lives here
├── src/
│   └── main.tsx      ← entry point (don't touch)
├── index.html        ← HTML shell (don't touch)
├── vite.config.ts    ← build config (don't touch)
├── package.json      ← dependencies
└── DEV.md            ← this file
```

## Logins (demo data)

| User | Password |
|------|----------|
| Alex | 1234     |
| Gf   | 1234     |

Or register a new account from the login screen.
