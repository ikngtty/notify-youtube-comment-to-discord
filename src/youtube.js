// NOTE: generator functions are more suitable but it cannot be used in GAS
function eachYouTubeComment(callback) {
  // TODO: fetch all pages
  const playlistItemsResult = YouTube.PlaylistItems.list('snippet,contentDetails', {
    // fields: 'items(contentDetails(videoId),snippet(title))',
    maxResults: 50,
    playlistId: ps.getProperty('YOUTUBE_PLAYLIST_ID'),
  });
  console.log('playlistItemsResult:', playlistItemsResult);

  // TODO: fetch for only last N videos
  // We should compute N not to be over YouTube API Quota limit.
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
      callback(topLevelComment);

      if (!commentThread.replies) {
        return;
      }
      commentThread.replies.comments.forEach(reply_ => {
        console.log('reply_:', reply_);
        const reply = new YouTubeComment(video, reply_, topLevelComment);
        callback(reply);
      });
    });
  });
}

class YouTubeVideo {
  static fromPlaylistItem(playlistItem) {
    const video = new YouTubeVideo();
    video.id = playlistItem.contentDetails.videoId;
    video.title = playlistItem.snippet.title;
    return video;
  }

  get url() {
    return `https://www.youtube.com/watch?v=${this.id}`;
  }
}

class YouTubeComment {
  constructor(youTubeVideo, comment, parentYouTubeComment) {
    this.video = youTubeVideo;
    this.textOriginal = comment.snippet.textOriginal;
    this.publishedAt = new Date(comment.snippet.publishedAt);
    this.updatedAt = new Date(comment.snippet.updatedAt);
    this.authorDisplayName = comment.snippet.authorDisplayName;
    this.authorProfileImageUrl = comment.snippet.authorProfileImageUrl;
    this.parentComment = parentYouTubeComment;
  }

  get isReply() {
    return !!this.parentComment
  }
}
