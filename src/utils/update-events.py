import os
import requests
import re
from datetime import datetime, timezone, timedelta
from github import Github

# Load environment variables from .env file
from dotenv import load_dotenv

load_dotenv()

# Configuration
BOT_TOKEN = os.getenv("DISCORD_BOT_TOKEN")
GUILD_ID = os.getenv("DISCORD_GUILD_ID")
PAT = os.getenv("GH_PAT")  # Personal Access Token for GitHub
REPO = os.getenv("REPO_NAME")
FILE_PATH = "src/content/post/events.md"


# Function to authenticate with GitHub
def authenticate_with_github(GH_PAT):
    return Github(GH_PAT)


# Function to get file from GitHub
def get_github_file(repo_name, file_path, GH_PAT):
    g = authenticate_with_github(GH_PAT)
    repo = g.get_repo(repo_name)
    contents = repo.get_contents(file_path, ref="main")
    return contents.decoded_content.decode("utf-8"), contents.sha


# Function to update file on GitHub
def update_github_file(
    repo_name, file_path, content, sha, GH_PAT, commit_message="Update events"
):
    g = authenticate_with_github(GH_PAT)
    repo = g.get_repo(repo_name)
    repo.update_file(file_path, commit_message, content, sha, branch="main")


# Function to fetch channel name for events from Discord
def fetch_discord_channel_name(channel_id, bot_token):
    try:
        url = f"https://discord.com/api/v9/channels/{channel_id}"
        headers = {"Authorization": f"Bot {bot_token}"}
        response = requests.get(url, headers=headers)
        response.raise_for_status()  # This will raise an exception for HTTP error responses
        channel = response.json()
        return channel.get(
            "name", "Unknown Channel"
        )  # Return the name of the channel or 'Unknown Channel' if not found
    except Exception as e:
        print(f"Error fetching channel name: {e}")
        return "Unknown Channel"  # Return a default value in case of any error


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


# Process and return events in a structured format
def process_discord_events(events, bot_token):
    structured_events = []
    for event in events:
        if event["status"] == 1:  # 1 is for SCHEDULED events
            start_time = datetime.fromisoformat(event["scheduled_start_time"])
            # Ensure start_time is aware by assigning UTC timezone if it's not set
            if start_time.tzinfo is None:
                start_time = start_time.replace(tzinfo=timezone.utc)
            channel_id = event.get("channel_id")
            channel_name = (
                fetch_discord_channel_name(channel_id, bot_token)
                if channel_id
                else "No location"
            )
            # Ensure that event names are not prefixed with multiple '##'
            event_name = event["name"].strip()
            if not event_name.startswith("##"):
                event_name = f"## {event_name}"
            structured_events.append(
                {
                    "name": f"## {event['name']}",
                    "date": start_time.date(),
                    "description": event["description"].strip(),
                    "location": channel_name,
                    # Determine if event is upcoming or past based on current date
                    "section": "upcoming"
                    if start_time.date() >= datetime.now().date()
                    else "past",
                }
            )
    return structured_events


# Function to parse markdown content and extract events
def parse_markdown(content):
    frontmatter, event_content = content.split("---\n", 2)[1:3]
    current_datetime = datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")
    frontmatter = re.sub(
        r"publishDate:.*", f"publishDate: {current_datetime}", frontmatter
    )
    pattern = r"(## [^\n]+)\n\nDate: ([^\n]+)\n\nDescription:\n([^\n]+(?:\n\n[^\n]+)*)\n\nLocation: ([^\n]+)"
    matches = re.findall(pattern, event_content, re.DOTALL)
    existing_events = []
    today = datetime.now().date()
    for match in matches:
        name, date_str, description, location = match
        date = datetime.strptime(date_str, "%b %d, %Y").date()
        existing_events.append(
            {
                "name": name.strip("# "),
                "date": date,
                "description": description.strip(),
                "location": location,
                # Categorize event based on date comparison
                "section": "upcoming" if date >= datetime.now().date() else "past",
            }
        )
    return frontmatter, existing_events


def merge_and_generate_markdown(frontmatter, new_events):
    # Generate updated markdown content only for upcoming events
    upcoming_events_md = "\n\n".join(
        f"{event['name']}\n\nDate: {event['date'].strftime('%b %d, %Y')}\n\nDescription:\n{event['description']}\n\nLocation: {event['location']}"
        for event in new_events
        if event["section"] == "upcoming"
    )

    # Combine the updated frontmatter with the updated upcoming events content
    updated_content = (
        f"---\n{frontmatter}---\n\n# Upcoming Events\n\n{upcoming_events_md}\n"
    )
    return updated_content


def main():
    new_events = fetch_discord_events(GUILD_ID, BOT_TOKEN)
    try:
        content, sha = get_github_file(REPO, FILE_PATH, PAT)

        frontmatter, existing_events = parse_markdown(content)

        # Filter out past events only
        past_events = [event for event in existing_events if event["section"] == "past"]

        # Combine past events with new upcoming events for markdown generation
        all_events = past_events + [
            event for event in new_events if event["section"] == "upcoming"
        ]

        updated_content = merge_and_generate_markdown(frontmatter, all_events)

        update_github_file(REPO, FILE_PATH, updated_content, sha, PAT)
        print("The events.md file has been updated successfully on GitHub.")
    except Exception as e:
        print(f"An error occurred: {e}")


if __name__ == "__main__":
    main()
