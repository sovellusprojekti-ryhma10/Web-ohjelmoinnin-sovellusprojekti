import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function PublicListPage() {
  const { id } = useParams(); // Get the list ID from the URL
  const [listContent, setListContent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListContent = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/public-favorite-lists/${id}/content`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        // Assuming the response is JSON, use response.json()
        const data = await response.json();
        setListContent(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching list content:", error);
        setLoading(false);
      }
    };

    fetchListContent();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Public List Content</h2>
      {listContent.map((movie, index) => (
        <div key={index}>
          <h3>{movie.movie_name}</h3>
          <img src={movie.movie_image} alt={movie.movie_name} />
          <p>{movie.movie_description}</p>
        </div>
      ))}
    </div>
  );
}

export default PublicListPage;
