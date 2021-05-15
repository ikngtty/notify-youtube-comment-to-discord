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
      const topLevelComment = commentThread.snippet.topLevelComment;
      console.log('topLevelComment', topLevelComment);
      if (isTargetComment(topLevelComment)) {
        targets.push(YouTubeComment.fromTopLevelComment(topLevelComment));
      }

      if (!commentThread.replies) {
        return;
      }
      commentThread.replies.comments.forEach(reply => {
        console.log('reply', reply);
        if (isTargetComment(reply)) {
          targets.push(YouTubeComment.fromReply(reply, topLevelComment));
        }
      });
    });
  });
  return targets;
}

class YouTubeComment {
  static fromTopLevelComment(topLevelComment) {
    const comment = new YouTubeComment();
    comment.textOriginal = topLevelComment.snippet.textOriginal;
    comment.publishedAt = topLevelComment.snippet.publishedAt;
    comment.updatedAt = topLevelComment.snippet.updatedAt;
    comment.authorDisplayName = topLevelComment.snippet.authorDisplayName;
    comment.authorProfileImageUrl = topLevelComment.snippet.authorProfileImageUrl;
    comment.videoId = topLevelComment.snippet.videoId;
    comment.parentComment = null;
    return comment;
  }

  static fromReply(reply, topLevelComment) {
    const comment = new YouTubeComment();
    comment.textOriginal = reply.snippet.textOriginal;
    comment.publishedAt = reply.snippet.publishedAt;
    comment.updatedAt = reply.snippet.updatedAt;
    comment.authorDisplayName = reply.snippet.authorDisplayName;
    comment.authorProfileImageUrl = reply.snippet.authorProfileImageUrl;
    comment.videoId = reply.snippet.videoId;
    comment.parentComment = this.fromTopLevelComment(topLevelComment);
    return comment;
  }

  get isReply() {
    return !!this.parentComment
  }

  get videoUrl() {
    return `https://www.youtube.com/watch?v=${this.videoId}`;
  }
}