const db = require("../models/index");

class FacilityService {
  async getAllFacilities() {
    const query = "SELECT * FROM facility_address_avgscore ORDER BY id ASC";
    const { rows } = await db.query(query);
    return rows;
  }

  async getFacilityById(id) {
    const query = "SELECT * FROM facility_address_avgscore WHERE id = $1";
    const { rows } = await db.query(query, [id]);
    if (rows.length === 0) throw new Error("Facility not found");
    const facility = rows[0];
    facility.openingHours = await this.getOpeningHoursByFacilityId(id);
    facility.menu = await this.getMenuByFacilityId(id);
    facility.posts = await this.getPostsByFacilityId(id);

    return facility;
  }

  async createFacility(data) {
    let client;
    try {
      client = await db.connect();
      await client.query("BEGIN");

      // Insert into facility table, get the facility ID
      const facilityQuery = `
        INSERT INTO facility (name, business_id, type, description, url, phone, email, profile_img_uri)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;
      `;
      const facilityValues = [
        data.name,
        data.businessId,
        data.type,
        data.description,
        data.url,
        data.phone,
        data.email,
        data.profileImgUri,
      ];
      const facilityResult = await client.query(facilityQuery, facilityValues);
      const facility = facilityResult.rows[0];

      // Insert into address table
      await this.insertAddress(client, facility.id, data.address);
      // Insert opening hours, menu, and posts if provided
      if (data.openingHours) {
        await this.insertOpeningHours(client, facility.id, data.openingHours);
      }
      if (data.menu) {
        await this.insertMenuItems(client, facility.id, data.menu);
      }
      if (data.posts) {
        await this.insertPosts(client, facility.id, data.posts);
      }

      await client.query("COMMIT");
      return facility;
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
        lng = EXCLUDED.lng
    RETURNING *;
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
    const { rows } = await client.query(query, values);
    return rows[0];
  }

  async insertOpeningHours(client, facilityId, openingHours) {
    const deleteQuery = "DELETE FROM opening_hours WHERE facility_id = $1";
    await client.query(deleteQuery, [facilityId]);

    const insertQuery = `
      INSERT INTO opening_hours (facility_id, day, open_time, close_time)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const result = [];
    for (const hour of openingHours) {
      const values = [facilityId, hour.day, hour.openTime, hour.closeTime];
      const { rows } = await client.query(insertQuery, values);
      result.push(rows[0]);
    }
    return result;
  }

  async insertMenuItems(client, facilityId, menuItems) {
    const result = [];
    for (const item of menuItems) {
      const query = `
        INSERT INTO menu (facility_id, name, img_uri, description, price, quantity)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
      `;
      const values = [
        facilityId,
        item.name,
        item.imgUri,
        item.description,
        item.price,
        item.quantity,
      ];
      const { rows } = await client.query(query, values);
      result.push(rows[0]);
    }
    return result;
  }

  async insertPosts(client, facilityId, posts) {
    const result = [];
    for (const post of posts) {
      const query = `
      INSERT INTO post (author_id, facility_id, title, content, img_uri)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
      const values = [
        post.authorId,
        facilityId,
        post.title,
        post.content,
        post.imgUri,
      ];
      const { rows } = await client.query(query, values);
      result.push(rows[0]);
    }
    return result;
  }

