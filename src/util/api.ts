import { dataLoading, detailLoading, secondaryDetailLoading } from "../store/store";
import { API_KEY, SORT_DIRECTION_ASCENDING } from "./constants";

async function fetchData(apiEndpoint: string, requestBody: object) {
  try {
    const response = await fetch(apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "3ba9fad9-81ac-42fa-9255-688bfe7222a5",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

export async function getData(currency: string | undefined, sort: string | undefined, order: string | undefined, limit: number | undefined, currentPage: number | undefined) {
  dataLoading.set(true);
  try {
    const apiEndpoint = "https://api.livecoinwatch.com/coins/list";
    const requestBody = {
      currency,
      sort: sort || "rank",
      order: order || SORT_DIRECTION_ASCENDING,
      limit: limit || 2000,
      offset: currentPage && currentPage * limit - limit,
      meta: true,
    };
    const data = await fetchData(apiEndpoint, requestBody);
    return data;
  } finally {
    dataLoading.set(false);
  }
}

export async function getHistoricalData(code: string | undefined, currency: string | undefined, start: number | undefined, end: number | undefined) {
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
    const data = await fetchData(apiEndpoint, requestBody);
    return data;
  } finally {
    secondaryDetailLoading.set(false);
  }
}

export async function getOverviewData(currency: string | undefined) {
  const apiEndpoint = "https://api.livecoinwatch.com/overview";
  const requestBody = {
    currency,
    meta: true,
  };
  const data = await fetchData(apiEndpoint, requestBody);
  return data;
}

export async function getDataSingle(currency: string | undefined, code: string | undefined) {
  detailLoading.set(true);
  try {
    const apiEndpoint = "https://api.livecoinwatch.com/coins/single";
    const requestBody = {
      currency,
      code,
      meta: true,
    };
    const data = await fetchData(apiEndpoint, requestBody);
    return data;
  } finally {
    detailLoading.set(false);
  }
}
