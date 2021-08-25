# Notify YouTube comment to Discord

A Google Apps Script project to notify YouTube comment to Discord.

## How to run

1.  `clasp create --rootDir ./src --type standalone --title "notify-youtube-comment-to-discord"`
2.  `clasp push --force`
3.  Open `run.gs` and set properties via running `setProperty()`.
4.  Run `main()` or set a trigger to run `main()` every 5 minutes.

## Properties

- YOUTUBE_PLAYLIST_ID
- DISCORD_WEBHOOK_URL
- LAST_NOTIFIED_COMMENT_TIMESTAMP
    - ISO8601 format

## Note

This script uses YouTube API, so it spends API quotas.
