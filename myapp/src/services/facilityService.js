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
    try {
      await db.query("BEGIN");

      // Insert into facility table
      let query = `
        INSERT INTO facility (name, business_id, type, description, url)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id;
      `;
      let values = [
        data.name,
        data.business_id,
        data.type,
        data.description,
        data.url,
      ];
      const facilityResult = await db.query(query, values);
      const facilityId = facilityResult.rows[0].id;

      // Insert into address table
      if (data.address) {
        query = `
          INSERT INTO address (facility_id, post_number, country, city, road_address, jibun_address, english_address, lat, lng)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);
        `;
        values = [
          facilityId,
          data.address.post_number,
          data.address.country,
          data.address.city,
          data.address.road_address,
          data.address.jibun_address,
          data.address.english_address,
          data.address.lat,
          data.address.lng,
        ];
        await db.query(query, values);
      }

      // Insert into stamp_ruleset table if provided
      if (data.stamp_ruleset) {
        query = `
          INSERT INTO stamp_ruleset (facility_id, logo_img_uri, total_cnt)
          VALUES ($1, $2, $3);
        `;
        values = [
          facilityId,
          data.stamp_ruleset.logo_img_uri,
          data.stamp_ruleset.total_cnt,
        ];
        await db.query(query, values);
      }

      // Insert into opening_hours table if provided
      if (data.opening_hours && data.opening_hours.length) {
        data.opening_hours.forEach(async (hour) => {
          query = `
            INSERT INTO opening_hours (facility_id, day, open_time, close_time)
            VALUES ($1, $2, $3, $4);
          `;
          values = [facilityId, hour.day, hour.open_time, hour.close_time];
          await db.query(query, values);
        });
      }

      // Insert into menu table if provided
      if (data.menu && data.menu.length) {
        data.menu.forEach(async (item) => {
          query = `
            INSERT INTO menu (facility_id, name, slug, img_uri, description, price, quantity)
            VALUES ($1, $2, $3, $4, $5, $6, $7);
          `;
          values = [
            facilityId,
            item.name,
            item.slug,
            item.img_uri,
            item.description,
            item.price,
            item.quantity,
          ];
          await db.query(query, values);
        });
      }

      await db.query("COMMIT");

      return facilityResult.rows[0];
    } catch (error) {
      await db.query("ROLLBACK");
      throw error;
    }
  }

  async updateFacility(id, data) {
    try {
      await db.query("BEGIN");

      // Update facility table
      let query = `
        UPDATE facility SET name = $1, business_id = $2, type = $3, description = $4, url = $5
        WHERE id = $6
        RETURNING *;
      `;
      let values = [
        data.name,
        data.business_id,
        data.type,
        data.description,
        data.url,
        id,
      ];
      const facilityResult = await db.query(query, values);

      // Update address table if provided
      if (data.address) {
        query = `
          UPDATE address SET post_number = $1, country = $2, city = $3, road_address = $4, jibun_address = $5, english_address = $6, lat = $7, lng = $8
          WHERE facility_id = $9;
        `;
        values = [
          data.address.post_number,
          data.address.country,
          data.address.city,
          data.address.road_address,
          data.address.jibun_address,
          data.address.english_address,
          data.address.lat,
          data.address.lng,
          id,
        ];
        await db.query(query, values);
      }

      // Update stamp_ruleset if provided
      if (data.stamp_ruleset) {
        query = `
          update stamp_ruleset SET logo_img_uri = $1, total_cnt = $2
          WHERE facility_id = $3;
        `;
        values = [
          data.stamp_ruleset.logo_img_uri,
          data.stamp_ruleset.total_cnt,
          id,
        ];
        await db.query(query, values);
      }

      // Update opening_hours if provided
      if (data.opening_hours && data.opening_hours.length > 0) {
        // Clear existing opening hours
        await db.query("DELETE FROM opening_hours WHERE facility_id = $1", [
          id,
        ]);

        // Insert new opening hours
        for (const hour of data.opening_hours) {
          query = `
            INSERT INTO opening_hours (facility_id, day, open_time, close_time)
            VALUES ($1, $2, $3, $4);
          `;
          values = [id, hour.day, hour.open_time, hour.close_time];
          await db.query(query, values);
        }
      }

      // Update menu items if provided
      if (data.menu && data.menu.length > 0) {
        // Clear existing menu items
        await db.query("DELETE FROM menu WHERE facility_id = $1", [id]);

        // Insert new menu items
        for (const item of data.menu) {
          query = `
            insert into menu (facility_id, name, slug, img_uri, description, price, quantity)
            VALUES ($1, $2, $3, $4, $5, $6, $7);
          `;
          values = [
            id,
            item.name,
            item.slug,
            item.img_uri,
            item.description,
            item.price,
            item.quantity,
          ];
          await db.query(query, values);
        }
      }

      await db.query("COMMIT");
      return facilityResult.rows[0];
    } catch (error) {
      await db.query("ROLLBACK");
      throw error;
    }
  }

  async deleteFacility(id) {
    const query = "DELETE FROM facility WHERE id = $1";
    const { rowCount } = await db.query(query, [id]);
    if (rowCount === 0) throw new Error("Facility not found");
    return { message: "Facility deleted successfully" };
  }
}

module.exports = new FacilityService();
