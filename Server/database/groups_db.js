const pgPool = require("./pg_connection");

const sql = {
  CHECK_IF_USER_IS_IN_GROUP:
    "SELECT is_admin, request_sent FROM User_Groups WHERE account_id = ($1) AND group_id = ($2)",

  GET_ALL_GROUPS:
    "SELECT G.group_name, G.created_by, G.id, A.username AS created_by_username FROM Groups G JOIN Accounts A ON G.created_by = A.id ORDER BY G.id LIMIT 20 OFFSET ($1)",
  //GET_ALL_GROUPS: 'SELECT group_name, created_by, id FROM Groups ORDER BY id LIMIT 20 OFFSET ($1)',
  //GET_USERNAME: 'SELECT DISTINCT accounts.id, accounts.username FROM accounts JOIN groups ON accounts.id = groups.created_by;',

  GET_ALL_GROUPS_CONTENT:
    "SELECT content, group_id FROM Group_pages ORDER BY group_id LIMIT 20 OFFSET ($1)",

  ADD_GROUP:
    "INSERT INTO Groups (group_name, created_by) VALUES ($1, $2) RETURNING id",

  ADD_USER_GROUP:
    "INSERT INTO User_Groups (account_id, group_id, is_admin, request_sent) VALUES ($1, $2, $3, $4)",

  UPDATE_USER_MEMBER_STATUS:
    "UPDATE User_Groups SET request_sent = TRUE WHERE account_id = ($1) AND group_id = ($2)",
  GET_GROUP_ID: "SELECT id FROM Groups WHERE group_name = ($1)",
  GET_GROUP_DATA: "SELECT content FROM Group_pages WHERE group_id = ($1)",
  GET_GROUP_INFO: "SELECT group_name, created_by FROM Groups WHERE id = ($1)",

  GET_GROUP_MEMBERS_USERNAME:
    "SELECT DISTINCT A.username FROM User_Groups UG JOIN Accounts A ON UG.account_id = A.id WHERE UG.group_id = ($1) AND is_admin = (false) AND request_sent = (TRUE);",
  GET_GROUPS_ADMINS:
    "SELECT DISTINCT A.username FROM User_Groups UG JOIN Accounts A ON UG.account_id = A.id WHERE UG.group_id = ($1) AND is_admin = (true);",
  GET_REQUEST_JOIN_USERNAME:
    "SELECT DISTINCT A.username FROM User_Groups UG JOIN Accounts A ON UG.account_id = A.id WHERE UG.group_id = ($1) AND request_sent = (FALSE)",

  GET_CREATED_BY: "SELECT username FROM Accounts WHERE id = ($1)",

  ADD_CONTENT: "UPDATE Group_pages SET content = $1 WHERE group_id = $2",
  ADD_GROUP_PAGES: "INSERT INTO Group_pages (group_id) VALUES ($1)",

  CHECK_IF_USER_IS_ADMIN:
    "SELECT is_admin FROM User_Groups WHERE account_id = ($1) AND group_id = ($2)",
  MAKE_ADMIN:
    "UPDATE User_Groups SET is_admin = TRUE WHERE account_id = ($1) AND group_id = ($2)",

  GET_USER_ID: "SELECT id FROM Accounts WHERE username = ($1)",

  DELETE_USER_FROM_GROUP:
    "DELETE FROM User_groups WHERE account_id = ($1) AND group_id = ($2)",
};

async function addUserGroup(accountId, group_name) {
  try {
    console.log("Tuleeko tämä tänne testi testi");
    const result = await pgPool.query(sql.GET_GROUP_ID, [group_name]);
    const groupId = result.rows[0].id;

    const checkResult = await pgPool.query(sql.CHECK_IF_USER_IS_IN_GROUP, [
      account_id,
      groupId,
    ]);
    if (checkResult.rows.length > 0) {
      console.log("User is already in the group");
      return groupId; // Return the group ID
    }

    await pgPool.query(sql.ADD_USER_GROUP, [accountId, groupId, false, false]);
    return groupId;
  } catch (error) {
    console.error("Error adding user group:", error);
    throw error;
  }
}

async function addGroups(group_name, account_id) {
  try {
    const result = await pgPool.query(sql.ADD_GROUP, [group_name, account_id]);
    const groupId = result.rows[0].id; // Get the ID of the newly inserted group
    await pgPool.query(sql.ADD_USER_GROUP, [account_id, groupId, true, true]);
    await pgPool.query(sql.ADD_GROUP_PAGES, [groupId]);
  } catch (error) {
    console.error("Error adding group:", error);
    throw error;
  }
}

async function removeGroupsMember(memberName, adminId, groupId) {
  try {
    const result = await pgPool.query(sql.CHECK_IF_USER_IS_ADMIN, [
      adminId,
      groupId,
    ]);
    const isAdmin = result.rows[0].is_admin;
    if (isAdmin) {
      const result2 = await pgPool.query(sql.GET_USER_ID, [memberName]);
      const accountId = result2.rows[0].id;
      await pgPool.query(sql.DELETE_USER_FROM_GROUP, [accountId, groupId]);
    }
  } catch (error) {
    console.error("Error removing member from the group:", error);
    throw error;
  }
}

async function getGroups(perPage, currentPage) {
  try {
    console.log(perPage, currentPage);
    const offset = (currentPage - 1) * perPage;
    const result = await pgPool.query(sql.GET_ALL_GROUPS, [offset]);
    const groupContentResult = await pgPool.query(sql.GET_ALL_GROUPS_CONTENT, [
      offset,
    ]);
    const groupContent = groupContentResult.rows;
    console.log("contentti:", groupContentResult.rows);

    return {
      groups: result.rows,
      content: groupContent,
    };
  } catch (error) {
    console.error("Error getting groups:", error);
    throw error;
  }
}

