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
    facility.posts = await this.getPostsByFacilityId(id);

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
        INSERT INTO facility (name, business_id, type, description, url, phone, email)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
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
        await this.insertAddress(client, facilityId, data.address);
      }

      // Other stamp_ruleset, opening_hours, menu
      if (data.openingHours) {
        await this.insertOpeningHours(client, facilityId, data.openingHours);
      }

      if (data.menu) {
        await this.insertMenuItems(client, facilityId, data.menu);
      }
      if (data.posts) {
        await this.insertPosts(client, facilityId, data.posts);
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
      if (client) {
        client?.release();
      }
    }
  }

  async insertPosts(client, facilityId, posts) {
    const query = `
      INSERT INTO post (author_id, facility_id, title, content, img_uri)
      VALUES ($1, $2, $3, $4, $5)
    `;
    for (const post of posts) {
      const values = [
        post.authorId,
        facilityId,
        post.title,
        post.content,
        post.imgUri || "",
      ];
      await client.query(query, values);
    }
  }

  async insertAddress(client, facilityId, address) {
    const query = `
    INSERT INTO address (facility_id, post_number, country, city, road_address, jibun_address, english_address, lat, lng)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    ON CONFLICT (facility_id) DO UPDATE
    SET post_number = EXCLUDED.post_number,
        country = EXCLUDED.country,
        city = EXCLUDED.city,
        road_address = EXCLUDED.road_address,
        jibun_address = EXCLUDED.jibun_address,
        english_address = EXCLUDED.english_address,
        lat = EXCLUDED.lat,
        lng = EXCLUDED.lng;

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
      await client.query(query, values);
    }
  }

  async updateFacility(id, data) {
    let client;
    try {
      client = await db.connect();
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
        await this.insertAddress(client, id, data.address);
      }
      // Update stamp_ruleset if provided
      if (data.stampRuleset) {
        const stampRulesetQuery = `
          update stamp_ruleset SET logo_img_uri = $1, total_cnt = $2
          WHERE facility_id = $3;
        `;
        const stampRulesetValues = [
          data.stampRuleset.logoImgUri,
          data.stampRuleset.totalCnt,
          id,
        ];
        await client.query(stampRulesetQuery, stampRulesetValues);
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
      if (client) {
        await client.query("ROLLBACK");
      }
      throw error;
    } finally {
      if (client) {
        client.release();
      }
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
      if (client) {
        await client.query("ROLLBACK");
      }
      throw error;
    } finally {
      client?.release();
    }
  }
  async upsertMenuItem(client, facilityId, menuItem) {
    // Check if menu item exists
    const checkQuery =
      "SELECT id FROM menu WHERE facility_id = $1 AND name = $2";
    const { rows } = await client.query(checkQuery, [
      facilityId,
      menuItem.name,
    ]);

    if (rows.length > 0) {
      // If exists, update the item
      const updateQuery = `
        UPDATE menu
        SET img_uri = $1, description = $2, price = $3, quantity = $4
        WHERE facility_id = $5 AND name = $6
      `;
      const values = [
        menuItem.imgUri || "",
        menuItem.description || "",
        menuItem.price,
        menuItem.quantity || "",
        facilityId,
        menuItem.name,
      ];
      await client.query(updateQuery, values);
    } else {
      // If not exists, insert new item
      const insertQuery = `
        INSERT INTO menu (facility_id, name, img_uri, description, price, quantity)
        VALUES ($1, $2, $3, $4, $5, $6);
      `;
      const values = [
        facilityId,
        menuItem.name,
        menuItem.imgUri || "",
        menuItem.description || "",
        menuItem.price,
        menuItem.quantity || "",
      ];
      await client.query(insertQuery, values);
    }
  }
  async upsertMenu(client, facilityId, menuItems) {
    for (const item of menuItems) {
      await this.upsertMenuItem(client, facilityId, item);
    }
  }

  async updateOpeningHours(facilityId, openingHours) {
    let client;
    try {
      client = await db.connect();
      await client.query("BEGIN");

      for (const hour of openingHours) {
        // Try to update the opening hours for the given day
        const updateQuery = `
          UPDATE opening_hours 
          SET open_time = $3, close_time = $4 
          WHERE facility_id = $1 AND day = $2
        `;
        const updateValues = [
          facilityId,
          hour.day,
          hour.open_time,
          hour.close_time,
        ];
        const updateResult = await client.query(updateQuery, updateValues);

        // If no rows were updated, insert the new opening hours
        if (updateResult.rowCount === 0) {
          const insertQuery = `
            INSERT INTO opening_hours (facility_id, day, open_time, close_time)
            VALUES ($1, $2, $3, $4)
          `;
          const insertValues = [
            facilityId,
            hour.day,
            hour.open_time,
            hour.close_time,
          ];
          await client.query(insertQuery, insertValues);
        }
      }

      await client.query("COMMIT");
      return { message: "Opening hours updated successfully" };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client?.release();
    }
  }
  async getMenuItemById(facilityId, menuId) {
    const query = `
      SELECT * FROM menu WHERE facility_id = $1 AND id = $2;
    `;
    const values = [facilityId, menuId];
    const { rows } = await db.query(query, values);
    if (rows.length === 0) {
      throw new Error("Menu item not found");
    }
    return rows[0];
  }
  async createMenu(facilityId, menuItems) {
    let client;
    try {
      client = await db.connect();
      await client.query("BEGIN");

      // Insert menu items
      for (const item of menuItems) {
        const query = `
          INSERT INTO menu (facility_id, name, img_uri, description, price, quantity)
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
        await client.query(query, values);
      }

      await client.query("COMMIT");
      return { message: "Menu created successfully" };
    } catch (error) {
      if (client) {
        await client.query("ROLLBACK");
      }
      throw error;
    } finally {
      client?.release();
    }
  }
  async updateMenuItem(facilityId, menuId, menuItemData) {
    let client;
    try {
      client = await db.connect();
      await client.query("BEGIN");

      const query = `
        UPDATE menu
        SET name = $1, img_uri = $2, description = $3, price = $4, quantity = $5, updated_at = NOW()
        WHERE facility_id = $6 AND id = $7
        RETURNING *;
      `;
      const values = [
        menuItemData.name,
        menuItemData.imgUri || "",
        menuItemData.description || "",
        menuItemData.price,
        menuItemData.quantity || "",
        facilityId,
        menuId,
      ];
      const result = await client.query(query, values);

      await client.query("COMMIT");
      if (result.rowCount === 0) {
        throw new Error("Menu item not found or not updated");
      }
      return result.rows[0];
    } catch (error) {
      if (client) {
        await client.query("ROLLBACK");
      }
      throw error;
    } finally {
      client?.release();
    }
  }
  async deleteMenu(facilityId, menuId) {
    let client;
    try {
      client = await db.connect();
      await client.query("BEGIN");

      const deleteQuery = `
        DELETE FROM menu
        WHERE facility_id = $1 AND id = $2
        RETURNING *;
      `;
      const values = [facilityId, menuId];
      const result = await client.query(deleteQuery, values);

      if (result.rowCount === 0) {
        throw new Error("Menu item not found");
      }

      await client.query("COMMIT");
      return { message: "Menu item deleted successfully" };
    } catch (error) {
      if (client) {
        await client.query("ROLLBACK");
      }
      throw error;
    } finally {
      client?.release();
    }
  }

  async getPostsByFacilityId(facilityId) {
    let client;
    try {
      client = await db.connect();
      const query =
        "SELECT * FROM post WHERE facility_id = $1 ORDER BY created_at DESC";
      const { rows } = await client.query(query, [facilityId]);
      return rows;
    } finally {
      client?.release();
    }
  }

  async getPostById(facilityId, postId) {
    let client;
    try {
      client = await db.connect();
      const query = "SELECT * FROM post WHERE facility_id = $1 AND id = $2";
      const { rows } = await client.query(query, [facilityId, postId]);
      if (rows.length === 0) throw new Error("Post not found");
      return rows[0];
    } finally {
      client?.release();
    }
  }

  async createPost(facilityId, data) {
    let client;
    try {
      client = await db.connect();
      await client.query("BEGIN");

      const query = `
        INSERT INTO post (author_id, facility_id, title, content, img_uri)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
      `;
      const values = [
        data.authorId,
        facilityId,
        data.title,
        data.content,
        data.img_uri || "",
      ];

      const { rows } = await client.query(query, values);
      await client.query("COMMIT");
      return rows[0];
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client?.release();
    }
  }
  async updatePost(facilityId, postId, postData) {
    let client;
    try {
      client = await db.connect();
      const query = `
        UPDATE post
        SET title = $1, content = $2, img_uri = $3, updated_at = current_timestamp
        WHERE facility_id = $4 AND id = $5
        RETURNING *;
      `;
      const values = [
        postData.title,
        postData.content,
        postData.imgUri || "",
        facilityId,
        postId,
      ];
      const { rows } = await client.query(query, values);
      if (rows.length === 0) throw new Error("Post not found");
      return rows[0];
    } finally {
      client?.release();
    }
  }

  async deletePost(facilityId, postId) {
    let client;
    try {
      client = await db.connect();
      const query =
        "DELETE FROM post WHERE facility_id = $1 AND id = $2 RETURNING *";
      const { rows } = await client.query(query, [facilityId, postId]);
      if (rows.length === 0) throw new Error("Post not found");
      return { message: "Post deleted successfully" };
    } finally {
      client?.release();
    }
  }
}

module.exports = new FacilityService();
