import os
import requests
import re
from datetime import datetime, timezone
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


# Process and return events in a structured format
def process_discord_events(events, bot_token):
    structured_events = []
    for event in events:
        if event["status"] == 1:  # 1 is for SCHEDULED events
            start_time = datetime.fromisoformat(event["scheduled_start_time"])
            if start_time.tzinfo is None:
                start_time = start_time.replace(tzinfo=timezone.utc)
            channel_id = event.get("channel_id")
            channel_name = (
                fetch_discord_channel_name(channel_id, bot_token)
                if channel_id
                else "No location"
            )
            event_name = event["name"].strip()
            structured_events.append(
                {
                    "id": event["id"],  # Include the event ID
                    "name": event_name,
                    "date": start_time.date(),
                    "description": event["description"].strip(),
                    "location": channel_name,
                    "section": "upcoming"
                    if start_time.date() >= datetime.now().date()
                    else "past",
                }
            )
    return structured_events


# Function to parse markdown content and extract events
def parse_markdown(content):
    print("Content received for parsing:", content)

    # Splitting the content to extract frontmatter and events content
    frontmatter, events_content = content.split("---\n", 2)[1:3]
    print("Frontmatter:", frontmatter)
    print("Events content:", events_content)

    # Updating the publish date in frontmatter
    current_datetime = datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")
    frontmatter = re.sub(
        r"publishDate:.*", f"publishDate: {current_datetime}", frontmatter
    )

    # Defining regex patterns for upcoming and past events
    upcoming_pattern = r"#\s*Upcoming Events\s*\n\s*(.*?)(\n\s*#|$)"
    past_pattern = r"#\s*Past Events\s*\n\s*(.*?)(\n\s*#|$)"

    # Searching for upcoming and past events in the content
    upcoming_content = re.search(upcoming_pattern, events_content, re.DOTALL)
    past_content = re.search(past_pattern, events_content, re.DOTALL)

    # Check if sections are found
    if not upcoming_content or not past_content:
        print("Failed to find upcoming or past events sections.")
        return frontmatter, [], []

    upcoming_content = upcoming_content.group(1)
    past_content = past_content.group(1)

    print("Upcoming content:", upcoming_content)
    print("Past content:", past_content)

    # Regex pattern for individual events
    event_pattern = r".*?<br>\nID: (.*?)<br>\nDate: (.*?)<br>\nDescription:(.*?)<br>\nLocation: (.*?)\n"
    upcoming_events = re.findall(event_pattern, upcoming_content, re.DOTALL)
    past_events = re.findall(event_pattern, past_content, re.DOTALL)

    print("Upcoming events found:", upcoming_events)
    print("Past events found:", past_events)

    def process_events(matches, section):
        events = []
        for match in matches:
            name, event_id, date_str, description, location = match
            date = datetime.strptime(date_str, "%b %d, %Y").date()
            if section == "upcoming" and date < datetime.now().date():
                section = "past"  # Move to past events if date has passed
            events.append(
                {
                    "name": name.strip(),
                    "id": event_id,
                    "date": date,
                    "description": description.strip(),
                    "location": location,
                    "section": section,
                }
            )
        return events

    upcoming_events = process_events(upcoming_events, "upcoming")
    past_events = process_events(past_events, "past")
    return frontmatter, upcoming_events, past_events


# Function to merge and generate markdown
def merge_and_generate_markdown(
    frontmatter, existing_upcoming_events, existing_past_events
):
    # Generate Markdown content for upcoming and past events
    upcoming_events_md = "\n\n".join(
        f"{event['name']}<br>\nID: {event['id']}<br>\nDate: {event['date'].strftime('%b %d, %Y')}<br>\nDescription:\n{event['description']}<br>\nLocation: {event['location']}"
        for event in existing_upcoming_events
        if event["section"] == "upcoming"
    )
    past_events_md = "\n\n".join(
        f"{event['name']}<br>\nID: {event['id']}<br>\nDate: {event['date'].strftime('%b %d, %Y')}<br>\nDescription:\n{event['description']}<br>\nLocation: {event['location']}"
        for event in existing_past_events + existing_upcoming_events
        if event["section"] == "past"
    )

    updated_content = f"---\n{frontmatter}---\n\n# Upcoming Events\n\n{upcoming_events_md}\n\n# Past Events\n\n{past_events_md}\n"
    return updated_content


def main():
    new_events = fetch_discord_events(GUILD_ID, BOT_TOKEN)
    try:
        content, sha = get_github_file(REPO, FILE_PATH, PAT)
        frontmatter, existing_upcoming_events, existing_past_events = parse_markdown(
            content
        )

        # Create a copy of the list for safe iteration
        for event in existing_upcoming_events[:]:
            if event["date"] < datetime.now().date():
                existing_past_events.append(event)
                existing_upcoming_events.remove(event)

        # Add new events to upcoming or past based on their dates
        for new_event in new_events:
            if new_event["date"] >= datetime.now().date():
                existing_upcoming_events.append(new_event)
            else:
                existing_past_events.append(new_event)

        updated_content = merge_and_generate_markdown(
            frontmatter, existing_upcoming_events, existing_past_events
        )
        update_github_file(REPO, FILE_PATH, updated_content, sha, PAT)
        print("The events.md file has been updated successfully on GitHub.")
    except Exception as e:
        print(f"An error occurred: {e}")


if __name__ == "__main__":
    main()
