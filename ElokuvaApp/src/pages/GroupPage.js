import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './GroupPage.css'; 

const GroupPage = () => {
  const { groupId } = useParams();
  const [groupInfo, setGroupInfo] = useState(null);
  const [description, setDescription] = useState('');
  const accountId = 5;

  useEffect(() => {
    const fetchGroupInfo = async () => {
      try {
        const response = await fetch(`http://localhost:3001/group/${groupId}?accountId=${accountId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch group information');
        }
        const data = await response.json();
        console.log(data);
        setGroupInfo(data);
      } catch (error) {
        console.error('Error fetching group information:', error);
      }
    };

    fetchGroupInfo();
  }, [groupId]);

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleDescriptionSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:3001/group/${groupId}/description`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description, accountId, groupId }),
      });
      if (!response.ok) {
        throw new Error('Failed to save description');
      }

      setGroupInfo(prevGroupInfo => ({
        ...prevGroupInfo,
        groupData: [{ content: description }],
      }));

      setDescription('');
    } catch (error) {
      console.error('Error saving description:', error);
    }
  };

  const handleRemoveFromGroup = async (memberName, request) => {
    try {
      const response = await fetch(`http://localhost:3001/group/${groupId}/remove/person`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ groupId, accountId, memberName }),
      });
      if (!response.ok) {
        throw new Error('Failed to update member status');
      }
      console.log(`Marking ${memberName} as removed from the group`);
    } catch (error) {
      console.error('Error updating member status:', error);
    }
  };
  const handleAddToGroup = async (request) => {
    try {
      const response = await fetch(`http://localhost:3001/group/${groupId}/make/member`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ groupId, accountId, request }),
      });
      if (!response.ok) {
        throw new Error('Failed to update user to group');
      }
      console.log(`Marking ${request} as member`);
    } catch (error) {
      console.error('Error updating member status:', error);
    }
  };

  const handleGiveAdmin = async (memberName) => {
    try {
      const response = await fetch(`http://localhost:3001/group/${groupId}/make/admin`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ groupId, accountId, memberName }),
      });
      if (!response.ok) {
        throw new Error('Failed to update member to admin');
      }
      console.log(`Marking ${memberName} as admin`);
    } catch (error) {
      console.error('Error updating admin status:', error);
    }
  };


  if (!groupInfo) {
    return <div>Loading...</div>;
  }

  const { groupName, createdBy, groupData, groupMembers, isAdmin, groupAdmins, requestToJoin } = groupInfo;
  const content = groupData.length > 0 ? groupData[0].content : "No content available";
  console.log(groupName, createdBy, groupData);

  return (
    <div className="group-page-container">
      <h2>Group Information</h2>
      <p>Ryhmän nimi: {groupName}</p>
      <p>Ryhmän luoja: {createdBy}</p>
      <p>Ryhmän kuvaus: {content}</p>
      
      {requestToJoin.map((request, index) => (
  <div key={index}>
    <span>{request}</span>

    {isAdmin && (
      <>
        <button onClick={() => handleAddToGroup(request)}>Hyväksy pyyntö</button>
        <button onClick={() => handleRemoveFromGroup(request)}>Hylkää pyyntö</button>
      </>
    )}

  </div> 
  ))}
      {isAdmin && (
            <>
      <p>Pyytää liittymään ryhmään:</p>
      </>
          )}

      <p>Ryhmä Jäsenet:</p>
      {groupMembers.map((member, index) => (
  <div key={index}>
    <span>{member}</span>
    {isAdmin && (
      <>
        <button onClick={() => handleRemoveFromGroup(member)}>poista ryhmästä</button>
          <button onClick={() => handleGiveAdmin(member)}>anna admin</button>
          </>
          )}

  </div> 
))}
      {groupAdmins.map((admin, index) => (
  <div key={index}>
    <span>{admin}</span>

    {isAdmin && (
      <>
        <button onClick={() => handleRemoveFromGroup(admin)}>poista ryhmästä</button>
        <button onClick={() => handleGiveAdmin(admin)}>poista admin</button>
      </>
    )}
  </div> 
))}
      <div className="description">
      {isAdmin && (
            <>
      <textarea
        defaultValue={content} 
        onChange={handleDescriptionChange}
        placeholder="Type description here..."
      />
      <button onClick={handleDescriptionSubmit}>Submit Description</button>
      </>
          )}
          </div>
    </div>
  );
};

export default GroupPage;
