const youtube = {
  getCommentsOfThePlaylist: function* () {
    // TODO: fetch all pages
    const playlistItemsResult = YouTube.PlaylistItems.list('snippet,contentDetails', {
      // fields: 'items(contentDetails(videoId),snippet(title))',
      maxResults: 50,
      playlistId: ps.getProperty('YOUTUBE_PLAYLIST_ID'),
    });
    console.log('playlistItemsResult:', playlistItemsResult);

    // TODO: fetch for only last N videos
    // We should compute N not to be over YouTube API Quota limit.
    for (const playlistItem of playlistItemsResult.items) {
      console.log('playlistItem:', playlistItem);
      const video = youtube.Video.fromPlaylistItem(playlistItem);

      // TODO: fetch all pages
      const commentThreadsResult = YouTube.CommentThreads.list('snippet,replies', {
        maxResults: 100,
        videoId: video.id,
      });
      console.log('commentThreadsResult:', commentThreadsResult);
      for (const commentThread of commentThreadsResult.items) {
        const topLevelComment_ = commentThread.snippet.topLevelComment;
        console.log('topLevelComment_:', topLevelComment_);
        const topLevelComment = new youtube.Comment(video, topLevelComment_, null);
        yield topLevelComment;

        if (!commentThread.replies) {
          continue;
        }
        for (const reply_ of commentThread.replies.comments) {
          console.log('reply_:', reply_);
          const reply = new youtube.Comment(video, reply_, topLevelComment);
          yield reply;
        }
      }
    }
  },

  Video: class {
    static fromPlaylistItem(playlistItem) {
      const video = new youtube.Video();
      video.id = playlistItem.contentDetails.videoId;
      video.title = playlistItem.snippet.title;
      return video;
    }

    get url() {
      return `https://www.youtube.com/watch?v=${this.id}`;
    }
  },

  Comment: class {
    constructor(video, comment, parentComment) {
      this.video = video;
      this.id = comment.id
      this.textOriginal = comment.snippet.textOriginal;
      this.publishedAt = new Date(comment.snippet.publishedAt);
      this.updatedAt = new Date(comment.snippet.updatedAt);
      this.authorDisplayName = comment.snippet.authorDisplayName;
      this.authorProfileImageUrl = comment.snippet.authorProfileImageUrl;
      this.parentComment = parentComment;
    }

    get url() {
      return `https://www.youtube.com/watch?v=${this.video.id}&lc=${this.id}`;
    }

    get isReply() {
      return !!this.parentComment
    }
  }
};
