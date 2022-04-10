import React from "react";

const TOCElements1 = [
  "Les composants",
  "Playground",
  "Embed et non embed",
  "Le SFC et sa syntaxe",
  "Créer sa première application",
  "Et hop c'est reparti",
];

const TOCElements2 = [
  "Révisions",
  "Rendu conditionnel",
  "Réactivité calculée",
  "Watchers",
  "Lifecycle",
  "Références",
  "Slots",
  "Requêtes API",
  "Projet",
];

const sets = [TOCElements1, TOCElements2];

export const TOC = ({ i, set }) => {
  const elements = sets[set].map((t, j) =>
    j === i ? (
      <li>
        <strong>{t}</strong>
      </li>
    ) : (
      <li>{t}</li>
    )
  );

  return <ol>{elements}</ol>;
};

export default TOC;
