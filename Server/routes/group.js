const { getGroups, addGroups, addUserGroup, getGroupsData, addGroupsContent, addGroupsAdmin, addGroupsMember, removeGroupsMember} = require('../database/groups_db');

const router = require('express').Router();



router.get('/all', async (req, res) => {
    try {
        const currentPage = req.query.currentPage;
        const perPage = req.query.perPage;
        const { groups, content } = await getGroups(perPage, currentPage);

        const responseData = groups.map(group => {
            const groupContent = content.find(item => item.group_id === group.id);
            return {
                ...group,
                content: groupContent ? groupContent.content : null 
            };
        });
        console.log(JSON.stringify(responseData) + "Tuleeko tänne Saakka tämä täällä sinä siellä");

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
router.put('/:groupId/make/member', async (req, res) => {
    const { request, accountId, groupId } = req.body;
    try {
        const adminId = accountId;
        await addGroupsMember(request, adminId, groupId);
        res.send("user is now member");
        } 
        catch (error) {
        console.error('Error making member:', error);
        res.status(500).send("Error making member");
        }

});
router.delete('/:groupId/remove/person', async (req, res) => {
    const { groupId, accountId, memberName } = req.body;
    try {
        const adminId = accountId;
        await removeGroupsMember(memberName, adminId, groupId);
        res.send("user is now removed from the group");
        } 
        catch (error) {
        console.error('Error removing member:', error);
        res.status(500).send("Error removing member");
        }

});

module.exports = router;