  async updateFacility(id, data) {
    let client;
    try {
      client = await db.connect();
      await client.query("BEGIN");

      const updateFields = [];
      const updateValues = [];
      let fieldIndex = 1;

      if (data.name !== undefined) {
        updateFields.push(`name = $${fieldIndex++}`);
        updateValues.push(data.name);
      }
      if (data.businessId !== undefined) {
        updateFields.push(`business_id = $${fieldIndex++}`);
        updateValues.push(data.businessId);
      }
      if (data.type !== undefined) {
        updateFields.push(`type = $${fieldIndex++}`);
        updateValues.push(data.type);
      }
      if (data.description !== undefined) {
        updateFields.push(`description = $${fieldIndex++}`);
        updateValues.push(data.description);
      }
      if (data.url !== undefined) {
        updateFields.push(`url = $${fieldIndex++}`);
        updateValues.push(data.url);
      }
      if (data.phone !== undefined) {
        updateFields.push(`phone = $${fieldIndex++}`);
        updateValues.push(data.phone);
      }
      if (data.email !== undefined) {
        updateFields.push(`email = $${fieldIndex++}`);
        updateValues.push(data.email);
      }

      if (updateFields.length > 0) {
        const query = `
          UPDATE facility SET ${updateFields.join(", ")}
          WHERE id = $${fieldIndex}
          RETURNING *;
        `;
        updateValues.push(id);
        const facilityResult = await client.query(query, updateValues);
        const facility = facilityResult.rows[0];

        if (data.address) {
          facility.address = await this.insertAddress(client, id, data.address);
        }

        if (data.openingHours) {
          facility.openingHours = await this.insertOpeningHours(
            client,
            id,
            data.openingHours
          );
        }

        if (data.menu) {
          facility.menu = await this.insertMenuItems(client, id, data.menu);
        }

        await client.query("COMMIT");
        return facility;
      } else {
        throw new Error("No fields to update");
      }
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
    let client;
    try {
      client = await db.connect();
      await client.query("BEGIN");

      const query = "DELETE FROM facility WHERE id = $1 RETURNING *";
      const { rows } = await client.query(query, [id]);

      await client.query("COMMIT");
      return rows; // Return the deleted rows or an empty array if none
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async getAddressByFacilityId(facilityId) {
    const query = "SELECT * FROM address WHERE facility_id = $1";
    const { rows } = await db.query(query, [facilityId]);
    return rows;
  }

  async addAddress(facilityId, address) {
    let client;
    try {
      client = await db.connect();
      await client.query("BEGIN");

      const deleteQuery = "DELETE FROM address WHERE facility_id = $1";
      await client.query(deleteQuery, [facilityId]);

      const insertQuery = `
        INSERT INTO address (facility_id, post_number, country, city, road_address, jibun_address, english_address, lat, lng)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *;
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
      const { rows } = await client.query(insertQuery, values);

      await client.query("COMMIT");
      return rows[0];
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async deleteAddressByFacilityId(facilityId) {
    let client;
    try {
      client = await db.connect();
      await client.query("BEGIN");

      const deleteQuery =
        "DELETE FROM address WHERE facility_id = $1 RETURNING *;";
      const { rows } = await client.query(deleteQuery, [facilityId]);

      await client.query("COMMIT");
      return rows; // Return the deleted rows or an empty array if none
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async getOpeningHoursByFacilityId(facilityId) {
    const query = "SELECT * FROM opening_hours WHERE facility_id = $1";
    const { rows } = await db.query(query, [facilityId]);
    return rows;
  }

  async addOpeningHours(facilityId, openingHours) {
    let client;
    try {
      client = await db.connect();
      await client.query("BEGIN");

      const deleteQuery = "DELETE FROM opening_hours WHERE facility_id = $1";
      await client.query(deleteQuery, [facilityId]);

      const insertQuery = `
        INSERT INTO opening_hours (facility_id, day, open_time, close_time)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `;

      const result = [];
      const hoursArray = Array.isArray(openingHours)
        ? openingHours
        : [openingHours];

      for (const hour of hoursArray) {
        const values = [facilityId, hour.day, hour.openTime, hour.closeTime];
        const { rows } = await client.query(insertQuery, values);
        result.push(rows[0]);
      }

      await client.query("COMMIT");
      return result;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async deleteOpeningHours(facilityId) {
    let client;
    try {
      client = await db.connect();
      await client.query("BEGIN");

      const deleteQuery = `
        DELETE FROM opening_hours WHERE facility_id = $1
        RETURNING *;
      `;
      const { rows } = await client.query(deleteQuery, [facilityId]);

      await client.query("COMMIT");
      return rows; // Return the deleted rows or an empty array if none
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async getMenuByFacilityId(facilityId) {
    const query = "SELECT * FROM menu WHERE facility_id = $1";
    const { rows } = await db.query(query, [facilityId]);
    return rows;
  }

  async getMenuItemById(menuId) {
    const query = "SELECT * FROM menu WHERE id = $1";
    const { rows } = await db.query(query, [menuId]);
    if (rows.length === 0) throw new Error("Menu item not found");
    return rows[0];
  }

  async createMenu(facilityId, menuItems) {
    let client;
    try {
      client = await db.connect();
      await client.query("BEGIN");

      // Insert menu items
      const result = [];
      for (const item of menuItems) {
        const query = `
          INSERT INTO menu (facility_id, name, img_uri, description, price, quantity)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING *;
        `;
        const values = [
          facilityId,
          item.name,
          item.imgUri,
          item.description,
          item.price,
          item.quantity,
        ];
        const { rows } = await client.query(query, values);
        result.push(rows[0]);
      }

      await client.query("COMMIT");
      return result;
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

      const updateFields = [];
      const updateValues = [];
      let fieldIndex = 1;

      if (menuItemData.name !== undefined) {
        updateFields.push(`name = $${fieldIndex++}`);
        updateValues.push(menuItemData.name);
      }
      if (menuItemData.description !== undefined) {
        updateFields.push(`description = $${fieldIndex++}`);
        updateValues.push(menuItemData.description);
      }
      if (menuItemData.price !== undefined) {
        updateFields.push(`price = $${fieldIndex++}`);
        updateValues.push(menuItemData.price);
      }
      if (menuItemData.quantity !== undefined) {
        updateFields.push(`quantity = $${fieldIndex++}`);
        updateValues.push(menuItemData.quantity);
      }

      if (updateFields.length > 0) {
        const query = `
          UPDATE menu SET ${updateFields.join(", ")}
          WHERE facility_id = $${fieldIndex} AND id = $${fieldIndex + 1}
          RETURNING *;
        `;
        updateValues.push(facilityId, menuId);
        const { rows } = await client.query(query, updateValues);

        await client.query("COMMIT");
        if (rows.length === 0) {
          throw new Error("Menu item not found or not updated");
        }
        return rows[0];
      } else {
        throw new Error("No fields to update");
      }
    } catch (error) {
      await client.query("ROLLBACK");
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
        DELETE FROM menu WHERE facility_id = $1 AND id = $2 RETURNING *;
      `;
      const { rows } = await client.query(deleteQuery, [facilityId, menuId]);

      await client.query("COMMIT");
      return rows; // Return the deleted rows or an empty array if none
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async getPostsByFacilityId(facilityId) {
    const query =
      "SELECT * FROM post WHERE facility_id = $1 ORDER BY created_at DESC";
    const { rows } = await db.query(query, [facilityId]);
    return rows;
  }

  async getPostById(postId) {
    const query = "SELECT * FROM post WHERE id = $1";
    const { rows } = await db.query(query, [postId]);
    if (rows.length === 0) throw new Error("Post not found");
    return rows[0];
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
        data.imgUri,
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

  async updatePost(postId, postData) {
    let client;
    try {
      client = await db.connect();
      await client.query("BEGIN");

      const query = `
        UPDATE post
        SET title = $1, content = $2, updated_at = NOW()
        WHERE id = $3
        RETURNING *;
      `;
      const values = [postData.title, postData.content, postId];
      const { rows } = await client.query(query, values);

      await client.query("COMMIT");
      if (rows.length === 0) {
        throw new Error("Post not found or not updated");
      }
      return rows[0];
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async deletePost(postId) {
    let client;
    try {
      client = await db.connect();
      await client.query("BEGIN");

      const deleteQuery = "DELETE FROM post WHERE id = $1 RETURNING *";
      const { rows } = await client.query(deleteQuery, [postId]);

      await client.query("COMMIT");
      return rows; // Return the deleted rows or an empty array if none
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async getStampRulesetRewardsByFacilityId(facilityId) {
    const query = "SELECT * FROM stamp_ruleset_rewards WHERE facility_id = $1";
    const { rows } = await db.query(query, [facilityId]);
    if (rows.length === 0) throw new Error("Stamp ruleset not found");
    return rows[0];
  }
  async createStampRuleset(facilityId, data) {
    let client;
    try {
      client = await db.connect();
      await client.query("BEGIN");

      // Delete existing stamp ruleset and rewards if they exist
      const deleteQuery = `
        DELETE FROM stamp_ruleset WHERE facility_id = $1;
      `;
      await client.query(deleteQuery, [facilityId]);

      const deleteRewardsQuery = `
        DELETE FROM stamp_reward WHERE facility_id = $1;
      `;
      await client.query(deleteRewardsQuery, [facilityId]);

      // Insert the new stamp ruleset
      const insertQuery = `
        INSERT INTO stamp_ruleset (facility_id, logo_img_uri, total_cnt)
        VALUES ($1, $2, $3)
        RETURNING *;
      `;
      const values = [facilityId, data.logoImgUri, data.totalCnt];
      const { rows } = await client.query(insertQuery, values);

      if (rows.length === 0) {
        throw new Error("Stamp ruleset not created");
      }

      // Insert rewards if provided
      if (data.rewards && data.rewards.length > 0) {
        const rewardsInsertQuery = `
          INSERT INTO stamp_reward (facility_id, cnt, name)
          VALUES ($1, $2, $3)
          RETURNING *;
        `;
        for (const reward of data.rewards) {
          const rewardValues = [facilityId, reward.cnt, reward.name];
          await client.query(rewardsInsertQuery, rewardValues);
        }
      }

      await client.query("COMMIT");
      return rows[0];
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async updateStampRuleset(facilityId, data) {
    let client;
    try {
      client = await db.connect();
      await client.query("BEGIN");

      const query = `
        UPDATE stamp_ruleset
        SET total_cnt = $1, updated_at = NOW()
        WHERE facility_id = $2
        RETURNING *;
      `;
      const values = [data.totalCnt, facilityId];
      const { rows } = await client.query(query, values);

      await client.query("COMMIT");
      if (rows.length === 0) {
        throw new Error("Stamp ruleset not found/not updated");
      }
      return rows[0];
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async createStampReward(facilityId, data) {
    let client;
    try {
      client = await db.connect();
      await client.query("BEGIN");

      const query = `
        INSERT INTO stamp_reward (facility_id, cnt, name)
        VALUES ($1, $2, $3)
        RETURNING *;
      `;
      const values = [facilityId, data.cnt, data.name];
      const { rows } = await client.query(query, values);

      await client.query("COMMIT");
      return rows[0];
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async updateStampReward(facilityId, rewardId, data) {
    let client;
    try {
      client = await db.connect();
      await client.query("BEGIN");

      const query = `
        UPDATE stamp_reward
        SET cnt = $1, name = $2, updated_at = NOW()
        WHERE facility_id = $3 AND id = $4
        RETURNING *;
      `;
      const values = [data.cnt, data.name, facilityId, rewardId];
      const { rows } = await client.query(query, values);

      await client.query("COMMIT");
      if (rows.length === 0) {
        throw new Error("Stamp reward not found or not updated");
      }
      return rows[0];
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async deleteStampReward(facilityId, rewardId) {
    let client;
    try {
      client = await db.connect();
      await client.query("BEGIN");

      const deleteQuery = `
        DELETE FROM stamp_reward
        WHERE facility_id = $1 AND id = $2
        RETURNING *;
      `;
      const values = [facilityId, rewardId];
      const { rows } = await client.query(deleteQuery, values);

      await client.query("COMMIT");
      return rows; // Return the deleted rows or an empty array if none
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async getPreferencesByFacilityId(facilityId) {
    let client;
    try {
      client = await db.connect();
      const query = `
        SELECT p.* FROM preference p
        JOIN facility_preference fp ON p.id = fp.preference_id
        WHERE fp.facility_id = $1;
      `;
      const values = [facilityId];
      const { rows } = await client.query(query, values);
      return rows;
    } finally {
      client?.release();
    }
  }

  async addPreferenceToFacility(facilityId, preferenceId) {
    let client;
    try {
      client = await db.connect();
      const query = `
        INSERT INTO facility_preference (facility_id, preference_id)
        VALUES ($1, $2)
        RETURNING *;
      `;
      const values = [facilityId, preferenceId];
      const { rows } = await client.query(query, values);
      return rows[0];
    } finally {
      client?.release();
    }
  }

  async deletePreferenceFromFacility(facilityId, preferenceId) {
    let client;
    try {
      client = await db.connect();
      await client.query("BEGIN");

      const deleteQuery = `
        DELETE FROM facility_preference
        WHERE facility_id = $1 AND preference_id = $2
        RETURNING *;
      `;
      const { rows } = await client.query(deleteQuery, [
        facilityId,
        preferenceId,
      ]);

      await client.query("COMMIT");
      return rows; // Return the deleted rows or an empty array if none
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = new FacilityService();
