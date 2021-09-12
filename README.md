<img src="https://raw.githubusercontent.com/flybywiresim/fbw-branding/master/png/FBW-Logo.png" placeholder="FlyByWire" width="400"/>

# `ace`

`ace`, or Advanced Cockpit Emulator, is a project aiming to provide a complete avionics development environment for Microsoft Flight Simulator aircraft.

It provides the following features:

### Cockpit panel display

`ace` can display cockpit panels in browser, with nearly identical rendering.

### SimVar support

Simulation Variables and Local Variables exist for instruments to read and write to.

### Coherent API mocking

The MSFS CoherentGT engine API is emulated in `ace`, including the `call`, `trigger` and `on` functions.

## Upcoming Features

### Button panels

Support for interactive button panels linked to SimVars, K/H events, and support for emissive lights.

### Recorded SimVar patterns

Allows defining a curve on a SimVar value to provide a dynamic response in an instrument.

### FlyByWire `.fdr` file support

Dropping in an `fdr` file allows replays of user reported situations for easier troubleshooting.
