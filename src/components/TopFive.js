import React from "react";

function TopFive({ films }) {
  const topFive = films.slice(0, 5);

  return React.createElement(
    "div",
    { className: "space-y-4 pl-16 overflow-x-auto" },
    React.createElement(
      "h2",
      { className: "text-3xl font-extrabold text-white px-4 tracking-wide" },
      "TOP 5 MOVIES TODAY"
    ),
    React.createElement(
      "div",
      { className: "flex gap-10 min-w-max pr-4 py-4" },
      topFive.map((film, index) =>
        React.createElement(
          "div",
          {
            key: film.id,
            className:
              "relative w-48 shrink-0 group hover:scale-105 transition-transform duration-300 pl-10",
          },
          React.createElement(
            "div",
            {
              className:
                "absolute -left-2 " +
                (index % 2 === 0 ? "top-16 z-0" : "top-0 z-20") +
                " text-[160px] font-extrabold text-white opacity-30 group-hover:opacity-50 drop-shadow-xl leading-none",
            },
            index + 1
          ),
          React.createElement("img", {
            src: film.poster,
            alt: film.title,
            className:
              "w-full h-72 object-cover rounded-xl shadow-xl border-2 border-gray-800 group-hover:border-white relative z-10",
          }),
          React.createElement(
            "div",
            { className: "mt-2 text-center text-sm text-gray-300 group-hover:text-white" },
            film.title
          )
        )
      )
    )
  );
}

export default TopFive;
