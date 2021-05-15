// need to fill values in code directly and run once to initialize this project
function setProperties() {
  PropertiesService.getScriptProperties().setProperties({
    PLAYLIST_ID: '*****',
  });
}

// for debug
function getProperties() {
  const properties = PropertiesService.getScriptProperties().getProperties();
  console.log(properties);
}
