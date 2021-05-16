function main() {
  const lastCheckedAt = new Date(ps.getProperty('LAST_CHECKED_AT'));
  const checkedAt = new Date();
  const comments = fetchYouTubeComments(lastCheckedAt, checkedAt);
  comments.forEach(comment => {
    console.info('fetched comment', comment);
  });
  ps.setProperty('LAST_CHECKED_AT', checkedAt.toISOString());
}
