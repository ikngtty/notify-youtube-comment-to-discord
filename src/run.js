// Need to fill values in code directly.
// Need to run to initialize this project.
function setProperties() {
  ps.setProperties({
    YOUTUBE_PLAYLIST_ID: '*****',
    DISCORD_WEBHOOK_URL: 'https://discord.com/api/webhooks/*****/*****',
    LAST_CHECKED_AT: '2020-01-01T00:00:00Z', // ISO8601
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
  const lastCheckedAt = new Date(ps.getProperty('LAST_CHECKED_AT'));
  const checkedAt = new Date();
  const comments = fetchYouTubeComments(lastCheckedAt, checkedAt);
  comments.forEach(comment => {
    console.log('fetched comment:', comment);
  });
  notifyToDiscord(comments);
  ps.setProperty('LAST_CHECKED_AT', checkedAt.toISOString());
}
