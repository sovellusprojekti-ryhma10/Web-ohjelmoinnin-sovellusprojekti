import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import "./SpecificList.css";

function SpecificList() {
  const { listId } = useParams();
  const [listContent, setListContent] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchListContent = async () => {
      try {
        if (user && user.token) {
          const response = await fetch(
            `http://localhost:3001/api/favorite-lists/${listId}`,
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            }
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          console.log("Raw data from API:", data);
          // Assuming the API returns an array of objects and we're interested in the first one
          if (data.length > 0 && data[0].list_content) {
            console.log("list_content before parsing:", data[0].list_content);
            // Directly use list_content as an array of objects
            setListContent(data[0].list_content);
          } else {
            console.error("list_content is undefined or the array is empty");
          }
        }
      } catch (error) {
        console.error("Error fetching list content:", error);
      }
    };

    fetchListContent();
  }, [listId, user]);

  if (!listContent) {
    return <div>Loading...</div>;
  }

  return (
    <div className="specific-list-container">
      <h2>List Content</h2>
      <ul>
        {listContent.map((item, index) => (
          <li key={index}>{item.movie_name}</li>
        ))}
      </ul>
    </div>
  );
}

export default SpecificList;
