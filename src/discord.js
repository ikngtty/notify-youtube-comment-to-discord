function postToDiscord() {
  const url = ps.getProperty('DISCORD_WEBHOOK_URL');
  const payload = {
    username: 'つべコメ更新通知bot（実験中）',
    content: 'こんにちは',
  };
  const response = UrlFetchApp.fetch(url, {
    contentType: 'application/json',
    method: 'post',
    payload: JSON.stringify(payload),
    // muteHttpExceptions: true,
  });
  console.log('response code:', response.getResponseCode());
  // console.log('response header:', response.getAllHeaders());
  console.log('response text:', response.getContentText());
}
