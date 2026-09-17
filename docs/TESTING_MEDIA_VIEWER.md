# 🎬 Media Viewer Testing Guide

## ✅ How to Test the Media Evidence Viewer

### Quick Test (Right Now):

1. **Make sure dev server is running**:
   ```bash
   npm run dev
   ```

2. **Open the app**: http://localhost:5173 (or whatever port Vite shows)

3. **Navigate**: Click "Incidents" in the navigation

4. **Test Each Media Type**:

   **A) Video Test** (Incident #1):
   - Click "View Evidence" on "Political Deepfake Video Campaign"
   - You should see a video player
   - Click the ▶ Play button
   - Video should play (10 second Big Buck Bunny clip)
   - At 1.5s, 4.2s, 7.8s you should see detection overlays appear
   - Try seeking with the slider
   - Try changing playback speed to 0.5x

   **B) Audio Test** (Incident #2):
   - Click "View Evidence" on "Audio Clone Impersonation"
   - You should see a waveform
   - Click the ▶ Play button  
   - Music should play and waveform should progress
   - See audio anomalies listed below

   **C) Image Test** (Incident #3):
   - Click "View Evidence" on "Coordinated Meme Manipulation"
   - You should see an image with a slider
   - Drag the slider left/right to compare

---

## 🐛 If Video/Audio Don't Load:

### Problem: "Video won't play"
**Possible Causes**:
1. **CORS issue** - External URLs blocked
2. **Network issue** - Firewall/proxy blocking
3. **Format issue** - Browser doesn't support codec

**Solution**:
Download a test video and use it locally:

```bash
# From public/samples/ folder, download a test video:
# Visit: https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4
# Save as: public/samples/test-video.mp4
```

Then update the incident mediaUrl to:
```typescript
mediaUrl: "/samples/test-video.mp4"
```

---

## 🎯 What Should Work:

### ✅ Video Player:
- [x] Video loads and displays
- [x] Play/Pause button works
- [x] Timeline scrubber works
- [x] Playback speed selector works
- [x] Volume/Mute works
- [x] Detection overlays appear at timestamps
- [x] Red markers show on timeline
- [x] Clicking markers seeks to timestamp
- [x] Tabs switch (Player/Detections/Metadata)

### ✅ Audio Player:
- [x] Waveform renders
- [x] Play/Pause works
- [x] Progress shows on waveform
- [x] Can click waveform to seek
- [x] Audio anomalies list shows
- [x] Clicking anomaly jumps to timestamp

### ✅ Image Viewer:
- [x] Image loads
- [x] Before/After slider works
- [x] Can drag slider
- [x] Detection overlays show

---

## 🔍 Debug Checklist:

**If nothing is working**:

1. **Check Browser Console** (F12):
   - Look for errors (red text)
   - Look for CORS errors
   - Look for 404 errors (file not found)

2. **Check Network Tab** (F12 → Network):
   - Click "View Evidence"
   - See if media file is loading
   - Check HTTP status (should be 200)

3. **Try Different Browser**:
   - Chrome/Edge (best support)
   - Firefox (good support)  
   - Safari (might have issues)

4. **Check Internet Connection**:
   - External URLs need internet
   - Try: https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4
   - Should download a video file

---

## 💡 Quick Fixes:

### Fix 1: Use Local Files
Download test media and put in `public/samples/`:
- `test-video.mp4` - Any short MP4 video
- `test-audio.mp3` - Any MP3 file
- `test-image.jpg` - Any JPEG image

Then change URLs to:
```typescript
mediaUrl: "/samples/test-video.mp4"
```

### Fix 2: Use Data URLs
For images, you can use base64:
```typescript
mediaUrl: "data:image/jpeg;base64,/9j/4AAQ..."
```

### Fix 3: Test with Browser Samples
Some browsers have built-in test videos:
```typescript
mediaUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
```

---

## 📸 Expected Results:

### When Working Correctly:

**Video Player**:
```
[Video showing bunny in black player]
[Control bar at bottom with ▶ button]
[Timeline with red markers at 1.5s, 4.2s, 7.8s]
[Speed: 1x] [Volume icon]
```

**During Playback**:
```
At 1.5s: [Red alert box] "Facial region shows deep learning manipulation artifacts" [96% confident]
```

**Audio Player**:
```
[Blue/purple gradient waveform visualization]
[▶ button] [0:00 / 0:30] [Volume]
[3 orange alert boxes below showing anomalies]
```

**Image Viewer**:
```
[Person's face photo with draggable slider in middle]
← Original | Analyzed →
[Detection overlay at top]
```

---

## 🎬 Full Demo Flow:

1. Start on Dashboard
2. Click "Incidents" in nav
3. Scroll down to incident list
4. Click "View Evidence" on first incident
5. **Dialog opens** with media viewer
6. Click ▶ Play on video
7. **Watch detections appear** at 1.5s, 4.2s, 7.8s
8. Pause video
9. Click red marker on timeline → **jumps to that moment**
10. Change speed to 0.5x → **video slows down**
11. Click "Detections" tab → **shows list of 3 detections**
12. Click a detection → **video jumps to timestamp**
13. Click "Metadata" tab → **shows file info**
14. Close dialog
15. Click "View Evidence" on Audio incident
16. **Waveform loads**
17. Click ▶ Play → **audio plays, waveform animates**
18. Click on waveform → **seeks to that position**
19. See audio anomalies listed → **click one to jump**

---

## ✅ Success Criteria:

**Minimum to Call it Working**:
- [ ] Dialog opens when clicking "View Evidence"
- [ ] Video/Audio/Image loads and displays
- [ ] Play button works
- [ ] Can see the media (not just a black box)

**Full Success**:
- [ ] All controls work (play, pause, seek, volume)
- [ ] Detection overlays appear at correct times
- [ ] Timeline markers show and are clickable
- [ ] Tabs switch between Player/Detections/Metadata
- [ ] All 3 media types work (video, audio, image)

---

## 🆘 Still Not Working?

**Tell me**:
1. Which incident did you try? (#1, #2, #3?)
2. What do you see? (Black box? Error message? Nothing?)
3. Any errors in browser console? (F12)
4. Does this URL work in your browser?: https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4

I'll help debug! 🔧
