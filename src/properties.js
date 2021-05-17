// need to fill values in code directly and run once to initialize this project
function setProperties() {
  ps.setProperties({
    YOUTUBE_PLAYLIST_ID: '*****',
    LAST_CHECKED_AT: '2020-01-01T00:00:00Z', // ISO8601
  });
}

// for debug
function getProperties() {
  const properties = ps.getProperties();
  console.log(properties);
}
