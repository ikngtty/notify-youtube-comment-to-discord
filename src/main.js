function main() {
  const lastCheckedAt = new Date(ps.getProperty('LAST_CHECKED_AT'));
  const checkedAt = new Date();
  const comments = fetchYouTubeComments(lastCheckedAt, checkedAt);
  comments.forEach(comment => {
    console.info('fetched comment', comment);
  });
  ps.setProperty('LAST_CHECKED_AT', checkedAt.toISOString());
}

function fetchYouTubeComments(from, to) {
  const isTargetComment = comment => from < comment.updatedAt && comment.updatedAt <= to;

  // TODO: fetch all pages
  const playlistItemsResult = YouTube.PlaylistItems.list('snippet,contentDetails', {
    // fields: 'items(contentDetails(videoId),snippet(title))',
    maxResults: 50,
    playlistId: ps.getProperty('PLAYLIST_ID'),
  });
  console.log('playlistItemsResult', playlistItemsResult);

  const targets = [];
  playlistItemsResult.items.forEach(playlistItem => {
    console.log('playlistItem', playlistItem);
    // TODO: fetch all pages
    const commentThreadsResult = YouTube.CommentThreads.list('snippet,replies', {
      maxResults: 100,
      videoId: playlistItem.contentDetails.videoId,
    });
    console.log('commentThreadsResult', commentThreadsResult);
    commentThreadsResult.items.forEach(commentThread => {
      const topLevelComment_ = commentThread.snippet.topLevelComment;
      console.log('topLevelComment_', topLevelComment_);
      const topLevelComment = new YouTubeComment(topLevelComment_, null);

      if (isTargetComment(topLevelComment)) {
        targets.push(topLevelComment);
      }

      if (!commentThread.replies) {
        return;
      }
      commentThread.replies.comments.forEach(reply_ => {
        console.log('reply_', reply_);
        const reply = new YouTubeComment(reply_, topLevelComment);

        if (isTargetComment(reply)) {
          targets.push(reply);
        }
      });
    });
  });
  return targets;
}

class YouTubeComment {
  constructor(comment, parentYouTubeComment) {
    this.textOriginal = comment.snippet.textOriginal;
    this.publishedAt = Date.parse(comment.snippet.publishedAt);
    this.updatedAt = Date.parse(comment.snippet.updatedAt);
    this.authorDisplayName = comment.snippet.authorDisplayName;
    this.authorProfileImageUrl = comment.snippet.authorProfileImageUrl;
    this.videoId = comment.snippet.videoId;
    this.parentComment = parentYouTubeComment;
  }

  get isReply() {
    return !!this.parentComment
  }

  get videoUrl() {
    return `https://www.youtube.com/watch?v=${this.videoId}`;
  }
}