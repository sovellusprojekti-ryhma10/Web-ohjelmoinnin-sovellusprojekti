const pgPool = require('./pg_connection');

const sql = {
    CHECK_IF_USER_IS_IN_GROUP: 'SELECT is_admin, request_sent FROM User_Groups WHERE account_id = ($1) AND group_id = ($2)',

    //GET_ALL_GROUPS: 'SELECT group_name, created_by, id FROM Groups ORDER BY id LIMIT 20 OFFSET ($1)',
    //GET_USERNAME: 'SELECT DISTINCT accounts.id, accounts.username FROM accounts JOIN groups ON accounts.id = groups.created_by;',

    GET_ALL_GROUPS_CONTENT: 'SELECT content, group_id FROM Group_pages ORDER BY group_id LIMIT 20 OFFSET ($1)',

    ADD_GROUP: 'INSERT INTO Groups (group_name, created_by) VALUES ($1, $2) RETURNING id',


    ADD_USER_GROUP: 'INSERT INTO User_Groups (account_id, group_id, is_admin, request_sent) VALUES ($1, $2, $3, $4)',


    UPDATE_USER_MEMBER_STATUS: 'UPDATE User_Groups SET request_sent = TRUE WHERE account_id = ($1) AND group_id = ($2)',
    GET_GROUP_ID: 'SELECT id FROM Groups WHERE group_name = ($1)',
    GET_GROUP_DATA: 'SELECT content FROM Group_pages WHERE group_id = ($1)',
    GET_GROUP_INFO: 'SELECT group_name, created_by FROM Groups WHERE id = ($1)',

    GET_CREATED_BY: 'SELECT username FROM Accounts WHERE id = ($1)',
    ADD_CONTENT: 'UPDATE Group_pages SET content = $1 WHERE group_id = $2',
    ADD_GROUP_PAGES: 'INSERT INTO Group_pages (group_id) VALUES ($1)',
    CHECK_IF_USER_IS_ADMIN: 'SELECT is_admin FROM User_Groups WHERE account_id = ($1) AND group_id = ($2)',
    CHECK_IF_USER_IS_CREATEDBY: 'SELECT created_by  FROM Groups WHERE id = ($1)',
    MAKE_ADMIN: 'UPDATE User_Groups SET is_admin = TRUE WHERE account_id = ($1) AND group_id = ($2)',
    GET_USER_ID: 'SELECT id FROM Accounts WHERE username = ($1)',
    DELETE_USER_FROM_GROUP: 'DELETE FROM User_groups WHERE account_id = ($1) AND group_id = ($2)',
    REMOVE_ADMIN: 'UPDATE User_Groups SET is_admin = FALSE WHERE account_id = ($1) AND group_id = ($2)',

    REMOVE_GROUP1: 'DELETE FROM User_Groups WHERE group_id = ($1)',
    REMOVE_GROUP2: 'DELETE FROM Group_pages WHERE group_id = ($1)',
    REMOVE_GROUP3: 'DELETE FROM Groups WHERE id = ($1)',

    GET_GROUP_MEMBERS_USERNAME:'SELECT DISTINCT A.username FROM User_Groups UG JOIN Accounts A ON UG.account_id = A.id WHERE UG.group_id = ($1) AND is_admin = (false) AND request_sent = (TRUE);',
    GET_GROUPS_ADMINS:'SELECT DISTINCT A.username FROM User_Groups UG JOIN Accounts A ON UG.account_id = A.id WHERE UG.group_id = ($1) AND is_admin = (true);',
    GET_REQUEST_JOIN_USERNAME: 'SELECT DISTINCT A.username FROM User_Groups UG JOIN Accounts A ON UG.account_id = A.id WHERE UG.group_id = ($1) AND request_sent = (FALSE)',

    GET_ALL_GROUPS: 'SELECT G.group_name, G.created_by, G.id, A.username AS created_by_username FROM Groups G JOIN Accounts A ON G.created_by = A.id ORDER BY G.id LIMIT 20 OFFSET ($1)',

    GET_USERS_GROUPS: 'SELECT Groups.id AS group_id, Groups.group_name, Accounts.username AS creator_username, group_pages.content FROM Accounts INNER JOIN User_groups ON Accounts.id = User_groups.account_id INNER JOIN Groups ON User_groups.group_id = Groups.id LEFT JOIN group_pages ON Groups.id = group_pages.group_id INNER JOIN Accounts AS Creators ON Groups.created_by = Creators.id WHERE Accounts.id = ($1) AND User_groups.request_sent = True;',
    GET_USER_GROUP_NAMES: 'SELECT G.group_name FROM Groups G INNER JOIN User_groups UG ON G.id = UG.group_id WHERE UG.account_id = ($1) AND UG.request_sent = (true)',
    ADD_GROUP_PAGE_CONTENT: 'INSERT INTO group_pages_content (group_page_id, movie_id) VALUES ($1, $2)',
    CHECK_IF_USER_IS_MEMBER: 'SELECT request_sent FROM User_Groups WHERE account_id = ($1) AND group_id = ($2)',
    GET_GROUP_PAGES_ID: 'SELECT id FROM Group_pages WHERE group_id = ($1)',
    GET_GROUP_PAGES_CONTENT: 'SELECT movie_id FROM group_pages_content WHERE group_page_id = ($1)'

};

