import json

# Load the current mindmap data
with open('client/public/mindmap_data.json', 'r') as f:
    data = json.load(f)

# New tools to add with corrected category names
new_tools = [
    # Video tools
    {"name": "Remotion", "url": "https://remotion.dev", "description": "Make videos programmatically with React. Create real MP4 videos, parametrize content, render server-side.", "pricing": "Free", "category": "Video & Animation", "subcategory": "Video Generation", "isGem": True},
    {"name": "EasyVid", "url": "https://easyvid.app", "description": "Make videos from script or text prompt easily.", "pricing": "Freemium", "category": "Video & Animation", "subcategory": "Video Generation", "isGem": True},
    {"name": "Fliki AI", "url": "https://fliki.ai", "description": "Transform scripts or blog posts into engaging videos. 75+ languages, 100+ dialects.", "pricing": "Freemium", "category": "Video & Animation", "subcategory": "Video Generation", "isGem": False},
    
    # Image tools
    {"name": "Pictools AI", "url": "https://pictools.ai", "description": "AI tools for creative and content work - image editing, generation, enhancement.", "pricing": "Freemium", "category": "Image & Art", "subcategory": "Image Editing", "isGem": True},
    {"name": "Dungeon Alchemist", "url": "https://dungeonalchemist.com", "description": "AI-powered fantasy and RPG map generation for tabletop games.", "pricing": "Paid", "category": "Image & Art", "subcategory": "Image Generation", "isGem": True},
    
    # AI Chatbots
    {"name": "OpenRouter", "url": "https://openrouter.ai", "description": "One API that gives you access to every AI model. Unified interface for GPT, Claude, Llama, etc.", "pricing": "Pay-per-use", "category": "AI Assistants & Agents", "subcategory": "AI Chatbots", "isGem": True},
    {"name": "MemoryPlugin", "url": "https://memoryplugin.com", "description": "Long term memory extension for ChatGPT, Claude, Gemini. Memories shared across tools.", "pricing": "Freemium", "category": "AI Assistants & Agents", "subcategory": "AI Chatbots", "isGem": True},
    {"name": "Geekflare Connect", "url": "https://geekflare.com/connect", "description": "Manage multiple AI models (GPT, Claude, Gemini) from one interface.", "pricing": "Freemium", "category": "AI Assistants & Agents", "subcategory": "AI Chatbots", "isGem": True},
    
    # Writing tools - need to find correct category
    {"name": "Machined.ai", "url": "https://machined.ai", "description": "AI-powered blog posts at scale. Generate SEO-optimized content automatically.", "pricing": "Paid", "category": "Writing & Documents", "subcategory": "AI Writing Tools", "isGem": True},
    {"name": "Scribeshadow", "url": "https://scribeshadow.com", "description": "Translate content from English to Dutch, German, Italian, French, Spanish, Portuguese.", "pricing": "Paid", "category": "Writing & Documents", "subcategory": "AI Writing Tools", "isGem": True},
    {"name": "GPTales", "url": "https://gptales.com", "description": "AI bedtime stories with images and voice for children.", "pricing": "Free", "category": "Writing & Documents", "subcategory": "AI Writing Tools", "isGem": True},
    {"name": "Rephrasy", "url": "https://rephrasy.ai", "description": "Grammar, typos, clarity and tone improvement tool.", "pricing": "Freemium", "category": "Writing & Documents", "subcategory": "AI Writing Tools", "isGem": True},
    {"name": "RewriteBar", "url": "https://rewritebar.com", "description": "AI writing assistant for Mac that rewrites and improves text.", "pricing": "Paid", "category": "Writing & Documents", "subcategory": "AI Writing Tools", "isGem": True},
    {"name": "Kerlig AI", "url": "https://kerlig.com", "description": "AI writing assistant for Mac with quick access shortcuts.", "pricing": "Paid", "category": "Writing & Documents", "subcategory": "AI Writing Tools", "isGem": True},
    {"name": "VerbalTide", "url": "https://verbaltide.lumenharbor.co.uk", "description": "Write blog articles from videos. Upload audio/video or use YouTube links.", "pricing": "Freemium", "category": "Writing & Documents", "subcategory": "AI Writing Tools", "isGem": True},
    
    # Research tools
    {"name": "AskLibrary", "url": "https://asklibrary.ai", "description": "Get personalized advice from books across your entire library.", "pricing": "Paid", "category": "Research & Learning", "subcategory": "AI Research", "isGem": True},
    
    # Productivity tools
    {"name": "Vomo AI", "url": "https://vomo.ai", "description": "Records and transcribes meetings fast, lets you ask questions from notes.", "pricing": "Freemium", "category": "Productivity & Work", "subcategory": "AI Productivity", "isGem": True},
    {"name": "FigJam AI", "url": "https://figma.com/figjam", "description": "AI-powered diagrams and flowcharts for brainstorming.", "pricing": "Freemium", "category": "Productivity & Work", "subcategory": "AI Productivity", "isGem": False},
    {"name": "Scribe AI", "url": "https://scribehow.com", "description": "Automatically documents workflows into step-by-step guides.", "pricing": "Freemium", "category": "Productivity & Work", "subcategory": "AI Productivity", "isGem": True},
    {"name": "Jotform AI", "url": "https://jotform.com/ai", "description": "AI-powered form builder and agents for automation.", "pricing": "Freemium", "category": "Productivity & Work", "subcategory": "AI Productivity", "isGem": False},
    {"name": "PopAi", "url": "https://popai.pro", "description": "AI presentation agent that turns docs and notes into professional slides.", "pricing": "Freemium", "category": "Productivity & Work", "subcategory": "AI Presentations", "isGem": True},
    
    # Data tools
    {"name": "Sourcetable", "url": "https://sourcetable.com", "description": "AI spreadsheet for data analysis, SEO, forecasting, web scraping. Excel + ChatGPT.", "pricing": "Freemium", "category": "Data & Analytics", "subcategory": "AI Data Tools", "isGem": True},
]

