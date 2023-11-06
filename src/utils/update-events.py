import os
import requests
import re
from datetime import datetime, timezone

# Load environment variables from .env file
from dotenv import load_dotenv
load_dotenv()

# Configuration
BOT_TOKEN = os.getenv('DISCORD_BOT_TOKEN')
GUILD_ID = os.getenv('DISCORD_GUILD_ID')
PAT = os.getenv('GH_PAT')  # Personal Access Token for GitHub
REPO = os.getenv('REPO_NAME')
FILE_PATH = 'src/content/post/events.md'

# Function to fetch channel name for events from Discord
def fetch_discord_channel_name(channel_id, bot_token):
    try:
        url = f"https://discord.com/api/v9/channels/{channel_id}"
        headers = {
            "Authorization": f"Bot {bot_token}"
        }
        response = requests.get(url, headers=headers)
        response.raise_for_status()  # This will raise an exception for HTTP error responses
        channel = response.json()
        return channel.get('name', 'Unknown Channel')  # Return the name of the channel or 'Unknown Channel' if not found
    except Exception as e:
        print(f"Error fetching channel name: {e}")
        return 'Unknown Channel'  # Return a default value in case of any error


# Function to fetch events from Discord
def fetch_discord_events(guild_id, bot_token):
    url = f"https://discord.com/api/v9/guilds/{guild_id}/scheduled-events"
    headers = {
        "Authorization": f"Bot {bot_token}"
    }
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        events = response.json()
        return process_discord_events(events, bot_token)
    except requests.RequestException as e:
        print(f"Error fetching events: {e}")
        return []

# Process and return events in a structured format
def process_discord_events(events, bot_token):
    structured_events = []
    for event in events:
        if event['status'] == 1:  # 1 is for SCHEDULED events
            start_time = datetime.fromisoformat(event['scheduled_start_time'])
            # Ensure start_time is aware by assigning UTC timezone if it's not set
            if start_time.tzinfo is None:
                start_time = start_time.replace(tzinfo=timezone.utc)
            channel_id = event.get('channel_id')
            channel_name = fetch_discord_channel_name(channel_id, bot_token) if channel_id else 'Unknown Channel'
            print(f"Event: {event['name']}, Channel ID: {channel_id}, Channel Name: {channel_name}")  # Debug print
            structured_events.append({
                "name": event['name'],
                "date": start_time.date(),
                "start_time": start_time,
                "end_time": event.get('scheduled_end_time'),
                "description": event.get('description', 'No description provided.'),
                "channel_name": channel_name,
                "section": 'upcoming' if start_time >= datetime.now(timezone.utc) else 'past'
            })
    return structured_events


# Function to parse markdown content and extract events
def parse_markdown(content):
    frontmatter, event_content = content.split('---\n', 2)[1:3]
    current_datetime = datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')
    frontmatter = re.sub(r'publishDate:.*', f'publishDate: {current_datetime}', frontmatter)
    pattern = r'(## [^\n]+)\n\nDate: ([^\n]+)\n\nDescription:\n([^\n]+(?:\n\n[^\n]+)*)\n\nLocation: ([^\n]+)'
    matches = re.findall(pattern, event_content, re.DOTALL)
    existing_events = []
    for match in matches:
        name, date_str, description, location = match
        date = datetime.strptime(date_str, '%b %d, %Y').date()
        existing_events.append({
            'name': name.strip('# '),
            'date': date,
            'description': description.strip(),
            'location': location,
            'section': 'upcoming' if date >= datetime.now().date() else 'past'
        })
    return frontmatter, existing_events

# Function to merge new events with existing ones and generate markdown content
def merge_and_generate_markdown(frontmatter, existing_events, new_events):
    # Remove past events that are now outdated
    existing_events = [event for event in existing_events if event['section'] == 'upcoming' or event['date'] >= datetime.now().date()]
    # Merge new events with existing events
    for new_event in new_events:
        if new_event not in existing_events:
            existing_events.append(new_event)
    # Sort events by date
    existing_events.sort(key=lambda x: x['date'])
    # Generate updated markdown content
    upcoming_events_md = '\n\n'.join(
        f"## {event['name']}\n\nDate: {event['date'].strftime('%b %d, %Y')}\n\nDescription:\n{event['description']}\n\nLocation: {event['channel_name']}"
        for event in existing_events if event['section'] == 'upcoming')
    past_events_md = '\n\n'.join(
        f"## {event['name']}\n\nDate: {event['date'].strftime('%b %d, %Y')}\n\nDescription:\n{event['description']}\n\nLocation: {event['channel_name']}"
        for event in existing_events if event['section'] == 'past')
    
    # Debug print
    print("Upcoming Events Markdown:")
    print(upcoming_events_md)
    print("Past Events Markdown:")
    print(past_events_md)

    # Combine the updated frontmatter with the updated event content
    updated_content = f"---\n{frontmatter}---\n\n# Upcoming Events\n\n{upcoming_events_md}\n\n# Past Events\n\n{past_events_md}\n"
    return updated_content


# Main function to run the script
def main():
    events = fetch_discord_events(GUILD_ID, BOT_TOKEN)
    print(events)
    try:
        with open(FILE_PATH, 'r', encoding='utf-8') as file:
            content = file.read()
        frontmatter, existing_events = parse_markdown(content)
        updated_content = merge_and_generate_markdown(frontmatter, existing_events, events)
        with open(FILE_PATH, 'w', encoding='utf-8') as file:
            file.write(updated_content)
        print("The events.md file has been updated successfully.")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == '__main__':
    main()

# # Function to authenticate with GitHub
# def authenticate_with_github(GH_PAT):
#     return Github(GH_PAT)

# # Function to get file from GitHub
# def get_github_file(REPO, FILE_PATH):
#     contents = repo.get_contents(file_path, ref="main")
#     return contents.decoded_content.decode('utf-8'), contents.sha

# # Function to update file on GitHub
# def update_github_file(REPO, FILE_PATH, content, sha, commit_message="Update events"):
#     repo.update_file(FILE_PATH, commit_message, content, sha, branch="main")