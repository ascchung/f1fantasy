const BASE_URL = "https://api.jolpi.ca/ergast/f1";

let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 250; // 4 req/s rate limit

async function rateLimitedFetch(url) {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await new Promise((resolve) =>
      setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest)
    );
  }
  lastRequestTime = Date.now();
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function fetchSeasonResults(year) {
  const json = await rateLimitedFetch(
    `${BASE_URL}/${year}/results/?limit=500`
  );
  const races = json.MRData?.RaceTable?.Races || [];
  return races;
}

export async function fetchRaceResult(year, round) {
  const json = await rateLimitedFetch(
    `${BASE_URL}/${year}/${round}/results/`
  );
  const races = json.MRData?.RaceTable?.Races || [];
  return races[0] || null;
}

export async function fetchSeasonQualifying(year) {
  const json = await rateLimitedFetch(
    `${BASE_URL}/${year}/qualifying/?limit=500`
  );
  const races = json.MRData?.RaceTable?.Races || [];
  return races;
}

export async function fetchSeasonSprints(year) {
  const json = await rateLimitedFetch(
    `${BASE_URL}/${year}/sprint/?limit=500`
  );
  const races = json.MRData?.RaceTable?.Races || [];
  return races;
}

export async function fetchSeasonSchedule(year) {
  const json = await rateLimitedFetch(`${BASE_URL}/${year}/`);
  const races = json.MRData?.RaceTable?.Races || [];
  return races;
}
