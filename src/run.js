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

  const allComments = new Modules.Iterable(Modules.YouTube.getCommentsOfThePlaylist());
  const commentsToNotify = allComments.filter(
    comment =>
      lastNotifiedCommentTimestamp < comment.updatedAt
      && comment.updatedAt <= now
  ).toArray();

  console.info('final estimate of quota consumption:', Modules.YouTube.quotaConsumption);

  Modules.Discord.notify(commentsToNotify);
}

function _benchmarkSizedQueue(SizedQueue) {
  const objects = [];
  for (let i = 0; i < 100000; i++) {
    const obj = { index: i };
    for (let iProp = 0; iProp < 100; iProp++) {
      obj[`prop${iProp}`] = iProp;
    }
    objects.push(obj);
  }

  const resultTimes = [];
  for (let i = 0; i < 10; i++) {
    const startTime = new Date();
    const sized = new SizedQueue(20);
    for (const obj of objects) {
      sized.push(obj);
    }
    sized.toArray();
    const endTime = new Date();
    resultTimes.push(endTime - startTime);
  }

  let resultTotal = 0;
  for (const time of resultTimes) {
    resultTotal += time;
  }
  const resultAverage = resultTotal / resultTimes.length;
  console.info('resultTimes:', resultTimes);
  console.info('resultAverage:', resultAverage);
}

function benchmarkSizedArray() {
  _benchmarkSizedQueue(Modules.SizedArray);
  // Outputs:
  //   resultTimes: [ 14, 22, 19, 5, 4, 4, 4, 4, 5, 6 ]
  //   resultAverage: 8.7
}

function benchmarkSizedList() {
  _benchmarkSizedQueue(Modules.SizedList);
  // Outputs:
  //   resultTimes: [ 30, 23, 22, 2, 1, 3, 2, 2, 1, 2 ]
  //   resultAverage: 8.8
}
