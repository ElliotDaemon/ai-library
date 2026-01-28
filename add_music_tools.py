import json

# Read the existing data
with open('client/public/mindmap_data.json', 'r') as f:
    data = json.load(f)

# Find the Audio & Music category
audio_cat = None
for cat in data['categories']:
    if cat['id'] == 'audio':
        audio_cat = cat
        break

if audio_cat:
    # Restructure with more specific subcategories for music production
    new_subcategories = [
        {
            "id": "music-gen",
            "name": "Music Generation",
            "tools": [
                {"name": "Suno", "url": "https://suno.ai", "description": "AI music generation - create full songs from text prompts", "pricing": "Free / Paid", "featured": True},
                {"name": "Udio", "url": "https://udio.com", "description": "AI music creation with high-quality output and stems", "pricing": "Free / Paid", "featured": True},
                {"name": "AIVA", "url": "https://aiva.ai", "description": "AI composer for emotional soundtrack music", "pricing": "Free / Paid"},
                {"name": "Soundraw", "url": "https://soundraw.io", "description": "AI music generator for royalty-free tracks", "pricing": "Subscription"},
                {"name": "Boomy", "url": "https://boomy.com", "description": "AI music creation - make songs in seconds", "pricing": "Free / Paid", "gem": True},
                {"name": "Beatoven.ai", "url": "https://beatoven.ai", "description": "AI music for videos - royalty-free", "pricing": "Free / Paid", "gem": True},
                {"name": "Soundful", "url": "https://soundful.com", "description": "AI music generator for content creators", "pricing": "Free / Paid", "gem": True},
                {"name": "Riffusion", "url": "https://riffusion.com", "description": "AI music from text descriptions using spectrograms", "pricing": "Free", "gem": True},
                {"name": "Stable Audio", "url": "https://stableaudio.com", "description": "Stability AI's audio generation", "pricing": "Free / Paid", "gem": True},
                {"name": "Mureka", "url": "https://mureka.ai", "description": "AI music & lyrics generator for unique tracks", "pricing": "Free / Paid", "gem": True}
            ]
        },
        {
            "id": "mixing-mastering",
            "name": "Mixing & Mastering",
            "tools": [
                {"name": "iZotope Ozone", "url": "https://izotope.com/ozone", "description": "Industry-standard AI mastering assistant with intelligent processing", "pricing": "$249+", "featured": True},
                {"name": "iZotope Neutron", "url": "https://izotope.com/neutron", "description": "AI mix assistant for EQ, compression, saturation", "pricing": "$249+", "featured": True},
                {"name": "LANDR", "url": "https://landr.com", "description": "AI mastering platform with distribution", "pricing": "Subscription", "featured": True},
                {"name": "Masterchannel", "url": "https://masterchannel.ai", "description": "Grammy-winning AI mastering service", "pricing": "Subscription", "gem": True},
                {"name": "Roex", "url": "https://roexaudio.com", "description": "AI mixing and mastering with automatic adjustments", "pricing": "Subscription", "gem": True},
                {"name": "CryoMix", "url": "https://cryomix.com", "description": "AI mixing/mastering for vocalists and rappers", "pricing": "Pay per use", "gem": True},
                {"name": "Mixea", "url": "https://mixea.com", "description": "AI mastering by DistroKid creators", "pricing": "Subscription", "gem": True},
                {"name": "Waves Online Mastering", "url": "https://waves.com/online-mastering", "description": "AI mastering engine from Waves", "pricing": "Pay per use"},
                {"name": "Focusrite Fast Bundle", "url": "https://focusrite.com/fast", "description": "AI-powered mixing plugins bundle", "pricing": "$149", "gem": True},
                {"name": "Sonible Pure Bundle", "url": "https://sonible.com/purebundle", "description": "One-knob AI compressor, limiter, reverb", "pricing": "$149", "gem": True}
            ]
        },
        {
            "id": "composition-midi",
            "name": "Composition & MIDI",
            "tools": [
                {"name": "Orb Producer Suite", "url": "https://hexachords.com/orb-producer-suite", "description": "AI chord, melody, bass & arpeggio generator", "pricing": "$149", "featured": True},
                {"name": "Lemonaide", "url": "https://lemonaide.ai", "description": "#1 AI melody generator by Grammy producers", "pricing": "$99", "featured": True},
                {"name": "Melody Sauce 2", "url": "https://evabeat.com/melody-sauce", "description": "AI melody generator plugin", "pricing": "$99"},
                {"name": "Spark Chords", "url": "https://mozaic.io/spark", "description": "AI chord trigger from text input", "pricing": "$49", "gem": True},
                {"name": "InstaChord 2", "url": "https://wamusictech.com/instachord", "description": "AI chord progressions and voicings", "pricing": "$59", "gem": True},
                {"name": "Magenta Studio", "url": "https://magenta.tensorflow.org/studio", "description": "Google's AI MIDI tools for Ableton", "pricing": "Free", "gem": True},
                {"name": "Captain Plugins", "url": "https://mixedinkey.com/captain-plugins", "description": "AI-assisted chord and melody writing", "pricing": "$149"},
                {"name": "Hookpad", "url": "https://hooktheory.com/hookpad", "description": "AI chord & melody assistant with theory", "pricing": "Subscription", "gem": True},
                {"name": "Scaler 2", "url": "https://pluginboutique.com/scaler", "description": "Music theory and chord progression tool", "pricing": "$69"}
            ]
        },
        {
            "id": "drums-beats",
            "name": "Drums & Beats",
            "tools": [
                {"name": "Atlas 2", "url": "https://algonaut.audio/atlas", "description": "AI sample browser and drum sequencer", "pricing": "$99", "featured": True},
                {"name": "Playbeat 3", "url": "https://audiomodern.com/playbeat", "description": "AI drum sequencer with smart patterns", "pricing": "$69", "featured": True},
                {"name": "Emergent Drums 2", "url": "https://audialab.com/emergent-drums", "description": "AI drum synthesis - infinite unique sounds", "pricing": "$149", "gem": True},
                {"name": "Drumnet", "url": "https://drumnet.ai", "description": "AI drum pattern generator", "pricing": "Free", "gem": True},
                {"name": "XLN XO", "url": "https://xlnaudio.com/xo", "description": "AI-powered beat maker and sample organizer", "pricing": "$179"},
                {"name": "Splice Beat Maker", "url": "https://splice.com/beat-maker", "description": "AI beat creation with Splice samples", "pricing": "Subscription", "gem": True}
            ]
        },
        {
            "id": "vocal-processing",
            "name": "Vocal Processing",
            "tools": [
                {"name": "Auto-Tune", "url": "https://antarestech.com", "description": "Industry-standard pitch correction", "pricing": "$99-399", "featured": True},
                {"name": "Melodyne", "url": "https://celemony.com/melodyne", "description": "Advanced pitch and time editing", "pricing": "$99-699", "featured": True},
                {"name": "Waves Clarity VX Pro", "url": "https://waves.com/clarity-vx-pro", "description": "AI vocal noise reduction", "pricing": "$199"},
                {"name": "iZotope Nectar", "url": "https://izotope.com/nectar", "description": "AI vocal chain and processing", "pricing": "$249"},
                {"name": "Synthesizer V", "url": "https://dreamtonics.com/synthesizerv", "description": "AI vocal synthesis for realistic singing", "pricing": "$89+", "gem": True},
                {"name": "Vocaloid 6", "url": "https://vocaloid.com", "description": "AI vocal synthesis by Yamaha", "pricing": "$225", "gem": True},
                {"name": "iZotope VocalSynth", "url": "https://izotope.com/vocalsynth", "description": "AI vocal effects and transformation", "pricing": "$199", "gem": True}
            ]
        },
        {
            "id": "stem-separation",
            "name": "Stem Separation",
            "tools": [
                {"name": "LALAL.AI", "url": "https://lalal.ai", "description": "AI audio separation - extract vocals/instruments", "pricing": "Pay per use", "featured": True},
                {"name": "Moises", "url": "https://moises.ai", "description": "AI stem separation and practice tool", "pricing": "Free / Paid", "featured": True},
                {"name": "Fadr", "url": "https://fadr.com", "description": "Free AI vocal remover and stem splitter", "pricing": "Free", "gem": True},
                {"name": "Ultimate Vocal Remover", "url": "https://ultimatevocalremover.com", "description": "Open-source AI stem separation", "pricing": "Free", "gem": True},
                {"name": "AudioStrip", "url": "https://audiostrip.co.uk", "description": "AI vocal isolation online", "pricing": "Free / Paid", "gem": True},
                {"name": "Gaudio Studio", "url": "https://gaudiolab.com", "description": "Professional AI stem separation", "pricing": "Subscription", "gem": True}
            ]
        },
        {
            "id": "voice-speech",
            "name": "Voice & Speech",
            "tools": [
                {"name": "ElevenLabs", "url": "https://elevenlabs.io", "description": "Leading AI voice synthesis and cloning", "pricing": "Free / Paid", "featured": True},
                {"name": "Murf AI", "url": "https://murf.ai", "description": "AI voice generator with 120+ voices", "pricing": "Free / Paid"},
                {"name": "Play.ht", "url": "https://play.ht", "description": "AI text-to-speech with realistic voices", "pricing": "Free / Paid"},
                {"name": "Resemble AI", "url": "https://resemble.ai", "description": "AI voice cloning and synthesis", "pricing": "Paid", "gem": True},
                {"name": "Speechify", "url": "https://speechify.com", "description": "Text to speech with natural voices", "pricing": "Free / Paid"},
                {"name": "Lovo AI", "url": "https://lovo.ai", "description": "AI voice & video with 500+ voices", "pricing": "Free / Paid"},
                {"name": "WellSaid Labs", "url": "https://wellsaidlabs.com", "description": "Enterprise AI voice generation", "pricing": "Paid", "gem": True},
                {"name": "Typecast", "url": "https://typecast.ai", "description": "AI voice actors for content creation", "pricing": "Free / Paid", "gem": True}
            ]
        },
        {
            "id": "audio-enhancement",
            "name": "Audio Enhancement",
            "tools": [
                {"name": "Adobe Podcast", "url": "https://podcast.adobe.com", "description": "AI-powered audio enhancement", "pricing": "Free", "featured": True},
                {"name": "Krisp", "url": "https://krisp.ai", "description": "AI noise cancellation for calls", "pricing": "Free / Paid"},
                {"name": "Cleanvoice AI", "url": "https://cleanvoice.ai", "description": "AI podcast editing - removes filler words", "pricing": "Pay per use", "gem": True},
                {"name": "Podcastle", "url": "https://podcastle.ai", "description": "AI podcast studio - record, edit, enhance", "pricing": "Free / Paid"},
                {"name": "Descript", "url": "https://descript.com", "description": "AI audio/video editing with transcription", "pricing": "Free / Paid", "featured": True},
                {"name": "Auphonic", "url": "https://auphonic.com", "description": "AI audio post-production and leveling", "pricing": "Free / Paid", "gem": True},
                {"name": "TAIP", "url": "https://babyaud.io/taip", "description": "AI tape saturation plugin", "pricing": "$49", "gem": True},
                {"name": "Adaptiverb", "url": "https://zynaptiq.com/adaptiverb", "description": "AI adaptive reverb plugin", "pricing": "$249", "gem": True},
                {"name": "Neoverb", "url": "https://izotope.com/neoverb", "description": "AI intelligent reverb by iZotope", "pricing": "$129", "gem": True}
            ]
        },
        {
            "id": "sound-design",
            "name": "Sound Design & Samples",
            "tools": [
                {"name": "Splice", "url": "https://splice.com", "description": "Sample library with AI-powered search", "pricing": "Subscription", "featured": True},
                {"name": "Synplant 2", "url": "https://soniccharge.com/synplant", "description": "AI synth patch generator from audio", "pricing": "$149", "gem": True},
                {"name": "Text to Sample", "url": "https://texttosample.com", "description": "Generate samples from text descriptions", "pricing": "Free", "gem": True},
                {"name": "Cosmos", "url": "https://waves.com/cosmos", "description": "AI sample finder and organizer", "pricing": "Free", "gem": True},
                {"name": "Samplette", "url": "https://samplette.io", "description": "AI sample discovery platform", "pricing": "Free", "gem": True},
                {"name": "Output Arcade", "url": "https://output.com/arcade", "description": "Loop synthesizer with AI suggestions", "pricing": "Subscription"},
                {"name": "WavTool", "url": "https://wavtool.com", "description": "AI-powered browser DAW", "pricing": "Free / Paid", "gem": True}
            ]
        },
        {
            "id": "lyrics-songwriting",
            "name": "Lyrics & Songwriting",
            "tools": [
                {"name": "LyricStudio", "url": "https://lyricstudio.net", "description": "AI lyrics generator and rhyme assistant", "pricing": "Free / Paid", "featured": True},
                {"name": "Jarvis Lyrics", "url": "https://jarvis.ai/lyrics", "description": "AI songwriting assistant", "pricing": "Subscription", "gem": True},
                {"name": "Melody Studio", "url": "https://melodystudio.net", "description": "AI melody generator for lyrics", "pricing": "Free / Paid", "gem": True},
                {"name": "These Lyrics Do Not Exist", "url": "https://theselyricsdonotexist.com", "description": "AI-generated song lyrics", "pricing": "Free", "gem": True},
                {"name": "Amadeus Code", "url": "https://amadeuscode.com", "description": "AI songwriting app", "pricing": "Subscription", "gem": True}
            ]
        }
    ]
    
    audio_cat['subcategories'] = new_subcategories

# Save the updated data
with open('client/public/mindmap_data.json', 'w') as f:
    json.dump(data, f, indent=2)

print("Music tools added and Audio category restructured!")

# Count tools
total = sum(len(sub['tools']) for sub in new_subcategories)
print(f"Total tools in Audio & Music: {total}")
