# Notify YouTube comment to Discord

A Google Apps Script project to notify YouTube comment to Discord.

## How to run

1.  `clasp create --rootDir ./src --type standalone --title "notify-youtube-comment-to-discord"`
2.  `clasp push --force`
3.  Open `properties.gs`, see `setProperties()`, fill values in code directly and run it.
4.  Open `toTrigger.gs` and run the function.

## Note

This script uses YouTube API, so it spends API quotas.
