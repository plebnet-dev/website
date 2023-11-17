import os
import requests
import json
from datetime import datetime
from github import Github

# Load environment variables from .env file
from dotenv import load_dotenv

load_dotenv()

# Configuration
BOT_TOKEN = os.getenv("DISCORD_BOT_TOKEN")
GUILD_ID = os.getenv("DISCORD_GUILD_ID")
PAT = os.getenv("GH_PAT")  # Personal Access Token for GitHub
REPO = os.getenv("REPO_NAME")
JSON_FILE_PATH = "public/data/events.json"


# Function to authenticate with GitHub
def authenticate_with_github(GH_PAT):
    return Github(GH_PAT)


# Function to fetch channel name for events from Discord
def fetch_discord_channel_name(channel_id, bot_token):
    try:
        url = f"https://discord.com/api/v9/channels/{channel_id}"
        headers = {"Authorization": f"Bot {bot_token}"}
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        channel = response.json()
        return channel.get("name", "Unknown Channel")
    except Exception as e:
        print(f"Error fetching channel name: {e}")
        return "Unknown Channel"


# Function to fetch events from Discord
def fetch_discord_events(guild_id, bot_token):
    url = f"https://discord.com/api/v9/guilds/{guild_id}/scheduled-events"
    headers = {"Authorization": f"Bot {bot_token}"}
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        events = response.json()
        return process_discord_events(events, bot_token)
    except requests.RequestException as e:
        print(f"Error fetching events: {e}")
        return []


# Function to process and return events in a structured format
def process_discord_events(events, bot_token):
    structured_events = []
    for event in events:
        if event["status"] == 1:  # 1 is for SCHEDULED events
            start_time = datetime.fromisoformat(event["scheduled_start_time"])
            if start_time.tzinfo is None:
                start_time = start_time.replace(tzinfo=datetime.timezone.utc)
            channel_id = event.get("channel_id")
            channel_name = (
                fetch_discord_channel_name(channel_id, bot_token)
                if channel_id
                else "No location"
            )
            event_name = event["name"].strip()
            structured_events.append(
                {
                    "id": event["id"],
                    "name": event_name,
                    "date": start_time.date().isoformat(),  # Convert date to string
                    "description": event["description"].strip(),
                    "location": channel_name,
                    "section": "upcoming"
                    if start_time.date() >= datetime.now().date()
                    else "past",
                }
            )
    return structured_events


# Function to fetch and process events from Discord
def fetch_and_process_discord_events(guild_id, bot_token):
    events = fetch_discord_events(guild_id, bot_token)
    upcoming_events = [
        event
        for event in events
        if datetime.fromisoformat(event["date"]).date() >= datetime.now().date()
    ]
    return upcoming_events


# Function to update JSON file on GitHub
def update_github_json_file(
    repo_name, file_path, data, GH_PAT, commit_message="Update events"
):
    g = authenticate_with_github(GH_PAT)
    repo = g.get_repo(repo_name)
    content = json.dumps(data, indent=4)
    try:
        contents = repo.get_contents(file_path, ref="main")
        repo.update_file(
            contents.path, commit_message, content, contents.sha, branch="main"
        )
    except Github.GithubException:
        repo.create_file(file_path, commit_message, content, branch="main")


# Function to read the JSON file
def read_local_json(file_path):
    with open(file_path, "r") as file:
        return json.load(file)


# Function to write the JSON file
def write_local_json(file_path, data):
    with open(file_path, "w") as file:
        json.dump(data, file, indent=4)


# Function to move events to pastEvents in JSON
def update_events(events_data):
    today = datetime.now().date()
    for event in events_data["upcomingEvents"][:]:
        event_date = datetime.strptime(event["date"], "%Y-%m-%d").date()
        if event_date < today:
            events_data["pastEvents"].append(event)
            events_data["upcomingEvents"].remove(event)
    return events_data


def main():
    # Load existing events
    events_data = read_local_json(JSON_FILE_PATH)

    # Update events based on date
    events_data = update_events(events_data)

    # Fetch new events from Discord
    new_events = fetch_and_process_discord_events(GUILD_ID, BOT_TOKEN)

    # Add new events to upcomingEvents
    for new_event in new_events:
        if new_event not in events_data["upcomingEvents"]:
            events_data["upcomingEvents"].append(new_event)

    # Save updated events
    write_local_json(JSON_FILE_PATH, events_data)
    print("Events updated successfully.")

    # For updating GitHub
    # update_github_json_file(REPO, JSON_FILE_PATH, events_data, PAT)
    # print("The events.json file has been updated successfully on GitHub.")


if __name__ == "__main__":
    main()
