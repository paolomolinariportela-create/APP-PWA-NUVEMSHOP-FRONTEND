 ▸ install
    $ npm install
         
  ▸ build
    $ npm run build
            
  Deploy    
  ──────────
    $ npm run start
 

load build definition from ./railpack-plan.json
0ms

install mise packages: node cached
0ms

npm install cached
1ms

copy .npmrc cached
0ms

mkdir -p /app/node_modules/.cache cached
0ms

copy package.json cached
0ms

copy / /app
179ms

npm run build
1s
npm warn config production Use `--omit=dev` instead.
> front-end-new-skin-lab-editor@0.0.0 build
> vite build
vite v5.4.21 building for production...
transforming...
✓ 41 modules transformed.
x Build failed in 446ms
error during build:
[31m[vite:esbuild] Transform failed with 1 error:

/app/src/campaigns/design.ts:52:21: ERROR: Expected ">" but found "width"
file: /app/src/campaigns/design.ts:52:21
Expected ">" but found "width"
50 |  // ─── SVG ICONS ────────────────────────────────────────────────────────────────
51 |  export const Icon = {
52 |      bell:       <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
   |                       ^
53 |      send:       <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
54 |      users:      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    at failureErrorWithLog (/app/node_modules/esbuild/lib/main.js:1472:15)
    at /app/node_modules/esbuild/lib/main.js:755:50
    at responseCallbacks.<computed> (/app/node_modules/esbuild/lib/main.js:622:9)
    at handleIncomingPacket (/app/node_modules/esbuild/lib/main.js:677:12)
    at Socket.readFromStdout (/app/node_modules/esbuild/lib/main.js:600:7)
    at Socket.emit (node:events:519:28)
    at addChunk (node:internal/streams/readable:561:12)
    at readableAddChunkPushByteMode (node:internal/streams/readable:512:3)
    at Readable.push (node:internal/streams/readable:392:5)
    at Pipe.onStreamRead (node:internal/stream_base_commons:189:23)
Build Failed: build daemon returned an error < failed to solve: process "npm run build" did not complete successfully: exit code: 1 >
