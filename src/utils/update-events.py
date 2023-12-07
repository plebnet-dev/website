import os
import requests
import json
from datetime import datetime
from github import Github, GithubException
import logging
import pytz

# Load environment variables from .env file
from dotenv import load_dotenv

load_dotenv()

# Configuration
DISCORD_BOT_TOKEN = os.getenv("DISCORD_BOT_TOKEN")  # Discord Bot Token
DISCORD_GUILD_ID = os.getenv("DISCORD_GUILD_ID")  # Discord Server ID
MY_GITHUB_PAT = os.getenv("MY_GITHUB_PAT")  # Personal Access Token for GitHub
REPO_NAME = os.getenv("REPO_NAME")  # Repository you are updating
FILE_PATH = "public/data/events.json"  # Path to the events.json file in the repository

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

            # Handling no url in event description
            description = event.get("description", "").strip()
            if description.startswith("http"):
                description = description
            else:
                description = None  # or use an empty string ''

            updated_events[event_id] = {
                "id": event_id,
                "name": event["name"].strip(),
                "date": start_time.date().isoformat(),
                "description": description,
                "location": channel_name,
            }
    return list(updated_events.values())


# Load last known events from JSON
def read_last_known_events(file_path):
    try:
        with open(file_path, "r") as file:
            return set(json.load(file)["lastKnownEvents"])
    except FileNotFoundError:
        logging.error(f"Last known events file not found: {file_path}")
        return set()


# Write last known events to JSON
def write_last_known_events(file_path, event_ids):
    try:
        with open(file_path, "w") as file:
            json.dump({"lastKnownEvents": list(event_ids)}, file, indent=4)
    except IOError as e:
        logging.error(f"Error writing last known events file: {e}")


# Write the JSON file locally
def write_local_json(file_path, data):
    try:
        with open(file_path, "w") as file:
            json.dump(data, file, indent=4)
    except IOError as e:
        logging.error(f"Error writing file: {e}")


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
    except GithubException as e:  # File not found
        if e.status == 404:
            repo.create_file(file_path, commit_message, content, branch="main")
        else:
            raise


def main():
    # Load existing events
    events_data = read_json(FILE_PATH)
    last_known_events = read_last_known_events("public/data/last_known_events.json")

    # Move past events based on date
    events_data = move_events(events_data)

    # Fetch new events from Discord
    fetched_events = fetch_discord_events(DISCORD_GUILD_ID, DISCORD_BOT_TOKEN)

    # Update upcoming events
    events_data["upcomingEvents"] = update_upcoming_events(
        events_data["upcomingEvents"], fetched_events
    )

    # Identify missing events (completed or cancelled)
    fetched_event_ids = {event["id"] for event in fetched_events}
    missing_events = last_known_events - fetched_event_ids

    # Remove or move missing events
    for event_id in missing_events:
        event = next(
            (e for e in events_data["upcomingEvents"] if e["id"] == event_id), None
        )
        if event:
            event_date = datetime.strptime(event["date"], "%Y-%m-%d").date()
            if event_date < datetime.now().date():
                events_data["pastEvents"].append(event)
            events_data["upcomingEvents"].remove(event)

    # # Write the JSON file locally
    # write_local_json(FILE_PATH, events_data)
    # logging.info("Events updated successfully.")

    # Write the JSON file on GitHub
    update_github_json_file(REPO_NAME, FILE_PATH, events_data, MY_GITHUB_PAT)
    logging.info("Events pushed to GitHub successfully.")

    # Update last known events
    write_last_known_events("public/data/last_known_events.json", fetched_event_ids)


if __name__ == "__main__":
    main()