async function getGroupPageContent(accountId, groupId){
    try {
        console.log(accountId, groupId);

        const isMemberResult = await pgPool.query(sql.CHECK_IF_USER_IS_MEMBER, [accountId, groupId]);
        const isMember = isMemberResult.rows.length > 0 && isMemberResult.rows[0].request_sent;

         if(isMember){
            const group_pages_id_result = await pgPool.query(sql.GET_GROUP_PAGES_ID, [groupId]);
            const group_pages_id = group_pages_id_result.rows[0].id;

            const result = await pgPool.query(sql.GET_GROUP_PAGES_CONTENT, [group_pages_id]);
            console.log(result.rows);
            return result.rows;
         }

    } catch (error) {
        console.error('Error adding group pages content:', error);
        throw error;
    }

}

async function addGroupPageContent(accountId, movieId, group_name) {
    try {
        console.log(accountId, movieId, group_name);

        const groupNameResult = await pgPool.query(sql.GET_GROUP_ID, [group_name]);
        const group_id = groupNameResult.rows[0].id;

        const isMemberResult = await pgPool.query(sql.CHECK_IF_USER_IS_MEMBER, [accountId, group_id]);
        const isMember = isMemberResult.rows.length > 0 && isMemberResult.rows[0].request_sent;

        if(isMember){
        const group_pages_id_result = await pgPool.query(sql.GET_GROUP_PAGES_ID, [group_id]);
        const group_pages_id = group_pages_id_result.rows[0].id;
        
        console.log(group_pages_id, movieId)

        await pgPool.query(sql.ADD_GROUP_PAGE_CONTENT, [group_pages_id, movieId]);
        }
    } catch (error) {
        console.error('Error adding group pages content:', error);
        throw error;
    }

}
async function getUserGroupName(accountId) {
    try {
        console.log(accountId);
        const result = await pgPool.query(sql.GET_USER_GROUP_NAMES, [accountId]);
        console.log (result.rows);
        return {
            groups: result.rows,
        };
    } catch (error) {
        console.error('Error getting groups:', error);
        throw error;
    }

}
async function getUserGroups(accountId) {
    try {
        console.log(accountId);
        const result = await pgPool.query(sql.GET_USERS_GROUPS, [accountId]);

        return {
            groups: result.rows,
        };
    } catch (error) {
        console.error('Error getting groups:', error);
        throw error;
    }
}

