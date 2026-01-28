import json

# Load existing data
with open('client/public/mindmap_data.json', 'r') as f:
    data = json.load(f)

# New tools to add with CORRECT subcategory IDs
new_tools = {
    "image": {
        "image-gen": [
            {"name": "Dreamina", "url": "https://dreamina.ai", "description": "All-in-one AI creative suite for all your artistic work", "pricing": "Free / Paid", "featured": True, "gem": True}
        ]
    },
    "video": {
        "video-gen": [
            {"name": "VidAU", "url": "https://vidau.ai", "description": "Turn product images into scroll-stopping video ads", "pricing": "Free / Paid", "gem": True},
            {"name": "Pippit AI", "url": "https://pippit.ai", "description": "Smart video & image creator for marketing success", "pricing": "Free / Paid", "gem": True},
            {"name": "Pika Labs", "url": "https://pika.art", "description": "AI video generation with creative controls", "pricing": "Free / Paid", "gem": True},
            {"name": "Colossyan", "url": "https://colossyan.com", "description": "AI video for learning and training content", "pricing": "Paid", "gem": True},
            {"name": "Hour One", "url": "https://hourone.ai", "description": "AI video production with virtual presenters", "pricing": "Paid", "gem": True},
            {"name": "Elai.io", "url": "https://elai.io", "description": "AI video generator from text with avatars", "pricing": "Free / Paid", "gem": True},
            {"name": "Pictory", "url": "https://pictory.ai", "description": "AI video creation from long-form text content", "pricing": "Free / Paid", "gem": True}
        ],
        "video-edit": [
            {"name": "Descript", "url": "https://descript.com", "description": "AI video/audio editing - edit video like a doc", "pricing": "Free / Paid", "featured": True},
            {"name": "Kapwing", "url": "https://kapwing.com", "description": "AI video editor with smart tools", "pricing": "Free / Paid"}
        ]
    },
    "audio": {
        "voice": [
            {"name": "Murf AI", "url": "https://murf.ai", "description": "AI voice generator with 120+ voices", "pricing": "Free / Paid"},
            {"name": "Play.ht", "url": "https://play.ht", "description": "AI voice generator and text-to-speech", "pricing": "Free / Paid"},
            {"name": "Resemble AI", "url": "https://resemble.ai", "description": "AI voice cloning and synthesis", "pricing": "Paid", "gem": True},
            {"name": "Speechify", "url": "https://speechify.com", "description": "Text to speech with natural voices", "pricing": "Free / Paid"},
            {"name": "Lovo AI", "url": "https://lovo.ai", "description": "AI voice & video with 500+ voices", "pricing": "Free / Paid"},
            {"name": "WellSaid Labs", "url": "https://wellsaidlabs.com", "description": "Enterprise AI voice generation", "pricing": "Paid", "gem": True},
            {"name": "Typecast", "url": "https://typecast.ai", "description": "AI voice actors for content creation", "pricing": "Free / Paid", "gem": True}
        ],
        "music-gen": [
            {"name": "Soundraw", "url": "https://soundraw.io", "description": "AI music generation for creators", "pricing": "Free / Paid"},
            {"name": "Boomy", "url": "https://boomy.com", "description": "AI music creation - make songs in seconds", "pricing": "Free / Paid", "gem": True},
            {"name": "AIVA", "url": "https://aiva.ai", "description": "AI music composer for emotional soundtracks", "pricing": "Free / Paid"},
            {"name": "Beatoven.ai", "url": "https://beatoven.ai", "description": "AI music for videos - royalty-free", "pricing": "Free / Paid", "gem": True},
            {"name": "Soundful", "url": "https://soundful.com", "description": "AI music generator for content creators", "pricing": "Free / Paid", "gem": True},
            {"name": "Riffusion", "url": "https://riffusion.com", "description": "AI music from text descriptions", "pricing": "Free", "gem": True},
            {"name": "Stable Audio", "url": "https://stableaudio.com", "description": "Stability AI's audio generation", "pricing": "Free / Paid", "gem": True}
        ],
        "audio-tools": [
            {"name": "Adobe Podcast", "url": "https://podcast.adobe.com", "description": "AI audio enhancement for podcasts", "pricing": "Free"},
            {"name": "Cleanvoice AI", "url": "https://cleanvoice.ai", "description": "AI podcast editing - removes filler words", "pricing": "Pay per use", "gem": True},
            {"name": "Podcastle", "url": "https://podcastle.ai", "description": "AI podcast studio - record, edit, enhance", "pricing": "Free / Paid"},
            {"name": "Lalal.ai", "url": "https://lalal.ai", "description": "AI audio separation - extract vocals/instruments", "pricing": "Pay per use", "gem": True},
            {"name": "Moises", "url": "https://moises.ai", "description": "AI for musicians - stem separation", "pricing": "Free / Paid", "gem": True},
            {"name": "Krisp", "url": "https://krisp.ai", "description": "AI noise cancellation for calls", "pricing": "Free / Paid"}
        ]
    },
    "writing": {
        "copywriting": [
            {"name": "Tome", "url": "https://tome.app", "description": "AI storytelling - create narratives with AI", "pricing": "Free / Paid", "gem": True}
        ]
    },
    "research": {
        "research-tools": [
            {"name": "Tana", "url": "https://tana.inc", "description": "Put your notes to work with voice and AI", "pricing": "Free / Paid", "gem": True},
            {"name": "Thea", "url": "https://thea.study", "description": "AI-powered personalized study platform", "pricing": "Free / Paid", "gem": True}
        ]
    },
    "productivity": {
        "meetings": [
            {"name": "Otter.ai", "url": "https://otter.ai", "description": "AI meeting transcription and notes", "pricing": "Free / Paid", "featured": True},
            {"name": "Fireflies.ai", "url": "https://fireflies.ai", "description": "AI meeting notes and transcription", "pricing": "Free / Paid"},
            {"name": "Fathom", "url": "https://fathom.video", "description": "AI meeting assistant - free recording & transcription", "pricing": "Free / Paid", "gem": True},
            {"name": "Grain", "url": "https://grain.com", "description": "AI meeting highlights and clips", "pricing": "Free / Paid", "gem": True},
            {"name": "tl;dv", "url": "https://tldv.io", "description": "AI meeting recorder for Google Meet & Zoom", "pricing": "Free / Paid", "gem": True},
            {"name": "Sembly AI", "url": "https://sembly.ai", "description": "AI meeting assistant with action items", "pricing": "Free / Paid", "gem": True},
            {"name": "Proactor.ai", "url": "https://proactor.ai", "description": "AI meeting helper for productivity", "pricing": "Varies", "gem": True}
        ],
        "automation": [
            {"name": "Reclaim AI", "url": "https://reclaim.ai", "description": "Smart calendar - AI scheduling assistant", "pricing": "Free / Paid", "gem": True},
            {"name": "Goblin Tools", "url": "https://goblin.tools", "description": "AI productivity tools for neurodivergent users", "pricing": "Free", "gem": True}
        ],
        "email": [
            {"name": "SaneBox", "url": "https://sanebox.com", "description": "AI email management and organization", "pricing": "Paid", "gem": True}
        ]
    },
    "business": {
        "marketing": [
            {"name": "Aha", "url": "https://aha.io/ai", "description": "The world's first AI influencer marketing team", "pricing": "Paid", "gem": True}
        ],
        "analytics": [
            {"name": "Sagehood", "url": "https://sagehood.ai", "description": "AI agents for 360 analysis of the U.S stock market", "pricing": "Paid", "gem": True}
        ]
    },
    "nocode": {
        "web-builders": [
            {"name": "Chronicle", "url": "https://chronicle.io", "description": "Cursor for Slides - stunning presentations with AI", "pricing": "Free / Paid", "featured": True, "gem": True},
            {"name": "PageOn.AI", "url": "https://pageon.ai", "description": "Cursor for Visual Communication, beyond slides", "pricing": "Free / Paid", "gem": True},
            {"name": "Gamma", "url": "https://gamma.app", "description": "AI presentation maker - create decks instantly", "pricing": "Free / Paid", "featured": True},
            {"name": "Decktopus", "url": "https://decktopus.com", "description": "AI presentation tool with smart templates", "pricing": "Free / Paid", "gem": True},
            {"name": "ChatSlide.ai", "url": "https://chatslide.ai", "description": "Turns content into presentations with AI", "pricing": "Free / Paid", "gem": True},
            {"name": "Framer AI", "url": "https://framer.com", "description": "AI website builder with design tools", "pricing": "Free / Paid", "featured": True}
        ]
    }
}

# Function to find and add tools to subcategories
def add_tools_to_category(categories, cat_id, subcat_id, tools):
    for category in categories:
        if category['id'] == cat_id:
            for subcategory in category.get('subcategories', []):
                if subcategory['id'] == subcat_id:
                    existing_names = {t['name'].lower() for t in subcategory['tools']}
                    for tool in tools:
                        if tool['name'].lower() not in existing_names:
                            subcategory['tools'].append(tool)
                            print(f"Added {tool['name']} to {category['name']} > {subcategory['name']}")
                    return True
    return False

# Add all new tools
for cat_id, subcats in new_tools.items():
    for subcat_id, tools in subcats.items():
        if not add_tools_to_category(data['categories'], cat_id, subcat_id, tools):
            print(f"Could not find {cat_id} > {subcat_id}")

# Save updated data
with open('client/public/mindmap_data.json', 'w') as f:
    json.dump(data, f, indent=2)

# Count total tools
total = 0
gems = 0
for cat in data['categories']:
    for subcat in cat.get('subcategories', []):
        total += len(subcat['tools'])
        gems += sum(1 for t in subcat['tools'] if t.get('gem'))

print(f"\nTotal tools: {total}")
print(f"Hidden gems: {gems}")
