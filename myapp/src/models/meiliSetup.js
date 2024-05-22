// File: src/models/meiliSetup.js
const { MeiliSearch } = require("meilisearch");
const { Pool } = require("pg");

// Configure MeiliSearch client
const meiliClient = new MeiliSearch({
  host: "http://127.0.0.1:7700",
  apiKey: process.env.MEILISEARCH_MASTER_KEY,
});

// Configure PostgreSQL client
const pool = new Pool({
  user: process.env.POSTGRES_DEV_USERNAME,
  host: process.env.POSTGRES_DEV_HOST,
  database: process.env.POSTGRES_DEV_DATABASE,
  password: process.env.POSTGRES_DEV_PASSWORD,
  port: 5432,
  max: 10,
});

async function indexFacilities() {
  const client = await pool.connect();
  try {
    // Fetch facilities from PostgreSQL
    const res = await client.query("SELECT * FROM facility_pin");
    const facilities = res.rows;

    // Create or get MeiliSearch index
    const index = meiliClient.index("facilities");
    await index.updateSettings({
      searchableAttributes: [
        "name",
        "description",
        "road_address",
        "english_address",
        "preferences",
      ],
      displayedAttributes: [
        "id",
        "name",
        "slug",
        "profile_img_uri",
        "description",
        "lat",
        "lng",
        "road_address",
        "english_address",
        "avg_score",
        "opening_hours",
        "preference_ids",
        "preferences",
      ],
      filterableAttributes: ["opening_hours", "preference_ids"],
    });

    // Add documents to MeiliSearch index
    const response = await index.addDocuments(facilities);
    console.log("Facilities indexed successfully", response);
  } finally {
    client.release();
  }
}

// Run the indexing function
indexFacilities().catch(console.error);
