// Need to fill values in code directly.
// Need to run to initialize this project.
function setProperties() {
  ps.setProperties({
    YOUTUBE_PLAYLIST_ID: '*****',
    DISCORD_WEBHOOK_URL: 'https://discord.com/api/webhooks/*****/*****',
    LAST_NOTIFIED_COMMENT_TIMESTAMP: '2020-01-01T00:00:00Z', // ISO8601
  });
}

function getProperties() {
  const properties = ps.getProperties();
  console.log(properties);
}

// Need to fill the value in code directly.
function deleteProperty() {
  ps.deleteProperty('*****');
}

function main() {
  const lastNotifiedCommentTimestamp = new Date(ps.getProperty('LAST_NOTIFIED_COMMENT_TIMESTAMP'));
  const now = new Date();
  const comments = fetchYouTubeComments(lastNotifiedCommentTimestamp, now);
  notifyToDiscord(comments);
}
