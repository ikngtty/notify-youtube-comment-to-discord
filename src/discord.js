function notifyToDiscord(youtubeComments) {
  const url = ps.getProperty('DISCORD_WEBHOOK_URL');

  youtubeComments.sort((a, b) => a.updatedAt - b.updatedAt);
  youtubeComments.eachSlice(10, comments => {
    console.log('youtube comments to notify:', comments);

    const payload = {
      username: 'つべコメ更新通知bot',
      // avatar_url: '', // TODO:
      embeds: comments.map(_createEmbedForYouTubeComment),
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

    ps.setProperty('LAST_NOTIFIED_COMMENT_TIMESTAMP', comments.last().updatedAt.toISOString());
    // HACK: If there are videos which have the same timestamp, and notifying the first succeeds and notifying the second fails, the second video is not notified forever.
  });
}

function _createEmbedForYouTubeComment(youtubeComment) {
  fields = [];
  if (youtubeComment.isReply) {
    parent = youtubeComment.parentComment;
    fields.push({
      name: 'reply to:',
      value: `${parent.authorDisplayName} : ${parent.textOriginal}`,
    });
  }
  return {
    title: `A new comment to "${youtubeComment.video.title}"`,
    description: youtubeComment.textOriginal,
    url: youtubeComment.url,
    timestamp: youtubeComment.updatedAt.toISOString(),
    author: {
      name: youtubeComment.authorDisplayName,
      icon_url: youtubeComment.authorProfileImageUrl,
    },
    fields: fields,
  };
}