# Find all category and subcategory names
print("Available categories and subcategories:")
for cat in data['categories']:
    print(f"\n{cat['name']}:")
    for subcat in cat.get('subcategories', []):
        print(f"  - {subcat['name']}")

# Build subcategory lookup
subcategory_ids = {}
for cat in data['categories']:
    for subcat in cat.get('subcategories', []):
        key = f"{cat['name']}|{subcat['name']}"
        subcategory_ids[key] = subcat['id']

# Get the highest tool ID
max_tool_id = 308
for cat in data['categories']:
    for subcat in cat.get('subcategories', []):
        for tool in subcat.get('tools', []):
            tool_id = tool.get('id', 0)
            if tool_id > max_tool_id:
                max_tool_id = tool_id

print(f"\n\nStarting tool ID: {max_tool_id}")

# Add new tools
tools_added = 0
for tool in new_tools:
    key = f"{tool['category']}|{tool['subcategory']}"
    if key in subcategory_ids:
        for cat in data['categories']:
            if cat['name'] == tool['category']:
                for subcat in cat.get('subcategories', []):
                    if subcat['name'] == tool['subcategory']:
                        existing = [t for t in subcat.get('tools', []) if t['name'].lower() == tool['name'].lower()]
                        if not existing:
                            max_tool_id += 1
                            new_tool = {
                                "id": max_tool_id,
                                "name": tool['name'],
                                "url": tool['url'],
                                "description": tool['description'],
                                "pricing": tool['pricing'],
                                "isGem": tool['isGem']
                            }
                            if 'tools' not in subcat:
                                subcat['tools'] = []
                            subcat['tools'].append(new_tool)
                            tools_added += 1
                            print(f"Added: {tool['name']}")
                        else:
                            print(f"Skipped (exists): {tool['name']}")
                        break
                break
    else:
        print(f"NOT FOUND: {key}")

# Save
with open('client/public/mindmap_data.json', 'w') as f:
    json.dump(data, f, indent=2)

print(f"\nTotal tools added: {tools_added}")
