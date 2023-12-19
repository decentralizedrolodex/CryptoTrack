export async function fetchData(apiEndpoint: string, requestBody: object) {
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
      throw new Error(`Network response was not ok. Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Throw the error for better error handling in calling functions
  }
}

export async function getData(
  currency?: string | undefined | null,
  sort?: string | undefined | null,
  order?: string | undefined | null,
  limit?: number | undefined | null,
  currentPage?: number | undefined | null,
  currentEntry?: number | undefined | null
) {
  dataLoading.set(true);

  const apiEndpoint = "https://api.livecoinwatch.com/coins/list";
  const recordsPerPage = 100;
  const desiredLimit = 1000;

  let allData = [];
  try {
    for (let page = 1; page <= Math.ceil(desiredLimit / recordsPerPage); page++) {
      const requestBody = {
        currency,
        sort: sort || "rank",
        order: order || SORT_DIRECTION_ASCENDING,
        limit: Math.min(recordsPerPage, desiredLimit - (page - 1) * recordsPerPage),
        offset: (page - 1) * recordsPerPage,
        meta: true,
      };

      const data = await fetchData(apiEndpoint, requestBody);

      if (data) {
        allData = allData.concat(data);
      } else {
        console.error("Failed to fetch data for page", page);
        // Handle error or retry logic if needed
      }
    }

    return allData;
  } finally {
    dataLoading.set(false);
  }
}
