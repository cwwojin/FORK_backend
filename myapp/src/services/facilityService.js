const db = require("../models/index");

class FacilityService {
  async getAllFacilities() {
    const query = "SELECT * FROM facility ORDER BY id ASC";
    const { rows } = await db.query(query);
    return rows;
  }

  async getFacilityById(id) {
    const query = "SELECT * FROM facility WHERE id = $1";
    const { rows } = await db.query(query, [id]);
    if (rows.length === 0) throw new Error("Facility not found");
    return rows[0];
  }

  async createFacility(data) {
    const query =
      "INSERT INTO facility (name, business_id, type, description, url) VALUES ($1, $2, $3, $4, $5) RETURNING *";
    const values = [
      data.name,
      data.business_id,
      data.type,
      data.description,
      data.url,
    ];
    const { rows } = await db.query(query, values);
    return rows[0];
  }

  async updateFacility(id, data) {
    const query =
      "UPDATE facility SET name = $1, business_id = $2, type = $3, description = $4, url = $5 WHERE id = $6 RETURNING *";
    const values = [
      data.name,
      data.business_id,
      data.type,
      data.description,
      data.url,
      id,
    ];
    const { rows } = await db.query(query, values);
    return rows[0];
  }

  async deleteFacility(id) {
    const query = "DELETE FROM facility WHERE id = $1";
    const { rowCount } = await db.query(query, [id]);
    if (rowCount === 0) throw new Error("Facility not found");
    return { message: "Facility deleted successfully" };
  }
}

module.exports = new FacilityService();
