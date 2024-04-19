import React, { useState, useEffect } from "react";
import axios from "axios";
import { xml2js } from "xml-js";

function ShowTimes() {
  const [showtimes, setShowtimes] = useState([]);
  const [theatre, setTheatre] = useState('');
  const [date, setDate] = useState('');

  const theatres = [
    { id: 1014, name: "Pääkaupunkiseutu" },
    { id: 1012, name: "Espoo" },
    { id: 1039, name: "Espoo: OMENA" },
    { id: 1038, name: "Espoo: SELLO" },
    { id: 1002, name: "Helsinki" },
    { id: 1045, name: "Helsinki: ITIS" },
    { id: 1031, name: "Helsinki: KINOPALATSI" },
    { id: 1032, name: "Helsinki: MAXIM" },
    { id: 1033, name: "Helsinki: TENNISPALATSI" },
    { id: 1013, name: "Vantaa: FLAMINGO" },
    { id: 1015, name: "Jyväsklyä: FANTASIA" },
    { id: 1016, name: "Kuopio: SCALA" },
    { id: 1017, name: "Lahti: KUVAPALATSI" },
    { id: 1041, name: "Lappeenranta: STRAND" },
    { id: 1018, name: "Oulu: PLAZA" },
    { id: 1019, name: "Pori: PROMENADI" },
    { id: 1021, name: "Tampere" },
    { id: 1034, name: "Tampere: CINE ATLAS" },
    { id: 1035, name: "Tampere: PLEVNA" },
    { id: 1047, name: "Turku ja Raisio" },
    { id: 1022, name: "Turku: KINOPALATSI" },
    { id: 1046, name: "Raisio: LUXE MYLLY" },
  ];

    const fetchShowtimes = async () => {
      try {
        const response = await axios.get(
            `https://www.finnkino.fi/xml/Schedule/?area=${theatre}&dt=19.04.2024`
        );
        const jsonData = xml2js(response.data, { compact: true });
        console.log("Parsed response data:", jsonData); // Log the parsed data
        if (
          jsonData &&
          jsonData.Schedule &&
          jsonData.Schedule.Shows &&
          Array.isArray(jsonData.Schedule.Shows.Show)
        ) {
          setShowtimes(jsonData.Schedule.Shows.Show); // Update showtimes state with fetched data
        } else {
          console.error("Invalid response data format:", jsonData);
        }
      } catch (error) {
        console.error("Error fetching showtimes:", error);
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

  return (
    <div>
      <h1>Showtimes</h1>
      <select
          value={theatre}
          onChange={(e) => setTheatre(e.target.value)}
        >
          <option value="">Valitse teatteri tai alue</option>
          {theatres.map((theatre) => (
            <option key={theatre.id} value={theatre.id}>
              {theatre.name}
            </option>
          ))}
        </select>
        <button
          onClick={() => {
            fetchShowtimes();
          }}
        >
          Hae näytösajat
        </button>
      {Object.entries(groupedShows).map(([title, shows]) => (
        <div key={title}>
          <h2>{title}</h2>
          <ul>
            {shows.map((show) => (
              <li key={show.ID._text}>
                <p>Näytös alkaa: {new Date(show.dttmShowStart._text).toLocaleTimeString()}</p>
                <p>Näytös päättyy: {new Date(show.dttmShowEnd._text).toLocaleTimeString()}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default ShowTimes;
