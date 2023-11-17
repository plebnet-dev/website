import os
import requests
import json
from datetime import datetime
from github import Github, GithubException

# Load environment variables from .env file
from dotenv import load_dotenv

load_dotenv()

# Configuration
bot_token = os.getenv("DISCORD_BOT_TOKEN")
guild_id = os.getenv("DISCORD_GUILD_ID")
github_pat = os.getenv("MY_GITHUB_PAT")  # Personal Access Token for GitHub
repo_name = "saucy-tech/plebnet-website"
file_path = "public/data/events.json"


# Load existing events from JSON
def read_json(file_path):
    with open(file_path, "r") as file:
        return json.load(file)


# Move events to pastEvents in JSON
def move_events(events_data):
    today = datetime.now().date()
    for event in events_data["upcomingEvents"][:]:
        event_date = datetime.strptime(event["date"], "%Y-%m-%d").date()
        if event_date < today:
            events_data["pastEvents"].append(event)
            events_data["upcomingEvents"].remove(event)
    return events_data


# Fetch events from Discord
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


# Fetch channel name for events from Discord
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


# Helper function to process and return upcoming events in a structured format
def process_discord_events(events, bot_token):
    upcoming_events = []
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
            if start_time.date() >= datetime.now().date():
                upcoming_events.append(
                    {
                        "id": event["id"],
                        "name": event_name,
                        "date": start_time.date().isoformat(),  # Convert date to string
                        "description": event["description"].strip(),
                        "location": channel_name,
                    }
                )
    return upcoming_events


# Authenticate with GitHub using a personal access token
def authenticate_with_github(github_pat):
    return Github(github_pat)


# Write the JSON file on GitHub
def update_github_json_file(
    repo_name, file_path, data, github_pat, commit_message="Update events"
):
    g = authenticate_with_github(github_pat)
    repo = g.get_repo(repo_name)
    content = json.dumps(data, indent=4)
    try:
        contents = repo.get_contents(file_path, ref="main")
        repo.update_file(
            contents.path, commit_message, content, contents.sha, branch="main"
        )
    except GithubException as e:  # Corrected exception handling
        if e.status == 404:  # File not found
            repo.create_file(file_path, commit_message, content, branch="main")
        else:
            raise


# # Write the JSON file locally
# def write_local_json(file_path, data):
#     with open(file_path, "w") as file:
#         json.dump(data, file, indent=4)


def main():
    # Load existing events
    events_data = read_json(file_path)

    # Move past events based on date
    events_data = move_events(events_data)

    # Fetch new events from Discord
    new_events = fetch_discord_events(guild_id, bot_token)

    # Add new events to upcomingEvents dictionary
    for new_event in new_events:
        if new_event not in events_data["upcomingEvents"]:
            events_data["upcomingEvents"].append(new_event)

    # Testing - Write the JSON file locally
    # write_local_json(file_path, events_data)
    # print("Events updated successfully.")

    # Write the JSON file on Github
    update_github_json_file(repo_name, file_path, events_data, github_pat)
    print("The events.json file has been updated successfully on GitHub.")


if __name__ == "__main__":
    main()
