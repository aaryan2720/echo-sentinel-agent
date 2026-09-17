# Sample Media Files for Testing (AI-03 Media Verification)

Documentation for sample multimodal media sources used in testing deepfake detection and media verification workflows.

## Working Video URLs:
1. **Big Buck Bunny** (MP4, 10s clip):
   - `https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4`

2. **Google Cloud Storage Sample** (MP4):
   - `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4`

## Working Audio URLs:
1. **Sample MP3**:
   - `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3`

2. **Free Audio Archive**:
   - `https://freesound.org/`

## Working Image URLs:
1. **Unsplash Test Assets**:
   - `https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4`
   - `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde`

## Local Testing Setup:
Place testing media files in the `/public/samples/` folder:
- `sample-video.mp4`
- `sample-audio.mp3`
- `sample-image.jpg`

Reference them via relative URL: `/samples/sample-video.mp4` in incidents and media analyzer flows.
