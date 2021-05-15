function main() {
  const lastCheckedAt = new Date(ps.getProperty('LAST_CHECKED_AT'));
  const checkedAt = new Date();
  const comments = fetchComments(lastCheckedAt, checkedAt);
  console.info('fetched comments', comments);
  ps.setProperty('LAST_CHECKED_AT', checkedAt.toISOString());
}

function fetchComments(from, to) {
  const isTargetComment = comment => {
    const updatedAt = Date.parse(comment.snippet.updatedAt);
    return from < updatedAt && updatedAt <= to;
  };

  // TODO: fetch all pages
  const playlistItemsResult = YouTube.PlaylistItems.list('snippet,contentDetails', {
    // fields: 'items(contentDetails(videoId),snippet(title))',
    maxResults: 50,
    playlistId: ps.getProperty('PLAYLIST_ID'),
  });
  console.log('playlistItemsResult', playlistItemsResult);

  const fetched = [];
  playlistItemsResult.items.forEach(playlistItem => {
    console.log('playlistItem', playlistItem);
    // TODO: fetch all pages
    const commentThreadsResult = YouTube.CommentThreads.list('snippet,replies', {
      maxResults: 100,
      videoId: playlistItem.contentDetails.videoId,
    });
    console.log('commentThreadsResult', commentThreadsResult);
    commentThreadsResult.items.forEach(commentThread => {
      const topLevelComment = commentThread.snippet.topLevelComment;
      console.log('topLevelComment', topLevelComment);
      if (isTargetComment(topLevelComment)) {
        fetched.push(topLevelComment);
      }

      if (!commentThread.replies) {
        return;
      }
      commentThread.replies.comments.forEach(reply => {
        console.log('reply', reply);
        if (isTargetComment(reply)) {
          fetched.push(reply);
        }
      });
    });
  });
  return fetched;
}
