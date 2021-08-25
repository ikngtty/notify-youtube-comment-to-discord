// Need to fill values in code directly.
function setProperty() {
  ps.setProperty('---KEY---', '---VALUE---');
}

function getProperties() {
  const properties = ps.getProperties();
  console.log(properties);
}

// Need to fill the value in code directly.
function deleteProperty() {
  ps.deleteProperty('---KEY---');
}

function initLastNotifiedCommentTimestamp() {
  ps.setProperty('LAST_NOTIFIED_COMMENT_TIMESTAMP', '2000-01-01T00:00:00Z'); // before youtube is founded
}

function main() {
  const lastNotifiedCommentTimestamp = new Date(ps.getProperty('LAST_NOTIFIED_COMMENT_TIMESTAMP'));
  const now = new Date();

  const comments = [];
  for (const comment of youtube.getCommentsOfThePlaylist()) {
    if (lastNotifiedCommentTimestamp < comment.updatedAt && comment.updatedAt <= now) {
      comments.push(comment);
    }
  }

  discord.notify(comments);
}
