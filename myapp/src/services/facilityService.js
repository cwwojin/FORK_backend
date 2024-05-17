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
    const facility = rows[0];
    facility.openingHours = await this.getOpeningHoursByFacilityId(id);
    facility.menu = await this.getMenuByFacilityId(id);

    return facility;
  }
  async getOpeningHoursByFacilityId(facilityId) {
    const query = "SELECT * FROM opening_hours WHERE facility_id = $1";
    const { rows } = await db.query(query, [facilityId]);
    return rows;
  }

  async getMenuByFacilityId(facilityId) {
    const query = "SELECT * FROM menu WHERE facility_id = $1";
    const { rows } = await db.query(query, [facilityId]);
    return rows;
  }

  async createFacility(data) {
    let client;
    try {
      // Use of client and transaction control
      client = await db.connect();
      await client.query("BEGIN");

      // Insert into facility table, get the facility ID
      const facilityQuery = `
        INSERT INTO facility (name, business_id, type, description, url)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id;
      `;
      const facilityValues = [
        data.name,
        data.businessId,
        data.type,
        data.description,
        data.url,
        data.phone,
        data.email,
      ];
      const facilityResult = await client.query(facilityQuery, facilityValues);
      const facilityId = facilityResult.rows[0].id;

      // Insert into address table
      if (data.address) {
        const addressQuery = `
          INSERT INTO address (facility_id, post_number, country, city, road_address, jibun_address, english_address, lat, lng)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);
        `;
        const addressValues = [facilityId, ...Object.values(data.address)];
        await client.query(addressQuery, addressValues);
      }

      // Other stamp_ruleset, opening_hours, menu
      if (data.openingHours) {
        for (const hour of data.openingHours) {
          const hoursQuery = `
            INSERT INTO opening_hours (facility_id, day, open_time, close_time)
            VALUES ($1, $2, $3, $4);
          `;
          const hoursValues = [
            facilityId,
            hour.day,
            hour.openTime,
            hour.closeTime,
          ];
          await client.query(hoursQuery, hoursValues);
        }
      }

      if (data.menu) {
        for (const item of data.menu) {
          const menuQuery = `
            INSERT INTO menu (facility_id, name, img_uri, description, price, quantity)
            VALUES ($1, $2, $3, $4, $5, $6, $7);
          `;
          const menuValues = [
            facilityId,
            item.name,
            item.imgUrl || "",
            item.description || "",
            item.price,
            item.quantity || "",
          ];
          await client.query(menuQuery, menuValues);
        }
      }

      // If successful, commit the transaction
      await client.query("COMMIT");
      return facilityResult.rows[0];
    } catch (error) {
      if (client) {
        await client.query("ROLLBACK");
      }
      throw error;
    } finally {
      client?.release();
    }
  }

  async insertAddress(client, facilityId, address) {
    const query = `
      INSERT INTO address (facility_id, post_number, country, city, road_address, jibun_address, english_address, lat, lng)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);
    `;
    const values = [
      facilityId,
      address.postNumber,
      address.country,
      address.city,
      address.roadAddress,
      address.jibunAddress,
      address.englishAddress,
      address.lat,
      address.lng,
    ];
    await client.query(query, values);
  }

  async insertStampRuleset(facilityId, stampRuleset) {
    const query = `
      INSERT INTO stamp_ruleset (facility_id, logo_img_uri, total_cnt)
      VALUES ($1, $2, $3);
    `;
    const values = [
      facilityId,
      stampRuleset.logo_img_uri,
      stampRuleset.total_cnt,
    ];
    await db.query(query, values);
  }

  async insertOpeningHours(client, facilityId, openingHours) {
    for (const hour of openingHours) {
      const query = `
        INSERT INTO opening_hours (facility_id, day, open_time, close_time)
        VALUES ($1, $2, $3, $4);
      `;
      const values = [facilityId, hour.day, hour.openTime, hour.closeTime];
      await client.query(query, values);
    }
  }

  async insertMenuItems(client, facilityId, menuItems) {
    for (const item of menuItems) {
      const query = `
        INSERT INTO menu (facility_id, name, img_uri, description, price, quantity)
        VALUES ($1, $2, $3, $4, $5, $6, $7);
      `;
      const values = [
        facilityId,
        item.name,
        item.imgUri || "",
        item.description || "",
        item.price,
        item.quantity || "",
      ];
      await client.query(query, values);
    }
  }

  async updateFacility(id, data) {
    let client;
    try {
      await client.query("BEGIN");

      // Update facility table
      const query = `
        UPDATE facility SET name = $1, business_id = $2, type = $3, description = $4, url = $5, phone = $6, email = $7
        WHERE id = $8
        RETURNING *;
      `;
      const values = [
        data.name,
        data.businessId,
        data.type,
        data.description,
        data.url,
        data.phone,
        data.email,
        id,
      ];
      const facilityResult = await client.query(query, values);

      // Update address table if provided
      if (data.address) {
        const addressQuery = `
          UPDATE address SET post_number = $1, country = $2, city = $3, road_address = $4, jibun_address = $5, english_address = $6, lat = $7, lng = $8
          WHERE facility_id = $9;
        `;
        const addressValues = [
          data.address.postNumber,
          data.address.country,
          data.address.city,
          data.address.roadAddress,
          data.address.jibunAddress,
          data.address.englishAddress,
          data.address.lat,
          data.address.lng,
          id,
        ];
        await client.query(addressQuery, addressValues);
      }

      // Update stamp_ruleset if provided
      if (data.stamp_ruleset) {
        query = `
          update stamp_ruleset SET logo_img_uri = $1, total_cnt = $2
          WHERE facility_id = $3;
        `;
        values = [
          data.stamp_ruleset.logoImgUri,
          data.stamp_ruleset.totalCnt,
          id,
        ];
        await db.query(query, values);
      }

      // Update opening_hours if provided
      if (data.openingHours) {
        // delete existing opening hours
        await client.query("DELETE FROM opening_hours WHERE facility_id = $1", [
          id,
        ]);
        await this.insertOpeningHours(client, id, data.openingHours);
      }

      // Update menu items if provided
      if (data.menu) {
        // Clear existing menu items
        await client.query("DELETE FROM menu WHERE facility_id = $1", [id]);
        await this.insertMenuItems(client, id, data.menu);
      }

      await client.query("COMMIT");
      return facilityResult.rows[0];
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client?.release();
    }
  }

  async deleteFacility(id) {
    const query = "DELETE FROM facility WHERE id = $1";
    const { rowCount } = await db.query(query, [id]);
    if (rowCount === 0) throw new Error("Facility not found");
    return { message: "Facility deleted successfully" };
  }
  async addOpeningHours(facilityId, hours) {
    let client;
    try {
      client = await db.connect();
      await client.query("BEGIN");
      const query = `
      INSERT INTO "opening_hours" (facility_id, day, open_time, close_time)
      VALUES ($1, $2, $3, $4);
    `;
      const values = [facilityId, hours.day, hours.openTime, hours.closeTime];
      await client.query(query, values);
      await client.query("COMMIT");
      return { message: "Opening hours added successfully" };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client?.release();
    }
  }
  async updateMenu(facilityId, menuItems) {
    let client;
    try {
      client = await db.connect();
      await client.query("BEGIN");
      const deleteQuery = 'DELETE FROM "menu" WHERE facility_id = $1;';
      await client.query(deleteQuery, [facilityId]);

      for (const item of menuItems) {
        const insertQuery = `
        INSERT INTO "menu" (facility_id, name, img_uri, description, price, quantity)
        VALUES ($1, $2, $3, $4, $5, $6);
      `;
        const values = [
          facilityId,
          item.name,
          item.imgUri || "",
          item.description || "",
          item.price,
          item.quantity || "",
        ];
        await client.query(insertQuery, values);
      }

      await client.query("COMMIT");
      return { message: "Menu updated successfully" };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client?.release();
    }
  }
}

module.exports = new FacilityService();
