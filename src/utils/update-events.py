import os
import discord
from github import Github, GithubException
from datetime import datetime
import re

# Load environment variables from .env file
from dotenv import load_dotenv
load_dotenv()

# Load tokens and repo details from environment variables
TOKEN = os.getenv('DISCORD_BOT_TOKEN')
GITHUB_TOKEN = os.getenv('GH_PAT')
REPO_NAME = "saucy-tech/plebnet-website"
FILE_PATH = 'src/content/post/events.md'

intents = discord.Intents.default()
intents.message_content = True
intents.members = True
intents.presences = True

client = discord.Client(intents=intents)

def update_markdown(events):
    try:
        # Authenticate with GitHub
        g = Github(GITHUB_TOKEN)
        # Get the repository
        repo = g.get_repo(REPO_NAME)
        # Get the file contents
        contents = repo.get_contents(FILE_PATH, ref="main")
        content = contents.decoded_content.decode('utf-8')

        # Define a pattern to match event sections
        pattern = r'(#{1,2} [^\n]*)\n(?:[^#]*\n)*'
        matches = re.findall(pattern, content, re.DOTALL)

        # Parse events
        existing_events = []
        current_section = None
        for match in matches:
            lines = match.strip().split('\n')
            section = lines[0]
            if section.startswith('# Upcoming Events'):
                current_section = 'upcoming'
            elif section.startswith('# Past Events'):
                current_section = 'past'
            elif section.startswith('##'):
                name = lines[0][3:].strip()
                date_match = re.search(r'Date: (.+)', '\n'.join(lines))
                description_match = re.search(r'Description: (.+)', '\n'.join(lines))
                channel_match = re.search(r'Channel: (.+)', '\n'.join(lines))

                if date_match and description_match and channel_match:
                    date = datetime.strptime(date_match.group(1), '%Y-%m-%d').date()
                    description = description_match.group(1)
                    channel = channel_match.group(1)
                    existing_events.append({'name': name, 'date': date, 'description': description, 'channel': channel, 'section': current_section})
                else:
                    print(f"Error parsing event details for section: {section}")

        # Merge new events with existing events
        for new_event in events:
            # Determine if the event is upcoming or past based on the current date
            new_event['section'] = 'upcoming' if new_event['date'] >= datetime.now().date() else 'past'
            if new_event not in existing_events:
                existing_events.append(new_event)

        # Sort events by date
        existing_events.sort(key=lambda x: x['date'])

        # Generate updated content with frontmatter
        updated_content = '---\ntitle: "Events"\nimage: "/src/content/post/_images/events.jpg"\n---\n\n# Upcoming Events\n\n'
        updated_content += ''.join(f"## {event['name']}\n\nDate: {event['date'].strftime('%Y-%m-%d')}\nDescription: {event['description']}\nChannel: {event['channel']}\n\n" for event in existing_events if event['section'] == 'upcoming')
        updated_content += '# Past Events\n\n'
        updated_content += ''.join(f"## {event['name']}\n\nDate: {event['date'].strftime('%Y-%m-%d')}\nDescription: {event['description']}\nChannel: {event['channel']}\n\n" for event in existing_events if event['section'] == 'past')

        # Update the file on GitHub
        repo.update_file(contents.path, "Updated events list", updated_content, contents.sha, branch="main")
        print("The events.md file has been updated successfully.")
    except GithubException as e:
        print(f"An error occurred while updating the events.md file: {e}")

@client.event
async def on_ready():
    print(f'Logged in as {client.user}')

@client.event
async def on_message(message):
    # Check if the message is the command to update events and if the author is authorized
    if message.content.startswith('!get_events') and message.channel.permissions_for(message.author).administrator:
        # Fetch events from Discord here
        # This is placeholder data; you should replace it with actual event fetching logic
        events = [
            {"name": "Event 3", "date": datetime(2023, 10, 30).date(), "description": "Description for Event 3", "channel": "general"},
            {"name": "Event 4", "date": datetime(2023, 11, 5).date(), "description": "Description for Event 4", "channel": "events"}
        ]

        update_markdown(events)

        # Send a confirmation message
        response = "Events have been updated."
        await message.channel.send(response)

client.run(TOKEN)
