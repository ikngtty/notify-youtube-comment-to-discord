function notifyToDiscord(youtubeComments) {
  youtubeComments.sort((a, b) => a.updatedAt - b.updatedAt);

  const url = ps.getProperty('DISCORD_WEBHOOK_URL');
  youtubeComments.forEach(comment => {
    console.log('youtube comment to notify:', comment);

    const payload = {
      username: 'つべコメ更新通知bot',
      // avatar_url: '', // TODO:
      embeds: [
        {
          // TODO: show whether it is reply or not
          title: comment.video.title,
          description: comment.textOriginal,
          url: comment.video.url,
          timestamp: comment.updatedAt.toISOString(),
          author: {
            name: comment.authorDisplayName,
            icon_url: comment.authorProfileImageUrl,
          },
        },
      ],
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
