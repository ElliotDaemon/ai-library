import json

# Read the current mindmap data
with open('client/public/mindmap_data.json', 'r') as f:
    data = json.load(f)

# Find the highest tool ID
max_id = 0
for cat in data['categories']:
    for sub in cat.get('subcategories', []):
        for tool in sub.get('tools', []):
            if 'id' in tool:
                tool_id = int(tool['id'].replace('tool-', ''))
                if tool_id > max_id:
                    max_id = tool_id

next_id = max_id + 1

# New tools to add
new_tools = [
    {
        "category": "AI Assistants & Agents",
        "subcategory": "AI Agents",
        "tool": {
            "id": f"tool-{next_id}",
            "name": "Moltbot (Clawd)",
            "description": "Open-source personal AI assistant that controls your computer, manages emails, calendar, and integrates with WhatsApp/Telegram. The AI that actually does things.",
            "url": "https://clawd.bot/",
            "pricing": "Free (Open Source)",
            "isGem": True,
            "isNew": True
        }
    },
    {
        "category": "Video & Animation",
        "subcategory": "Video Generation",
        "tool": {
            "id": f"tool-{next_id + 1}",
            "name": "Remotion",
            "description": "Make videos programmatically with React. Create real MP4 videos, parametrize content, render server-side and build video applications.",
            "url": "https://www.remotion.dev/",
            "pricing": "Freemium",
            "isGem": True,
            "isNew": True
        }
    }
]

# Add tools to appropriate categories
for new_tool in new_tools:
    for cat in data['categories']:
        if cat['name'] == new_tool['category']:
            for sub in cat.get('subcategories', []):
                if sub['name'] == new_tool['subcategory']:
                    if 'tools' not in sub:
                        sub['tools'] = []
                    sub['tools'].append(new_tool['tool'])
                    print(f"Added {new_tool['tool']['name']} to {cat['name']} -> {sub['name']}")
                    break

# Save the updated data
with open('client/public/mindmap_data.json', 'w') as f:
    json.dump(data, f, indent=2)

print("Done!")
