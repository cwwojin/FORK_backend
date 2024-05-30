const db = require('../models/index');
const { removeS3File } = require('../helper/s3Engine');
const { makeS3Uri } = require('../helper/helper');

class FacilityService {
    async getAllFacilities() {
        const query = 'SELECT * FROM facility_detailed ORDER BY id ASC';
        const { rows } = await db.query(query);
        return rows;
    }

    async getFacilityById(id) {
        const query = 'SELECT * FROM facility_detailed WHERE id = $1';
        const { rows } = await db.query(query, [id]);
        if (rows.length === 0)
            throw {
                status: 404,
                message: 'Facility not found',
            };
        return rows[0];
    }

    async createFacility(data) {
        let client;
        try {
            client = await db.connect();
            await client.query('BEGIN');

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
                data.profileImgUri ? data.profileImgUri : '',
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

            await client.query('COMMIT');
            return facility;
        } catch (error) {
            if (client) {
                await client.query('ROLLBACK');
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
        const deleteQuery = 'DELETE FROM opening_hours WHERE facility_id = $1';
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
        INSERT INTO menu (facility_id, name, description, price, quantity, img_uri)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
      `;
            const values = [
                facilityId,
                item.name,
                item.description,
                item.price,
                item.quantity,
                item.imgUri ? item.imgUri : '',
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
      INSERT INTO post (author_id, facility_id, title, content)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
            const values = [post.authorId, facilityId, post.title, post.content];
            const { rows } = await client.query(query, values);
            result.push(rows[0]);
        }
        return result;
    }

    async updateFacility(id, data) {
        let client;
        try {
            client = await db.connect();
            await client.query('BEGIN');

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
          UPDATE facility SET ${updateFields.join(', ')}
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

                await client.query('COMMIT');
                return facility;
            } else {
                throw {
                    status: 404,
                    message: 'No fields to update',
                };
            }
        } catch (error) {
            if (client) {
                await client.query('ROLLBACK');
            }
            throw error;
        } finally {
            if (client) {
                client.release();
            }
        }
    }

    async deleteFacility(id) {
        const { rows } = await db.query({
            text: `delete from facility where id = $1 returning *`,
            values: [id],
        });
        if (rows.length !== 0 && rows[0].profile_img_uri) {
            await removeS3File(rows[0].profile_img_uri);
        }
        return rows;
    }

    async getAddressByFacilityId(facilityId) {
        const query = 'SELECT * FROM address WHERE facility_id = $1';
        const { rows } = await db.query(query, [facilityId]);
        return rows;
    }

    async addAddress(facilityId, address) {
        let client;
        try {
            client = await db.connect();
            await client.query('BEGIN');

            const deleteQuery = 'DELETE FROM address WHERE facility_id = $1';
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

            await client.query('COMMIT');
            return rows[0];
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async deleteAddressByFacilityId(facilityId) {
        let client;
        try {
            client = await db.connect();
            await client.query('BEGIN');

            const deleteQuery = 'DELETE FROM address WHERE facility_id = $1 RETURNING *;';
            const { rows } = await client.query(deleteQuery, [facilityId]);

            await client.query('COMMIT');
            return rows; // Return the deleted rows or an empty array if none
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async getOpeningHoursByFacilityId(facilityId) {
        const query = 'SELECT * FROM opening_hours WHERE facility_id = $1';
        const { rows } = await db.query(query, [facilityId]);
        return rows;
    }

    async addOpeningHours(facilityId, openingHours) {
        let client;
        try {
            client = await db.connect();
            await client.query('BEGIN');

            const deleteQuery = 'DELETE FROM opening_hours WHERE facility_id = $1';
            await client.query(deleteQuery, [facilityId]);

            const insertQuery = `
        INSERT INTO opening_hours (facility_id, day, open_time, close_time)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `;

            const result = [];
            const hoursArray = Array.isArray(openingHours) ? openingHours : [openingHours];

            for (const hour of hoursArray) {
                const values = [facilityId, hour.day, hour.openTime, hour.closeTime];
                const { rows } = await client.query(insertQuery, values);
                result.push(rows[0]);
            }

            await client.query('COMMIT');
            return result;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async deleteOpeningHours(facilityId) {
        let client;
        try {
            client = await db.connect();
            await client.query('BEGIN');

            const deleteQuery = `
        DELETE FROM opening_hours WHERE facility_id = $1
        RETURNING *;
      `;
            const { rows } = await client.query(deleteQuery, [facilityId]);

            await client.query('COMMIT');
            return rows; // Return the deleted rows or an empty array if none
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async getMenuByFacilityId(facilityId) {
        const query = 'SELECT * FROM menu WHERE facility_id = $1';
        const { rows } = await db.query(query, [facilityId]);
        return rows;
    }

    async getMenuItemById(menuId) {
        const query = 'SELECT * FROM menu WHERE id = $1';
        const { rows } = await db.query(query, [menuId]);
        if (rows.length === 0)
            throw {
                status: 404,
                message: 'Menu item not found',
            };
        return rows[0];
    }

    async createMenu(facilityId, menuItems) {
        let client;
        try {
            client = await db.connect();
            await client.query('BEGIN');

            // Insert menu items
            const result = [];
            for (const item of menuItems) {
                const query = `
          INSERT INTO menu (facility_id, name, description, price, quantity)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *;
        `;
                const values = [facilityId, item.name, item.description, item.price, item.quantity];
                const { rows } = await client.query(query, values);
                result.push(rows[0]);
            }

            await client.query('COMMIT');
            return result;
        } catch (error) {
            if (client) {
                await client.query('ROLLBACK');
            }
            throw error;
        } finally {
            client.release();
        }
    }

    async updateMenuItem(facilityId, menuId, menuItemData) {
        let client;
        try {
            client = await db.connect();
            await client.query('BEGIN');

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
          UPDATE menu SET ${updateFields.join(', ')}
          WHERE facility_id = $${fieldIndex} AND id = $${fieldIndex + 1}
          RETURNING *;
        `;
                updateValues.push(facilityId, menuId);
                const { rows } = await client.query(query, updateValues);

                await client.query('COMMIT');
                if (rows.length === 0) {
                    throw {
                        status: 404,
                        message: 'Menu item not found or not updated',
                    };
                }
                return rows[0];
            } else {
                throw {
                    status: 404,
                    message: 'No fields to update',
                };
            }
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async deleteMenu(facilityId, menuId) {
        const { rows } = await db.query({
            text: `delete from menu where facility_id = $1 and id = $2 returning *`,
            values: [facilityId, menuId],
        });
        if (rows.length !== 0 && rows[0].img_uri) {
            await removeS3File(rows[0].img_uri);
        }
        return rows;
    }

    async getPostsByFacilityId(facilityId) {
        const query = 'SELECT * FROM post WHERE facility_id = $1 ORDER BY created_at DESC';
        const { rows } = await db.query(query, [facilityId]);
        return rows;
    }

    async getPostById(postId) {
        const query = 'SELECT * FROM post WHERE id = $1';
        const { rows } = await db.query(query, [postId]);
        if (rows.length === 0)
            throw {
                status: 404,
                message: 'Post not found',
            };
        return rows[0];
    }
    async createPost(facilityId, data, clientId) {
        let client;
        try {
            client = await db.connect();
            await client.query('BEGIN');

            const query = `
        INSERT INTO post (author_id, facility_id, title, content, img_uri)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
      `;
            const values = [
                clientId || data.authorId,
                facilityId,
                data.title,
                data.content,
                data.imgUri,
            ];

            const { rows } = await client.query(query, values);
            await client.query('COMMIT');
            return rows[0];
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async updatePost(postId, postData) {
        let client;
        try {
            client = await db.connect();
            await client.query('BEGIN');

            const query = `
        UPDATE post
        SET title = $1, content = $2, updated_at = NOW()
        WHERE id = $3
        RETURNING *;
      `;
            const values = [postData.title, postData.content, postId];
            const { rows } = await client.query(query, values);

            await client.query('COMMIT');
            if (rows.length === 0) {
                throw {
                    status: 404,
                    message: 'Post not found or not updated',
                };
            }
            return rows[0];
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async deletePost(postId) {
        const { rows } = await db.query({
            text: `delete from post where id = $1 returning *`,
            values: [postId],
        });
        if (rows.length !== 0 && rows[0].img_uri) {
            await removeS3File(rows[0].img_uri);
        }
        return rows;
    }

    async getStampRulesetRewardsByFacilityId(facilityId) {
        const query = 'SELECT * FROM stamp_ruleset_rewards WHERE facility_id = $1';
        const { rows } = await db.query(query, [facilityId]);
        if (rows.length === 0)
            throw {
                status: 404,
                message: 'Stamp ruleset not found',
            };
        return rows[0];
    }
    async createStampRuleset(facilityId, data) {
        let client;
        try {
            client = await db.connect();
            await client.query('BEGIN');

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
        INSERT INTO stamp_ruleset (facility_id, total_cnt, logo_img_uri)
        VALUES ($1, $2, $3)
        RETURNING *;
      `;
            const values = [facilityId, data.totalCnt, data.logoImgUri ? data.logoImgUri : ''];
            const { rows } = await client.query(insertQuery, values);

            if (rows.length === 0) {
                throw {
                    status: 404,
                    message: 'Stamp ruleset not created',
                };
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

            await client.query('COMMIT');
            return rows[0];
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async updateStampRuleset(facilityId, data) {
        let client;
        try {
            client = await db.connect();
            await client.query('BEGIN');

            const query = `
        UPDATE stamp_ruleset
        SET total_cnt = $1, updated_at = NOW()
        WHERE facility_id = $2
        RETURNING *;
      `;
            const values = [data.totalCnt, facilityId];
            const { rows } = await client.query(query, values);

            await client.query('COMMIT');
            if (rows.length === 0) {
                throw {
                    status: 404,
                    message: 'Stamp ruleset not found/not updated',
                };
            }
            return rows[0];
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async createStampReward(facilityId, data) {
        let client;
        try {
            client = await db.connect();
            await client.query('BEGIN');

            const query = `
        INSERT INTO stamp_reward (facility_id, cnt, name)
        VALUES ($1, $2, $3)
        RETURNING *;
      `;
            const values = [facilityId, data.cnt, data.name];
            const { rows } = await client.query(query, values);

            await client.query('COMMIT');
            return rows[0];
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async updateStampReward(facilityId, rewardId, data) {
        let client;
        try {
            client = await db.connect();
            await client.query('BEGIN');

            const query = `
        UPDATE stamp_reward
        SET cnt = $1, name = $2, updated_at = NOW()
        WHERE facility_id = $3 AND id = $4
        RETURNING *;
      `;
            const values = [data.cnt, data.name, facilityId, rewardId];
            const { rows } = await client.query(query, values);

            await client.query('COMMIT');
            if (rows.length === 0) {
                throw {
                    status: 404,
                    message: 'Stamp reward not found or not updated',
                };
            }
            return rows[0];
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async deleteStampReward(facilityId, rewardId) {
        let client;
        try {
            client = await db.connect();
            await client.query('BEGIN');

            const deleteQuery = `
        DELETE FROM stamp_reward
        WHERE facility_id = $1 AND id = $2
        RETURNING *;
      `;
            const values = [facilityId, rewardId];
            const { rows } = await client.query(deleteQuery, values);

            await client.query('COMMIT');
            return rows; // Return the deleted rows or an empty array if none
        } catch (error) {
            await client.query('ROLLBACK');
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
            client.release();
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
            client.release();
        }
    }

    async deletePreferenceFromFacility(facilityId, preferenceId) {
        let client;
        try {
            client = await db.connect();
            await client.query('BEGIN');

            const deleteQuery = `
        DELETE FROM facility_preference
        WHERE facility_id = $1 AND preference_id = $2
        RETURNING *;
      `;
            const { rows } = await client.query(deleteQuery, [facilityId, preferenceId]);

            await client.query('COMMIT');
            return rows; // Return the deleted rows or an empty array if none
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    /**
     * upload / update facility profile image
     * 1. if facility profile image already exists, delete file from S3
     * 2. update img_uri column
     * */
    async uploadFacilityProfileImage(id, imageUri) {
        const facility = await this.getFacilityById(id);
        if (facility.profile_img_uri) {
            await removeS3File(facility.profile_img_uri);
        }
        const result = await db.query({
            text: `update facility set profile_img_uri = $1 where id = $2 returning *`,
            values: [imageUri, id],
        });
        if (result.rows.length === 0)
            throw {
                status: 404,
                message: `No records were updated`,
            };
        return result.rows[0];
    }

    /** delete facility profile image */
    async deleteFacilityProfileImage(id) {
        const result = await this.uploadFacilityProfileImage(id, '');
        return result;
    }

    /** upload / update stamp logo image */
    async uploadStampLogoImage(id, imageUri) {
        const stampRuleset = await this.getStampRulesetRewardsByFacilityId(id);
        if (stampRuleset.logo_img_uri) {
            await removeS3File(stampRuleset.logo_img_uri);
        }
        const result = await db.query({
            text: `update stamp_ruleset set logo_img_uri = $1 where facility_id = $2 returning *`,
            values: [imageUri, id],
        });
        if (result.rows.length === 0)
            throw {
                status: 404,
                message: `No records were updated`,
            };
        return result.rows[0];
    }

    /** delete stamp logo image */
    async deleteStampLogoImage(id) {
        const result = await this.uploadStampLogoImage(id, '');
        return result;
    }

    /** upload / update menu item image */
    async uploadMenuImage(facilityId, menuId, imageUri) {
        const menuItem = await this.getMenuItemById(menuId);
        if (menuItem.img_uri) {
            await removeS3File(menuItem.img_uri);
        }
        const result = await db.query({
            text: `update menu set img_uri = $1 where facility_id = $2 and id = $3 returning *`,
            values: [imageUri, facilityId, menuId],
        });
        if (result.rows.length === 0)
            throw {
                status: 404,
                message: `No records were updated`,
            };
        return result.rows[0];
    }

    /** delete menu item image */
    async deleteMenuImage(facilityId, menuId) {
        const result = await this.uploadMenuImage(facilityId, menuId, '');
        return result;
    }

    /**
     * create facility registration request
     * - matching uploaded images into content -> uri fields
     * - make map { originalname : s3Uri } from files array
     * - in content, make uri fields for only matched files and put s3-uri
     * */
    async createFacilityRegistrationRequest(data, clientId, files) {
        const fileToS3UriMap = new Map();
        files.map((e) => {
            // map originalname -> s3-uri
            if (!fileToS3UriMap.has(e.originalname))
                fileToS3UriMap.set(e.originalname, makeS3Uri(e.bucket, e.key));
        });

        // set uri fields in 'content'
        const content = structuredClone(data.content);
        content.profileImgUri = fileToS3UriMap.get(content.profileImgFile);
        if (content.stampRuleset !== undefined && content.stampRuleset.logoImgFile)
            content.stampRuleset.logoImgUri = fileToS3UriMap.get(content.stampRuleset.logoImgFile);
        if (content.menu !== undefined && content.menu.length) {
            content.menu = content.menu.map((e) => {
                return {
                    ...e,
                    imgUri: fileToS3UriMap.get(e.imgFile),
                };
            });
        }

        const query = `
      INSERT INTO facility_registration_request (author_id, title, content)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
        const values = [clientId || data.authorId, data.title, JSON.stringify(content)];
        const { rows } = await db.query(query, values);
        return rows[0];
    }
    /** get facility registration request status by author ID*/
    async getFacilityRegistrationStatus(authorId) {
        const query = {
            text: `SELECT status FROM facility_registration_request WHERE author_id = $1 AND status = 1`,
            values: [authorId],
        };
        const result = await db.query(query);
        return result.rows.length > 0 ? result.rows[0].status : null;
    }

    /** get list of trending facilities
     * - (args) limit : limit result to top-K
     * - (args) preferences : filter by list of preferences
     */
    async getTrendingFacilities(args) {
        const values = [];
        let baseQuery = `select fp.* from facility_pin fp where fp.avg_score is not null `;
        if (args.preferences && args.preferences.length !== 0) {
            values.push(args.preferences);
            baseQuery = baseQuery + `and fp.preference_ids && $${values.length} `;
        }
        const { rows } = await db.query({
            text: baseQuery + `order by fp.avg_score desc limit ${args.limit} `,
            values: values,
        });
        return rows;
    }

    /** get list of newest facilities
     * - limit : limit result to top-K
     */
    async getNewestFacilities(limit) {
        const { rows } = await db.query({
            text: `select fp.* from facility_pin fp join facility f on fp.id = f.id order by f.created_at desc limit $1`,
            values: [limit],
        });
        return rows;
    }
}

module.exports = new FacilityService();