async function removeGroup(accountId, groupId){
    try {
        console.log (groupId);
        const isAdmindata = await pgPool.query(sql.CHECK_IF_USER_IS_CREATEDBY, [groupId]);
        const isAdmin = isAdmindata.rows[0].created_by; 
        console.log(isAdmin + accountId + "HALOOOOOOOOOOOOOOOOOO");
        if (isAdmin == accountId) {
            await pgPool.query(sql.REMOVE_GROUP1, [groupId]);
            await pgPool.query(sql.REMOVE_GROUP2, [groupId]);
            await pgPool.query(sql.REMOVE_GROUP3, [groupId]);
        }
    } catch (error) {
        console.error('Error removing group', error);
        throw error;
    }

}

async function removeGroupsAdmin(memberName, adminId, groupId) {
    try {
        const isAdmindata = await pgPool.query(sql.CHECK_IF_USER_IS_CREATEDBY, [groupId]);
        const isAdmin = isAdmindata.rows[0].created_by; // assuming there's only one row
        console.log(isAdmin);
        if (isAdmin == adminId) {
            const accountIdData = await pgPool.query(sql.GET_USER_ID, [memberName]);
            const accountId = accountIdData.rows[0].id;
            console.log(accountId, groupId);
            if(adminId != accountId){
            await pgPool.query(sql.REMOVE_ADMIN, [accountId, groupId]);
            }
        }
    } catch (error) {
        console.error('Error demoting admin', error);
        throw error;
    }
}

async function addUserGroup(accountId, group_name) {
    try {
        console.log("Tuleeko tämä tänne testi testi");
        const result = await pgPool.query(sql.GET_GROUP_ID, [group_name]);
        const groupId = result.rows[0].id;

        const checkResult = await pgPool.query(sql.CHECK_IF_USER_IS_IN_GROUP, [accountId, groupId]);
        if (checkResult.rows.length > 0) {
            console.log('User is already in the group');
            return groupId; // Return the group ID
        }
        else {
        await pgPool.query(sql.ADD_USER_GROUP, [accountId, groupId, false, false]);
        return groupId;
    }

    } catch (error) {
        console.error('Error adding user group:', error);
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
        console.error('Error adding group:', error);
        throw error;
    }
}

async function removeGroupsMember(memberName, adminId, groupId) {
    try {
        
        const result = await pgPool.query(sql.CHECK_IF_USER_IS_ADMIN, [adminId, groupId]);
        const isAdmin = result.rows[0].is_admin
        if(isAdmin){
            const result2 = await pgPool.query(sql.GET_USER_ID, [memberName]);
            const accountId = result2.rows[0].id;
            await pgPool.query(sql.DELETE_USER_FROM_GROUP, [accountId, groupId]);
        }
    } catch (error) {
        console.error('Error removing member from the group:', error);
        throw error;
    }
}


async function getGroups(perPage, currentPage) {
    try {
        console.log(perPage, currentPage);
        const offset = (currentPage - 1) * perPage;
        const result = await pgPool.query(sql.GET_ALL_GROUPS, [offset]);
        const groupContentResult = await pgPool.query(sql.GET_ALL_GROUPS_CONTENT, [offset]);
        const groupContent = groupContentResult.rows;
        console.log("contentti:", groupContentResult.rows);

        return {
            groups: result.rows,
            content: groupContent
        };
    } catch (error) {
        console.error('Error getting groups:', error);
        throw error;
    }
}


async function addGroupsAdmin(memberName, adminId, groupId) {
    try {
        const isAdmindata = await pgPool.query(sql.CHECK_IF_USER_IS_ADMIN, [adminId, groupId]);
        const isAdmin = isAdmindata.rows[0].is_admin; // assuming there's only one row

        if (isAdmin === true) {
            const accountIdData = await pgPool.query(sql.GET_USER_ID, [memberName]);
            const accountId = accountIdData.rows[0].id;
            console.log(accountId, groupId);
            await pgPool.query(sql.MAKE_ADMIN, [accountId, groupId]);
        }
    } catch (error) {
        console.error('Error adding admin', error);
        throw error;
    }
}


