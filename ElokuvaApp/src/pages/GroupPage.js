import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './GroupPage.css'; 

const GroupPage = () => {
  const { groupId } = useParams();
  const [groupInfo, setGroupInfo] = useState(null);
  const [description, setDescription] = useState('');
  const accountId = 3;

  useEffect(() => {
    const fetchGroupInfo = async () => {
      try {
        const response = await fetch(`http://localhost:3001/group/${groupId}?accountId=${accountId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch group information');
        }
        const data = await response.json();
        console.log (data);
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

  if (!groupInfo) {
    return <div>Loading...</div>;
  }


  const { groupName, createdBy, groupData } = groupInfo;
  const content = groupData.length > 0 ? groupData[0].content : "No content available";
  console.log(groupName, createdBy, groupData);

  return (
    <div className="group-page-container">
      <h2>Group Information</h2>
      <p>Group Name: {groupName}</p>
      <p>Created By: {createdBy}</p>
      <p>Description: {content}</p>

      <textarea
    defaultValue={content} 
    onChange={handleDescriptionChange}
   placeholder="Type description here..."
  />

      <button onClick={handleDescriptionSubmit}>Submit Description</button>

    </div>
  );
};


export default GroupPage;