async function addGroupsAdmin(memberName, adminId, groupId) {
  try {
    const isAdmindata = await pgPool.query(sql.CHECK_IF_USER_IS_ADMIN, [
      adminId,
      groupId,
    ]);
    const isAdmin = isAdmindata.rows[0].is_admin; // assuming there's only one row

    if (isAdmin === true) {
      const accountIdData = await pgPool.query(sql.GET_USER_ID, [memberName]);
      const accountId = accountIdData.rows[0].id;
      console.log(accountId, groupId);
      await pgPool.query(sql.MAKE_ADMIN, [accountId, groupId]);
    }
  } catch (error) {
    console.error("Error adding admin", error);
    throw error;
  }
}

async function addGroupsContent(description, accountId, groupId) {
  try {
    console.log(groupId, accountId);
    const isAdminResult = await pgPool.query(sql.CHECK_IF_USER_IS_ADMIN, [
      accountId,
      groupId,
    ]);
    const isAdmin = isAdminResult.rows.length > 0 ? true : false; // Check if rows exist to determine if user is admin
    console.log(isAdmin);
    if (isAdmin) {
      await pgPool.query(sql.ADD_CONTENT, [description, groupId]);
      return isAdmin;
    } else {
      console.log("User is not admin");
      return isAdmin;
    }
  } catch (error) {
    console.error("Error adding description", error);
    throw error;
  }
}

async function getGroupsData(accountId, groupId) {
  try {
    const checkResult = await pgPool.query(sql.CHECK_IF_USER_IS_IN_GROUP, [
      accountId,
      groupId,
    ]);
    const isAdmin = checkResult.rows.some((row) => row.is_admin === true);
    const hasRequestSent = checkResult.rows.some(
      (row) => row.request_sent === true
    );

    if (hasRequestSent || isAdmin) {
      const groupInfoResult = await pgPool.query(sql.GET_GROUP_INFO, [groupId]);
      const groupInfo = groupInfoResult.rows[0];

      const usernamesResult = await pgPool.query(
        sql.GET_GROUP_MEMBERS_USERNAME,
        [groupId]
      );
      const usernames = usernamesResult.rows.map((row) => row.username);

      const adminUsernamesResult = await pgPool.query(sql.GET_GROUPS_ADMINS, [
        groupId,
      ]);
      const adminUsernames = adminUsernamesResult.rows.map(
        (row) => row.username
      );

      const requestToJoin = await pgPool.query(sql.GET_REQUEST_JOIN_USERNAME, [
        groupId,
      ]);
      const requestToJoinUsername = requestToJoin.rows.map(
        (row) => row.username
      );

      const isAdminResult = await pgPool.query(sql.CHECK_IF_USER_IS_ADMIN, [
        accountId,
        groupId,
      ]);
      const isAdmin =
        isAdminResult.rows.length > 0 ? isAdminResult.rows[0].is_admin : false;

      const created_by = groupInfo.created_by;

      const data = await pgPool.query(sql.GET_GROUP_DATA, [groupId]);

      const usernameResult = await pgPool.query(sql.GET_CREATED_BY, [
        created_by,
      ]);
      const username = usernameResult.rows[0].username;

      console.log(
        data.rows,
        groupInfo.group_name,
        username,
        usernames,
        adminUsernames
      );
      // Return the data
      return {
        isAdmin: isAdmin,
        groupData: data.rows,
        groupName: groupInfo.group_name,
        createdBy: username,
        groupMembers: usernames,
        groupAdmins: adminUsernames,
        requestToJoin: requestToJoinUsername,
      };
    } else {
      console.error("User is not in the group");
      return null;
    }
  } catch (error) {
    console.error("Error getting group data:", error);
    throw error;
  }
}

async function addGroupsMember(request, adminId, groupId) {
  try {
    const isAdminResult = await pgPool.query(sql.CHECK_IF_USER_IS_ADMIN, [
      adminId,
      groupId,
    ]);
    const isAdmin = isAdminResult.rows.length > 0 ? true : false;
    if (isAdmin) {
      const accountIdData = await pgPool.query(sql.GET_USER_ID, [request]);
      const accountId = accountIdData.rows[0].id;
      await pgPool.query(sql.UPDATE_USER_MEMBER_STATUS, [accountId, groupId]);
    }
  } catch (error) {
    console.error("Error adding user group:", error);
    throw error;
  }
}

async function addUserGroup(account_id, group_name) {
  try {
    const result = await pgPool.query(sql.GET_GROUP_ID, [group_name]);
    const groupId = result.rows[0].id;

    const checkResult = await pgPool.query(sql.CHECK_IF_USER_IS_IN_GROUP, [
      account_id,
      groupId,
    ]);
    if (checkResult.rows.length > 0) {
      console.log("User is already in the group");
      return groupId; // Return the group ID
    }

    await pgPool.query(sql.ADD_USER_GROUP, [account_id, groupId, false, false]);
    return groupId;
  } catch (error) {
    console.error("Error adding user group:", error);
    throw error;
  }
}

module.exports = {
  getGroups,
  addGroups,
  addUserGroup,
  getGroupsData,
  addGroupsContent,
  addGroupsAdmin,
  addGroupsMember,
  removeGroupsMember,
};