async function addGroupsContent(description, accountId, groupId) {
    try {
        console.log(groupId, accountId)
        const isAdminResult = await pgPool.query(sql.CHECK_IF_USER_IS_ADMIN, [accountId, groupId]);
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
        console.error('Error adding description', error);
        throw error;
    }
}

async function getGroupsData(accountId, groupId) {
    try {
        const checkResult = await pgPool.query(sql.CHECK_IF_USER_IS_IN_GROUP, [accountId, groupId]);
        const isAdmin = checkResult.rows.some(row => row.is_admin === true);
        const hasRequestSent = checkResult.rows.some(row => row.request_sent === true);

        if (hasRequestSent || isAdmin) {
            const groupInfoResult = await pgPool.query(sql.GET_GROUP_INFO, [groupId]);
            const groupInfo = groupInfoResult.rows[0]; 

            const usernamesResult = await pgPool.query(sql.GET_GROUP_MEMBERS_USERNAME, [groupId]);
            const usernames = usernamesResult.rows.map(row => row.username);

            const adminUsernamesResult = await pgPool.query(sql.GET_GROUPS_ADMINS, [groupId]);
            const adminUsernames = adminUsernamesResult.rows.map(row => row.username);

            const requestToJoin = await pgPool.query(sql.GET_REQUEST_JOIN_USERNAME ,[groupId])
            const requestToJoinUsername = requestToJoin.rows.map(row => row.username);


            const isAdminResult = await pgPool.query(sql.CHECK_IF_USER_IS_ADMIN, [accountId, groupId]);
            const isAdmin = isAdminResult.rows.length > 0 ? isAdminResult.rows[0].is_admin : false;

            const created_by = groupInfo.created_by;

            const data = await pgPool.query(sql.GET_GROUP_DATA, [groupId]);

            const usernameResult = await pgPool.query(sql.GET_CREATED_BY, [created_by]);
            const username = usernameResult.rows[0].username;

            console.log(data.rows, groupInfo.group_name, username, usernames, adminUsernames);
            // Return the data
            return {
                isAdmin: isAdmin,
                groupData: data.rows,
                groupName: groupInfo.group_name,
                createdBy: username,
                groupMembers: usernames,
                groupAdmins: adminUsernames,
                requestToJoin: requestToJoinUsername
            };
        } else {
            console.error('User is not in the group');
            return null; 
        }
    } catch (error) {
        console.error('Error getting group data:', error);
        throw error;
    }
}





async function addGroupsMember(request, adminId, groupId){
    try {
    const isAdminResult = await pgPool.query(sql.CHECK_IF_USER_IS_ADMIN, [adminId, groupId]);
    const isAdmin = isAdminResult.rows.length > 0 ? true : false; 
    if(isAdmin){

        const accountIdData = await pgPool.query (sql.GET_USER_ID,  [request])
        const accountId = accountIdData.rows[0].id;
        await pgPool.query(sql.UPDATE_USER_MEMBER_STATUS, [accountId, groupId])
    }
        
    } catch (error) {
        console.error('Error adding user group:', error);
        throw error;
    }
}

async function addUserGroup(account_id, group_name) {
    try {
        const result = await pgPool.query(sql.GET_GROUP_ID, [group_name]);
        const groupId = result.rows[0].id;

        const checkResult = await pgPool.query(sql.CHECK_IF_USER_IS_IN_GROUP, [account_id, groupId]);
        if (checkResult.rows.length > 0) {
            console.log('User is already in the group');
            return groupId; // Return the group ID
        }

        await pgPool.query(sql.ADD_USER_GROUP, [account_id, groupId, false, false]);
        return groupId;

    } catch (error) {
        console.error('Error adding user group:', error);
        throw error;
    }
}

module.exports = {getGroupPageContent, addGroupPageContent, getUserGroupName ,getUserGroups, removeGroup, getGroups, addGroups, addUserGroup, getGroupsData, addGroupsContent, addGroupsAdmin, addGroupsMember, removeGroupsMember, removeGroupsAdmin };
