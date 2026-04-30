import json
import os
from difflib import unified_diff
from datetime import datetime

FILE_PATH = "data/proposals.json"

def load_data():
    if not os.path.exists(FILE_PATH):
        return {}
    with open(FILE_PATH, "r") as f:
        return json.load(f)

def save_data(data):
    with open(FILE_PATH, "w") as f:
        json.dump(data, f, indent=2)

def save_version(username, client, input_data, proposal):
    data = load_data()
    if username not in data:
        data[username] = {}
    if client not in data[username]:
        data[username][client] = []
    data[username][client].append({
        "timestamp": datetime.now().isoformat(),
        "input": input_data,
        "proposal": proposal
    })
    save_data(data)

def get_client_history(username, client):
    data = load_data()
    user_data = data.get(username, {})
    return user_data.get(client, [])

def get_versions(username, client):
    data = load_data()
    user_data = data.get(username, {})
    versions = user_data.get(client, [])
    if len(versions) < 2:
        return None, None
    return versions[-2], versions[-1]

def compare_versions(username, client):
    old_ver, new_ver = get_versions(username, client)
    
    if not old_ver or not new_ver:
        return "At least 2 versions are needed to compare", ""
    
    old_str = old_ver["proposal"] if isinstance(old_ver, dict) else old_ver
    new_str = new_ver["proposal"] if isinstance(new_ver, dict) else new_ver

    old_lines = old_str.splitlines()
    new_lines = new_str.splitlines()

    diff = "\n".join(unified_diff(old_lines, new_lines, lineterm=""))
    
    # Generate input differences summary
    if not isinstance(old_ver, dict) or not isinstance(new_ver, dict):
        summary = "Could not compute input differences for older format versions."
    else:
        old_input = old_ver.get("input", {})
        new_input = new_ver.get("input", {})
        
        changed = []
        unchanged = []
        
        # User explicitly asked for this string formatting
        key_mapping = {
            'client': 'company name',
            'industry': 'industry',
            'services': 'services',
            'budget': 'budget',
            'discovery_notes': 'discovery notes'
        }
        
        for key, label in key_mapping.items():
            old_val = old_input.get(key, '')
            new_val = new_input.get(key, '')
            
            if old_val != new_val:
                changed.append(f"{label}..changed from [{old_val}] to [{new_val}]")
            else:
                unchanged.append(label)
                
        summary = ""
        if unchanged:
            if len(unchanged) == 1:
                summary += f"{unchanged[0]}..no changes..\n\n"
            else:
                summary += f"{unchanged[0]} and other..no changes..\n\n"
        if changed:
            summary += "\n\n".join(changed)
    
    return diff, summary