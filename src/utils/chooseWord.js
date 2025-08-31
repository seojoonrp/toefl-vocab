export const chooseWord = (words, count) => {
  const totalCount = count;
  const latestWeek = Math.max(...words.map((word) => word.week));

  const latestWeekWords = words.filter((word) => word.week === latestWeek);
  const previousWeekWords = words.filter((word) => word.week !== latestWeek);

  const recentCount = Math.floor(totalCount * 0.35);
  const recentSample = [...latestWeekWords]
    .sort(() => 0.5 - Math.random())
    .slice(0, recentCount);

  const sortedByAccuracy = [...previousWeekWords].sort((a, b) => {
    const aTotal = a.total || 0;
    const bTotal = b.total || 0;
    const aAccuracy = aTotal > 0 ? a.correct / aTotal : 0;
    const bAccuracy = bTotal > 0 ? b.correct / bTotal : 0;
    return aAccuracy - bAccuracy;
  });

  const accuracyCount = Math.floor(totalCount * 0.2);
  const accuracySample = sortedByAccuracy.slice(0, accuracyCount);

  const remainingWords = previousWeekWords.filter(
    (word) => !accuracySample.includes(word)
  );
  const randomCount =
    totalCount - (recentSample.length + accuracySample.length);
  const randomSample = [...remainingWords]
    .sort(() => 0.5 - Math.random())
    .slice(0, randomCount);

  const finalWords = [...recentSample, ...accuracySample, ...randomSample]
    .sort(() => 0.5 - Math.random())
    .map((word) => ({
      english: word.english,
      korean: word.korean,
      correct: 0,
      wrong: 0,
    }));

  return finalWords;
};
