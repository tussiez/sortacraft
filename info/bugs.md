# Bugs
- FOV acceleration not ~~working~~ implemented.
- Fly mode takes three space bar presses instead of two.
- Options and inventory window takes two taps the first time opening to open instead of two.
- Slabs don't have proper collisions.
- Combining two slabs transform them into a block of water (Expected behavior)
- Sometimes when selecting near blocks the selection is off (this is because fast raycast :>)
- Trying to break/place in a chunk that isn't loaded causes an error.
- Sometimes going near a chunk that isn't loaded causes an error (I don't know exactly what causes it `cannot read geometry of undefined in gameworker`)?
- Probably my bad coding xD

# Solutions
- Use similar gravity "acceleration" for FOV
- Update "first" keypress on keydown?
-