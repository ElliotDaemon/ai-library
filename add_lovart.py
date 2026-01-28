import json

with open('client/public/mindmap_data.json', 'r') as f:
    data = json.load(f)

# Lovart.ai - AI Design Agent / Automated Graphic Design Platform
# Category: Image & Art > AI Design Tools

new_tool = {
    "name": "Lovart.ai",
    "url": "https://lovart.ai",
    "description": "The world's first AI Design Agent. Automated graphic design platform that creates professional designs through AI-powered automation.",
    "pricing": "Freemium",
    "isGem": True
}

# Find the Image & Art > AI Design Tools subcategory
for cat in data['categories']:
    if cat['name'] == 'Image & Art':
        for subcat in cat.get('subcategories', []):
            if subcat['name'] == 'AI Design Tools':
                # Check if already exists
                existing = [t for t in subcat.get('tools', []) if t['name'].lower() == new_tool['name'].lower()]
                if not existing:
                    # Get max ID
                    max_id = 330
                    for c in data['categories']:
                        for s in c.get('subcategories', []):
                            for t in s.get('tools', []):
                                if t.get('id', 0) > max_id:
                                    max_id = t.get('id', 0)
                    
                    new_tool['id'] = max_id + 1
                    subcat['tools'].append(new_tool)
                    print(f"Added: Lovart.ai with ID {new_tool['id']}")
                else:
                    print("Lovart.ai already exists")
                break
        break

with open('client/public/mindmap_data.json', 'w') as f:
    json.dump(data, f, indent=2)

print("Done!")
