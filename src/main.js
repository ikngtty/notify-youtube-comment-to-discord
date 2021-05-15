function main() {
  checkComments();
}

function checkComments() {
  // TODO: fetch all pages
  const playlistItemsResult = YouTube.PlaylistItems.list('snippet,contentDetails', {
    // fields: 'items(contentDetails(videoId),snippet(title))',
    maxResults: 50,
    playlistId: ps.getProperty('PLAYLIST_ID'),
  });
  console.log('playlistItemsResult', playlistItemsResult);
  playlistItemsResult.items.forEach(playlistItem => {
    console.log('playlistItem', playlistItem);
    // TODO: fetch all pages
    const commentThreadsResult = YouTube.CommentThreads.list('snippet,replies', {
      maxResults: 100,
      videoId: playlistItem.contentDetails.videoId,
    });
    console.log('commentThreadsResult', commentThreadsResult);
    commentThreadsResult.items.forEach(commentThread => {
      console.info('topLevelComment', commentThread.snippet.topLevelComment);
      if (!commentThread.replies) {
        return;
      }
      commentThread.replies.comments.forEach(reply => {
        console.info('reply', reply);
      });
    });
  });
}
