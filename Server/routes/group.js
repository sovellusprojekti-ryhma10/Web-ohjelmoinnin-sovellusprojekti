const { getGroups, addGroups, addUserGroup, getGroupsData, addGroupsContent, addGroupsAdmin} = require('../database/groups_db');

const router = require('express').Router();

router.get('/all', async (req, res) => {
    try {
        const { groups, usernames } = await getGroups();

        const responseData = groups.map(group => ({
            ...group,
            username: usernames.find(user => user.id === group.created_by)?.username || ""
        }));

        res.json(responseData);
    } catch (error) {
        console.error('Error getting groups:', error);
        res.status(500).json({ error: 'Failed to fetch groups' });
    }
});


router.post('/add', async (req,res)=>{
    const { group_name, created_by, account_id } = req.body;
    try {
        await addGroups(group_name, created_by, account_id);
        res.send("Group added successfully");
    } catch (error) {
        console.error('Error adding group:', error);
        res.status(500).send("Error adding group");
    }
});


router.post('/join', async (req,res)=>{

    const { group_name, account_id } = req.body;
    try {
        const groupId = await addUserGroup(account_id, group_name);
        res.json(groupId);

    } catch (error) {
        console.error('Error adding group:', error);
        res.status(500).send("Error adding group");
    }
});

router.get('/:groupId', async (req, res) => {
    const groupId = req.params.groupId;
    const accountId = req.query.accountId;

    const data = await getGroupsData(accountId, groupId);
    console.log(JSON.stringify(data) + "Tuleeko tänne Saakka tämä täällä sinä siellä");
    res.json(data);
  

  });

  router.post('/:groupId/description', async (req, res) => {

    const { description, accountId, groupId } = req.body;
    try {
    await addGroupsContent(description, accountId, groupId);
    res.send("description added successfully");
    } 
    catch (error) {
    console.error('Error adding group:', error);
    res.status(500).send("Error adding group");
}
  
  });

  router.put('/:groupId/make/admin', async (req, res) => {
    const { memberName, accountId, groupId } = req.body;
    try {
        const adminId = accountId;
        await addGroupsAdmin(memberName, adminId, groupId);
        res.send("member is now admin");
        } 
        catch (error) {
        console.error('Error making admin:', error);
        res.status(500).send("Error making admin");
        }

});

module.exports = router;