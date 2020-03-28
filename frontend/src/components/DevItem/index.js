import React from "react";
import "./styles.css";

export default function DevItem({ dev }) {
  return (
    <li className="dev-item">
      <header>
        <img src={dev.avatar_url} alt={`Avatar ${dev.name}`} />
        <div className="user-info">
          <strong>{dev.name}</strong>
          <span>{dev.techs.join(", ")}</span>
        </div>
      </header>
      <div className="user-body">
        <p>{dev.bio}</p>
        <a href={`https://github.com/${dev.github_username}`}>
          Acessar perfil no github
        </a>
      </div>
    </li>
  );
}
