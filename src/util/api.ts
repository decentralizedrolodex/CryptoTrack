import { dataLoading, detailLoading, secondaryDetailLoading } from "../store/store";
import { API_KEY, SORT_DIRECTION_ASCENDING } from "./constants";

async function fetchData(apiEndpoint: string, requestBody: object) {
  try {
    const response = await fetch(apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorMessage = `Network response was not ok. Status: ${response.status}, Text: ${await response.text()}`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

export async function getData(
  currency?: string | null,
  sort: string = "rank",
  order: string = SORT_DIRECTION_ASCENDING,
  limit: number = 100,
  currentPage?: number | null,
  currentEntry?: number | null
) {
  dataLoading.set(true);
  try {
    const apiEndpoint = "https://api.livecoinwatch.com/coins/list";
    const requestBody = {
      currency,
      sort,
      order,
      limit,
      offset: currentPage && currentEntry && currentPage * currentEntry - currentEntry,
      meta: true,
    };
    return await fetchData(apiEndpoint, requestBody);
  } finally {
    dataLoading.set(false);
  }
}

export async function getHistoricalData(
  code: string | null,
  currency: string | null,
  start: number | null = 0, // Set a default value for start
  end: number | null = 0    // Set a default value for end
) {
  secondaryDetailLoading.set(true);
  try {
    const apiEndpoint = "https://api.livecoinwatch.com/coins/single/history";
    const requestBody = {
      currency,
      code,
      meta: true,
      start,
      end,
    };
    return await fetchData(apiEndpoint, requestBody);
  } finally {
    secondaryDetailLoading.set(false);
    // Additional actions, if needed
  }
}

export async function getOverviewData(currency: string | null) {
  try {
    const apiEndpoint = "https://api.livecoinwatch.com/overview";
    const requestBody = {
      currency,
      meta: true,
    };
    return await fetchData(apiEndpoint, requestBody);
  } finally {
    // Perform actions here, regardless of success or failure
    // For example, dataLoading.set(false);
  }
}

export async function getDataSingle(currency: string | null, code: string | null) {
  detailLoading.set(true);
  try {
    const apiEndpoint = "https://api.livecoinwatch.com/coins/single";
    const requestBody = {
      currency,
      code,
      meta: true,
    };
    return await fetchData(apiEndpoint, requestBody);
  } finally {
    detailLoading.set(false);
    // Perform actions here, regardless of success or failure
    // For example, dataLoading.set(false);
  }
}
