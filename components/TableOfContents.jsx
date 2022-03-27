import React from "react";

const TOCElements = [
  "Les composants",
  "Playground",
  "Embed et non embed",
  "Le SFC et sa syntaxe",
  "Créer sa première application",
  "VueJS comment ça marche ?",
  "Petit exo",
];

export const TOC = ({ i }) => {
  const elements = TOCElements.map((t, j) =>
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
