const { MeiliSearch } = require("meilisearch");

// Configure MeiliSearch client
const meiliClient = new MeiliSearch({
  host: "http://127.0.0.1:7700",
  apiKey: process.env.MEILISEARCH_MASTER_KEY,
});

async function fetchFacilities() {
  const index = meiliClient.index("facilities");
  const searchResult = await index.search("");
  console.log("Facilities:", searchResult.hits);
}

// Run the fetching function
fetchFacilities().catch(console.error);
