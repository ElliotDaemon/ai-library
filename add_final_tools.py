import json

with open('client/public/mindmap_data.json', 'r') as f:
    data = json.load(f)

# Remaining tools with CORRECT category names
new_tools = [
    # Writing tools
    {"name": "Machined.ai", "url": "https://machined.ai", "description": "AI-powered blog posts at scale. Generate SEO-optimized content automatically.", "pricing": "Paid", "category": "Writing & Content", "subcategory": "Copywriting", "isGem": True},
    {"name": "Scribeshadow", "url": "https://scribeshadow.com", "description": "Translate content from English to Dutch, German, Italian, French, Spanish, Portuguese.", "pricing": "Paid", "category": "Writing & Content", "subcategory": "Writing Assistants", "isGem": True},
    {"name": "GPTales", "url": "https://gptales.com", "description": "AI bedtime stories with images and voice for children.", "pricing": "Free", "category": "Writing & Content", "subcategory": "Writing Assistants", "isGem": True},
    {"name": "Rephrasy", "url": "https://rephrasy.ai", "description": "Grammar, typos, clarity and tone improvement tool.", "pricing": "Freemium", "category": "Writing & Content", "subcategory": "Writing Assistants", "isGem": True},
    {"name": "RewriteBar", "url": "https://rewritebar.com", "description": "AI writing assistant for Mac that rewrites and improves text.", "pricing": "Paid", "category": "Writing & Content", "subcategory": "Writing Assistants", "isGem": True},
    {"name": "Kerlig AI", "url": "https://kerlig.com", "description": "AI writing assistant for Mac with quick access shortcuts.", "pricing": "Paid", "category": "Writing & Content", "subcategory": "Writing Assistants", "isGem": True},
    {"name": "VerbalTide", "url": "https://verbaltide.lumenharbor.co.uk", "description": "Write blog articles from videos. Upload audio/video or use YouTube links.", "pricing": "Freemium", "category": "Writing & Content", "subcategory": "Long-form Content", "isGem": True},
    
    # Research tools
    {"name": "AskLibrary", "url": "https://asklibrary.ai", "description": "Get personalized advice from books across your entire library.", "pricing": "Paid", "category": "Research & Knowledge", "subcategory": "Research Tools", "isGem": True},
    
    # Productivity tools
    {"name": "Vomo AI", "url": "https://vomo.ai", "description": "Records and transcribes meetings fast, lets you ask questions from notes.", "pricing": "Freemium", "category": "Productivity & Automation", "subcategory": "Meeting AI", "isGem": True},
    {"name": "FigJam AI", "url": "https://figma.com/figjam", "description": "AI-powered diagrams and flowcharts for brainstorming.", "pricing": "Freemium", "category": "Productivity & Automation", "subcategory": "Automation", "isGem": False},
    {"name": "Scribe AI", "url": "https://scribehow.com", "description": "Automatically documents workflows into step-by-step guides.", "pricing": "Freemium", "category": "Productivity & Automation", "subcategory": "Automation", "isGem": True},
    {"name": "Jotform AI", "url": "https://jotform.com/ai", "description": "AI-powered form builder and agents for automation.", "pricing": "Freemium", "category": "Productivity & Automation", "subcategory": "Automation", "isGem": False},
    {"name": "PopAi", "url": "https://popai.pro", "description": "AI presentation agent that turns docs and notes into professional slides.", "pricing": "Freemium", "category": "Business & Marketing", "subcategory": "Marketing AI", "isGem": True},
    
    # Data tools
    {"name": "Sourcetable", "url": "https://sourcetable.com", "description": "AI spreadsheet for data analysis, SEO, forecasting, web scraping. Excel + ChatGPT.", "pricing": "Freemium", "category": "Data & Analytics", "subcategory": "Data Analysis", "isGem": True},
]

# Build subcategory lookup
subcategory_ids = {}
for cat in data['categories']:
    for subcat in cat.get('subcategories', []):
        key = f"{cat['name']}|{subcat['name']}"
        subcategory_ids[key] = subcat['id']

max_tool_id = 316
for cat in data['categories']:
    for subcat in cat.get('subcategories', []):
        for tool in subcat.get('tools', []):
            tool_id = tool.get('id', 0)
            if tool_id > max_tool_id:
                max_tool_id = tool_id

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
                            print(f"Skipped: {tool['name']}")
                        break
                break
    else:
        print(f"NOT FOUND: {key}")

with open('client/public/mindmap_data.json', 'w') as f:
    json.dump(data, f, indent=2)

print(f"\nTotal tools added: {tools_added}")
print(f"Final tool ID: {max_tool_id}")
