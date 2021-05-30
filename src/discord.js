function notifyToDiscord(youtubeComments) {
  const url = ps.getProperty('DISCORD_WEBHOOK_URL');

  youtubeComments.sort((a, b) => a.updatedAt - b.updatedAt);
  youtubeComments.forEach(comment => {
    console.log('youtube comment to notify:', comment);

    const embed = createEmbedForYouTubeComment(comment);
    const payload = {
      username: 'つべコメ更新通知bot',
      // avatar_url: '', // TODO:
      embeds: [embed], // TODO: 10 embeds
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

    ps.setProperty('LAST_NOTIFIED_COMMENT_TIMESTAMP', comment.updatedAt.toISOString());
    // HACK: If there are videos which have the same timestamp, and notifying the first succeeds and notifying the second fails, the second video is not notified forever.
  });
}

function createEmbedForYouTubeComment(youtubeComment) {
  return {
    // TODO: show whether it is reply or not
    title: youtubeComment.video.title,
    description: youtubeComment.textOriginal,
    url: youtubeComment.video.url,
    timestamp: youtubeComment.updatedAt.toISOString(),
    author: {
      name: youtubeComment.authorDisplayName,
      icon_url: youtubeComment.authorProfileImageUrl,
    },
  };
}
