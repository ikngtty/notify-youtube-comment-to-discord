// need to fill values in code directly and run once to initialize this project
function setProperties() {
  ps.setProperties({
    PLAYLIST_ID: '*****',
  });
}

// for debug
function getProperties() {
  const properties = ps.getProperties();
  console.log(properties);
}
