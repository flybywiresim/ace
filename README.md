![FlyByWire Simulations](https://raw.githubusercontent.com/flybywiresim/branding/1391fc003d8b5d439d01ad86e2778ae0bfc8b682/tails-with-text/FBW-Color-Light.svg)

# `ace`

`ace`, or Advanced Cockpit Emulator, is a project aiming to provide a complete avionics development environment for Microsoft Flight Simulator aircraft.

It provides the following features:

### Cockpit panel display

`ace` can display cockpit panels in browser, with nearly identical rendering.

### SimVar support

Simulation Variables and Local Variables exist for instruments to read and write to.

### Coherent API mocking

The MSFS CoherentGT engine API is emulated in `ace`, including the `call`, `trigger` and `on` functions.

## How to

Each instrument's config.json should use this format:
```json
{
  "index": "./index.tsx",
  "isInteractive": true,
  "name": "DU3",
  "dimensions": {
    "width": 1480,
    "height": 1100
  }
}
```

Your rollup should output to a bundles folder within your project using this structure:
```
- bundles
  - MFD
    - bundle.js
    - bundle.css
  - PFD
    - bundle.js
    - bundle.css
```

Open the repository in an IDE of your choice, run `npm i` to install dependencies, then run `npm start`.

After running the program, select `New Project` and choose the locations of all your folders. 
If your folders are setup for ACE beforehand, you can select `Open Project` and select your root directory.

## Keymap

`Enter` - enter interactive mode (can use touchscreens)

## Upcoming Features

### Button panels

Support for interactive button panels linked to SimVars, K/H events, and support for emissive lights.

### Recorded SimVar patterns

Allows defining a curve on a SimVar value to provide a dynamic response in an instrument.

### FlyByWire `.fdr` file support

Dropping in an `fdr` file allows replays of user reported situations for easier troubleshooting.
