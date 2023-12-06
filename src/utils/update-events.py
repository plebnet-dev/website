import os
import requests
import json
from datetime import datetime
from github import Github, GithubException
import logging
from datetime import datetime
import pytz

# Load environment variables from .env file
from dotenv import load_dotenv

load_dotenv()

# Configuration
DISCORD_BOT_TOKEN = os.getenv("DISCORD_BOT_TOKEN")
DISCORD_GUILD_ID = os.getenv("DISCORD_GUILD_ID")
MY_GITHUB_PAT = os.getenv("MY_GITHUB_PAT")  # Personal Access Token for GitHub
REPO_NAME = "saucy-tech/plebnet-website"
FILE_PATH = "public/data/events.json"

# Initialize logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)


# Load existing events from JSON
def read_json(file_path):
    try:
        with open(file_path, "r") as file:
            return json.load(file)
    except FileNotFoundError:
        logging.error(f"File not found: {file_path}")
        return {"upcomingEvents": [], "pastEvents": []}


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
    if not guild_id or not bot_token:
        logging.error(
            "DISCORD_GUILD_ID or DISCORD_BOT_TOKEN is not set. Please check your environment variables."
        )
        return []
    url = f"https://discord.com/api/v9/guilds/{guild_id}/scheduled-events"
    headers = {"Authorization": f"Bot {bot_token}"}
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        logging.error(f"Error fetching events: {e}")
        return []


# Fetch channel name for events from Discord
def fetch_discord_channel_name(channel_id, bot_token):
    if not channel_id or not bot_token:
        return "Unknown Channel"
    try:
        url = f"https://discord.com/api/v9/channels/{channel_id}"
        headers = {"Authorization": f"Bot {bot_token}"}
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        return response.json().get("name", "Unknown Channel")
    except requests.RequestException as e:
        logging.error(f"Error fetching channel name: {e}")
        return "Unknown Channel"


# Update upcoming events
def update_upcoming_events(existing_events, fetched_events):
    updated_events = {event["id"]: event for event in existing_events}
    for event in fetched_events:
        if event["status"] == 1:  # Check if event is scheduled
            event_id = event["id"]
            start_time = datetime.fromisoformat(event["scheduled_start_time"])
            if start_time.tzinfo is None:
                start_time = start_time.replace(tzinfo=pytz.utc)
            channel_name = (
                fetch_discord_channel_name(event.get("channel_id"), DISCORD_BOT_TOKEN)
                if event.get("channel_id")
                else "No location"
            )
            updated_events[event_id] = {
                "id": event_id,
                "name": event["name"].strip(),
                "date": start_time.date().isoformat(),
                "description": event.get("description", "").strip(),
                "location": channel_name,
            }
    return list(updated_events.values())


# Authenticate with GitHub using a personal access token
def authenticate_with_github(github_pat):
    return Github(github_pat)


# Write the JSON file on GitHub
# def update_github_json_file(
#     repo_name, file_path, data, github_pat, commit_message="Update events"
# ):
#     g = authenticate_with_github(github_pat)
#     repo = g.get_repo(repo_name)
#     content = json.dumps(data, indent=4)
#     try:
#         contents = repo.get_contents(file_path, ref="main")
#         repo.update_file(
#             contents.path, commit_message, content, contents.sha, branch="main"
#         )
#     except GithubException as e:  # Corrected exception handling
#         if e.status == 404:  # File not found
#             repo.create_file(file_path, commit_message, content, branch="main")
#         else:
#             raise


# Write the JSON file locally
def write_local_json(file_path, data):
    try:
        with open(file_path, "w") as file:
            json.dump(data, file, indent=4)
    except IOError as e:
        logging.error(f"Error writing file: {e}")


def main():
    # Load existing events
    events_data = read_json(FILE_PATH)

    # Move past events based on date
    events_data = move_events(events_data)

    # Fetch new events from Discord
    fetched_events = fetch_discord_events(DISCORD_GUILD_ID, DISCORD_BOT_TOKEN)

    # Update upcoming events
    events_data["upcomingEvents"] = update_upcoming_events(
        events_data["upcomingEvents"], fetched_events
    )

    # Write the JSON file locally
    write_local_json(FILE_PATH, events_data)
    logging.info("Events updated successfully.")


# # Write the JSON file on Github
# update_github_json_file(REPO_NAME, FILE_PATH, events_data, MY_GITHUB_PAT)
# print("The events.json file has been updated successfully on GitHub.")
if __name__ == "__main__":
    main()
