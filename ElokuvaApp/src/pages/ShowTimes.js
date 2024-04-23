import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { xml2js } from "xml-js";
import "../index.css";
import "./ShowTimes.css";
import { UserContext } from "../context/UserContext";

function ShowTimes() {
  const [showtimes, setShowtimes] = useState([]);
  const [theatre, setTheatre] = useState("");
  const [date, setDate] = useState("");
  const [groupLists, setGroupLists] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [openDropdown, setOpenDropdown] = useState(null);
  const { user } = useContext(UserContext);
  const [lastFetchParams, setLastFetchParams] = useState({
    theatre: "",
    date: "",
  });


  const theatres = [
    { id: 1039, name: "Espoo: OMENA" },
    { id: 1038, name: "Espoo: SELLO" },
    { id: 1045, name: "Helsinki: ITIS" },
    { id: 1031, name: "Helsinki: KINOPALATSI" },
    { id: 1032, name: "Helsinki: MAXIM" },
    { id: 1033, name: "Helsinki: TENNISPALATSI" },
    { id: 1013, name: "Vantaa: FLAMINGO" },
    { id: 1015, name: "Jyväskylä: FANTASIA" },
    { id: 1016, name: "Kuopio: SCALA" },
    { id: 1017, name: "Lahti: KUVAPALATSI" },
    { id: 1041, name: "Lappeenranta: STRAND" },
    { id: 1018, name: "Oulu: PLAZA" },
    { id: 1019, name: "Pori: PROMENADI" },
    { id: 1034, name: "Tampere: CINE ATLAS" },
    { id: 1035, name: "Tampere: PLEVNA" },
    { id: 1022, name: "Turku: KINOPALATSI" },
    { id: 1046, name: "Raisio: LUXE MYLLY" },
  ];

  const fetchShowtimes = async () => {
    try {
      // Format date string to match required format: DD.MM.YYYY
      const formattedDate = new Date(date)
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
        .replace(/\//g, ".");

      let url = `https://www.finnkino.fi/xml/Schedule/?area=${theatre}&dt=${formattedDate}`;

      const response = await axios.get(url);
      const jsonData = xml2js(response.data, { compact: true });
      console.log("Parsed response data:", jsonData);
      console.log(date);
      console.log(url);
      if (
        jsonData &&
        jsonData.Schedule &&
        jsonData.Schedule.Shows &&
        Array.isArray(jsonData.Schedule.Shows.Show)
      ) {
        setShowtimes(jsonData.Schedule.Shows.Show);
        setLastFetchParams({ theatre, date });
      } else {
        console.error("Invalid response data format:", jsonData);
      }
    } catch (error) {
      console.error("Error fetching showtimes:", error);
    }
  };


  useEffect(() => {
    const fetchGroupLists = async () => {
      try {
        if (user && user.token) {
          const response = await fetch(
            "http://localhost:3001/group/names",
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
              },
            }
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          console.log(data.groups); // Check the structure of data
          setGroupLists(data.groups); // Set the correct property
        }
      } catch (error) {
        console.error("Error fetching favorite lists:", error);
      }
    };
    fetchGroupLists();
  }, [user]);

  const handleFetchShowtimes = () => {
    if (theatre !== lastFetchParams.theatre || date !== lastFetchParams.date) {
      fetchShowtimes();
    }
  };

  // Group shows by title
  const groupedShows = {};
  showtimes.forEach((show) => {
    const title = show.Title._text;
    if (!groupedShows[title]) {
      groupedShows[title] = [];
    }
    groupedShows[title].push(show);
  });

  const handleAddToGroup = async (selectedGroup, showStart, showTitle) => {
    try {
      const selectedTheater = theatres.find(theater => theater.id === parseInt(theatre));
      const theaterName = selectedTheater.name;
      console.log(selectedGroup, showStart, showTitle, theaterName);
      const response = await fetch(`http://localhost:3001/group/pages/content/movie/times`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({ group_name: selectedGroup, showStart: showStart, showTitle: showTitle, theatre: theaterName })
      });
      if (!response.ok) {
        throw new Error('Failed to adding content to group pages');
      }

    } catch (error) {
      console.error('Error adding content to group pages:', error);
    }
  };

  return (
    <div className="showtimes">
      <h1>Näytösajat</h1>
      <select value={theatre} onChange={(e) => setTheatre(e.target.value)}>
        <option value="">Valitse teatteri</option>
        {theatres.map((theatre) => (
          <option key={theatre.id} value={theatre.id}>
            {theatre.name}
          </option>
        ))}
      </select>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <button onClick={handleFetchShowtimes}>Hae näytösajat</button>
      <div className="shows">
        {showtimes.map((show) => (
          <div key={show.ID._text}>
            <h2>{show.Title._text}</h2>
            <ul>
              <li>
                <p>
                  Näytös alkaa:{" "}
                  {new Date(show.dttmShowStart._text).toLocaleTimeString()}
                </p>
                <p>
                  Näytös päättyy:{" "}
                  {new Date(show.dttmShowEnd._text).toLocaleTimeString()}
                  {user && (
                    <button onClick={() => setOpenDropdown(show.ID._text)}>
                      Lisää näytös ryhmään
                    </button>
                  )}
                  {openDropdown === show.ID._text && (
                    <div className="dropdown-content">
                      <select
                        value={selectedGroup}
                        onChange={(e) => setSelectedGroup(e.target.value)}
                      >
                        <option value="">Valitse ryhmä</option>
                        {groupLists.map((group) => (
                          <option key={group.group_id} value={group.group_name}>
                            {group.group_name}
                          </option>
                        ))}
                      </select>
                      <button onClick={() => handleAddToGroup(selectedGroup, show.dttmShowStart._text, show.Title._text)}>
                        Lisää ryhmään
                      </button>
                    </div>
                  )}
                </p>
              </li>
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ShowTimes;