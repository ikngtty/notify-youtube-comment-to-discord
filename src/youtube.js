function fetchYouTubeComments(from, to) {
  const isTargetComment = comment => from < comment.updatedAt && comment.updatedAt <= to;

  // TODO: fetch all pages
  const playlistItemsResult = YouTube.PlaylistItems.list('snippet,contentDetails', {
    // fields: 'items(contentDetails(videoId),snippet(title))',
    maxResults: 50,
    playlistId: ps.getProperty('YOUTUBE_PLAYLIST_ID'),
  });
  console.log('playlistItemsResult:', playlistItemsResult);

  const targets = [];
  playlistItemsResult.items.forEach(playlistItem => {
    console.log('playlistItem:', playlistItem);
    const video = YouTubeVideo.fromPlaylistItem(playlistItem);

    // TODO: fetch all pages
    const commentThreadsResult = YouTube.CommentThreads.list('snippet,replies', {
      maxResults: 100,
      videoId: video.id,
    });
    console.log('commentThreadsResult:', commentThreadsResult);
    commentThreadsResult.items.forEach(commentThread => {
      const topLevelComment_ = commentThread.snippet.topLevelComment;
      console.log('topLevelComment_:', topLevelComment_);
      const topLevelComment = new YouTubeComment(video, topLevelComment_, null);

      if (isTargetComment(topLevelComment)) {
        targets.push(topLevelComment);
      }

      if (!commentThread.replies) {
        return;
      }
      commentThread.replies.comments.forEach(reply_ => {
        console.log('reply_:', reply_);
        const reply = new YouTubeComment(video, reply_, topLevelComment);

        if (isTargetComment(reply)) {
          targets.push(reply);
        }
      });
    });
  });
  return targets;
}

class YouTubeVideo {
  static fromPlaylistItem(playlistItem) {
    const video = new YouTubeVideo();
    video.id = playlistItem.contentDetails.videoId;
    video.title = playlistItem.snippet.title;
    return video;
  }

  get url() {
    return `https://www.youtube.com/watch?v=${this.videoId}`;
  }
}

class YouTubeComment {
  constructor(youTubeVideo, comment, parentYouTubeComment) {
    this.video = youTubeVideo;
    this.textOriginal = comment.snippet.textOriginal;
    this.publishedAt = Date.parse(comment.snippet.publishedAt);
    this.updatedAt = Date.parse(comment.snippet.updatedAt);
    this.authorDisplayName = comment.snippet.authorDisplayName;
    this.authorProfileImageUrl = comment.snippet.authorProfileImageUrl;
    this.parentComment = parentYouTubeComment;
  }

  get isReply() {
    return !!this.parentComment
  }
}
