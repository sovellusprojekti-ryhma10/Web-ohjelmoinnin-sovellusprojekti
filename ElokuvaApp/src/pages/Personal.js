import React from "react";
import "./Personal.css";
//import { UserContext } from "../context/UserContext";

export default function Personal() {
  /*  const { user } = useContext(UserContext);

  if (!user) {
    navigointi loginiin
  }
 */

  // const latestFavoriteLists = [];
  // const lastJoinedGroups = [];
  return (
    <div>
      <h1>Tervetuloa, {/*user.username*/}</h1>
      <div className="container">
        <div>
          <h2>Suosikkilistat</h2>
          {/* {latestFavoriteLists.map((list, index) => (
            <p key={index}>{list.name}</p>
          ))} */}
        </div>
        <div>
          <h2>Ryhmät</h2>
          {/* {lastJoinedGroups.map((group, index) => (
            <p key={index}>{group.name}</p>
          ))} */}
        </div>
      </div>
    </div>
  );
}
