try {
  Modules;
} catch {
  Modules = {};
}
Modules.YouTube = {
  // NOTE: The quota is basically 10,000 units per day.
  // If this script runs every 5 minutes, it should not consume the quota over
  // ((10,000 / 24) / 60) * 5 = 34.7... units every run.
  quotaConsumption: 0,

  getCommentsOfThePlaylist: function* () {
    // TODO: fetch for only last N videos
    // We should compute N not to be over YouTube API Quota limit.
    for (const playlistItem of this.getItemsOfThePlaylist()) {
      const video = this.Video.fromPlaylistItem(playlistItem);
      yield* this.getCommentsOfVideo(video);
    }
  },

  getItemsOfThePlaylist: function* () {
    let nextPageToken = '';
    do {
      this.quotaConsumption += 1;
      console.log('estimate of quota consumption:', this.quotaConsumption);
      const playlistItemsResult = YouTube.PlaylistItems.list('snippet,contentDetails', {
        // fields: 'items(contentDetails(videoId),snippet(title))',
        maxResults: 50, // NOTE: Acceptable values are 0 to 50, inclusive. The default value is 5.
        pageToken: nextPageToken,
        playlistId: ps.getProperty('YOUTUBE_PLAYLIST_ID'),
      });
      console.log('playlistItemsResult:', playlistItemsResult);

      for (const playlistItem of playlistItemsResult.items) {
        console.log('playlistItem:', playlistItem);
        yield playlistItem;
      }

      nextPageToken = playlistItemsResult.nextPageToken;
    } while (nextPageToken);
  },

  getCommentsOfVideo: function* (video) {
    let nextPageToken = '';
    do {
      this.quotaConsumption += 1;
      console.log('estimate of quota consumption:', this.quotaConsumption);
      const commentThreadsResult = YouTube.CommentThreads.list('snippet,replies', {
        maxResults: 100, // NOTE: Acceptable values are 1 to 100, inclusive. The default value is 20.
        pageToken: nextPageToken,
        videoId: video.id,
      });
      console.log('commentThreadsResult:', commentThreadsResult);

      for (const commentThread of commentThreadsResult.items) {
        const topLevelComment_ = commentThread.snippet.topLevelComment;
        console.log('topLevelComment_:', topLevelComment_);
        const topLevelComment = new this.Comment(video, topLevelComment_, null);
        yield topLevelComment;

        if (!commentThread.replies) {
          continue;
        }
        for (const reply_ of commentThread.replies.comments) {
          console.log('reply_:', reply_);
          const reply = new this.Comment(video, reply_, topLevelComment);
          yield reply;
        }
      }

      nextPageToken = commentThreadsResult.nextPageToken;
    } while (nextPageToken);
  },

  Video: class {
    static fromPlaylistItem(playlistItem) {
      const video = new Modules.YouTube.Video();
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
