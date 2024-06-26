const {getGroupPageContentMovieTimes, addGroupPageContentMovieTime, getGroupPageContent, addGroupPageContent, getUserGroupName ,getUserGroups, removeGroup, getGroups, addGroups, addUserGroup, getGroupsData, addGroupsContent, addGroupsAdmin, addGroupsMember, removeGroupsMember, removeGroupsAdmin} = require('../database/groups_db');
const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");




router.get('/all', async (req, res) => {
    try {
        const { accountId } = res.locals;
        console.log("tuleeko tähän")
        const currentPage = req.query.currentPage;
        const perPage = req.query.perPage;
        const { groups, content } = await getGroups(perPage, currentPage, accountId);

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


router.post('/pages/content', auth, async (req, res) => {
    const { accountId } = res.locals;
    const { movie_id, group_name } = req.body;

    try {
        console.log("tuleeko tähän")
        const movieID = await addGroupPageContent(accountId, movie_id, group_name);
        console.log(movieID);
        res.json(movieID);

    } catch (error) {
        console.error('Error adding group content:', error);
        res.status(500).json({ error: 'Failed to adding group content' });
    }
});

router.post('/pages/content/movie/times', auth, async (req, res) => {
    const { accountId } = res.locals;
    const { group_name, showStart, showTitle, theatre } = req.body;
    try {
        console.log("tuleeko tähän")
        const movieID = await addGroupPageContentMovieTime(accountId, group_name, showStart, showTitle, theatre);
        console.log(movieID);
        res.json(movieID);

    } catch (error) {
        console.error('Error adding group content:', error);
        res.status(500).json({ error: 'Failed to adding group content' });
    }
});

router.post('/get/pages/content/movie/times', auth, async (req, res) => {
    const { accountId } = res.locals;
    const { groupId } = req.body;

    try {
        console.log("halooohalooo haloohalooohalooo haloohalooohalooo haloohalooohalooo haloohalooohalooo haloohalooohalooo haloohalooohalooo haloohalooohalooo haloohalooohalooo haloohalooohalooo haloohalooohalooo haloohalooohalooo haloo")
        console.log(accountId, groupId)
        const movie_time_id = await getGroupPageContentMovieTimes(accountId, groupId);
        console.log(movie_time_id);
        res.json(movie_time_id);

    } catch (error) {
        console.error('Error getting group content:', error);
        res.status(500).json({ error: 'Failed to fetch group content' });
    }
});

router.post('/get/pages/content', auth, async (req, res) => {
    const { accountId } = res.locals;
    const { groupId } = req.body;

    try {
        console.log("halooohalooo haloohalooohalooo haloohalooohalooo haloohalooohalooo haloohalooohalooo haloohalooohalooo haloohalooohalooo haloohalooohalooo haloohalooohalooo haloohalooohalooo haloohalooohalooo haloohalooohalooo haloo")
        console.log(accountId, groupId)
        const movieID = await getGroupPageContent(accountId, groupId);
        console.log(movieID);
        res.json(movieID);

    } catch (error) {
        console.error('Error getting group content:', error);
        res.status(500).json({ error: 'Failed to fetch group content' });
    }
});



router.get('/names', auth, async (req, res) => {
    const { accountId } = res.locals;

    try {
        console.log("tuleeko tähän")
        const groups = await getUserGroupName(accountId);
        console.log("tuleeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
        console.log(groups);
        res.json(groups);

    } catch (error) {
        console.error('Error getting groups:', error);
        res.status(500).json({ error: 'Failed to fetch groups' });
    }
});

router.get('/user/all', auth, async (req, res) => {
    const { accountId } = res.locals;

    try {
        console.log("tuleeko tähän")
        const groups = await getUserGroups(accountId);
        console.log("tuleeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
        console.log(groups);
        res.json(groups);

    } catch (error) {
        console.error('Error getting groups:', error);
        res.status(500).json({ error: 'Failed to fetch groups' });
    }
});


router.post('/add', auth, async (req,res)=>{
    const { accountId } = res.locals;
    const { group_name} = req.body;
    try {
        await addGroups(group_name, accountId);
        res.send("Group added successfully");
    } catch (error) {
        console.error('Error adding group:', error);
        res.status(500).send("Error adding group");
    }
});


router.post('/join', auth, async (req,res)=>{

    const { group_name} = req.body;
    const { accountId } = res.locals;
    console.log("Tuleeko tämä tänne testi testi");
    try {
        const groupId = await addUserGroup(accountId, group_name);
        res.json(groupId);

    } catch (error) {
        console.error('Error adding group:', error);
        res.status(500).send("Error adding group");
    }
});

router.get('/:groupId', auth, async (req, res) => {
    const groupId = req.params.groupId;
    const { accountId } = res.locals;

    const data = await getGroupsData(accountId, groupId);
    console.log(JSON.stringify(data) + "Tuleeko tänne Saakka tämä täällä sinä siellä");
    res.json(data);
  

  });

  router.post('/:groupId/description', auth, async (req, res) => {
    const { accountId } = res.locals;
    const { description, groupId } = req.body;
    try {
    await addGroupsContent(description, accountId, groupId);
    res.send("description added successfully");
    } 
    catch (error) {
    console.error('Error adding group:', error);
    res.status(500).send("Error adding group");
}
  
  });

  router.put('/:groupId/make/admin', auth, async (req, res) => {
    const { memberName, groupId } = req.body;
    const { accountId } = res.locals;
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
router.delete('/:groupId/remove/group', auth, async (req, res) => {
    const { groupId } = req.body;
    const { accountId } = res.locals;
    try {
        await removeGroup(accountId, groupId);
        res.send("removed group");
        } 
        catch (error) {
        console.error('Error removing group:', error);
        res.status(500).send("Error removing group");
        }

});

router.put('/:groupId/remove/admin', auth, async (req, res) => {
    const { memberName, groupId } = req.body;
    const { accountId } = res.locals;
    try {
        await removeGroupsAdmin(memberName, accountId, groupId);
        res.send("admin has been demoted");
        } 
        catch (error) {
        console.error('Error removing admin:', error);
        res.status(500).send("Error removing admin");
        }

});
router.put('/:groupId/make/member', auth, async (req, res) => {
    const { request, groupId } = req.body;
    const { accountId } = res.locals;
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
router.delete('/:groupId/remove/person', auth, async (req, res) => {
    const { accountId } = res.locals;
    const { groupId, memberName } = req.body;
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
