import React from "react";

export default function BackgroundEffect() {
  return (
    <>
      {/* Fundal gradient blurat animat */}
      <div
        className="fixed inset-0 z-0 pointer-events-none animate-gradient-move"
        style={{
          background: "linear-gradient(120deg, #15121d 0%, #1e2337 20%, #0e7490 60%, #7e1fe4 100%)",
          filter: "blur(2px) brightness(1.12)",
        }}
      />
      {/* Lumini bokeh blurate */}
      <div className="pointer-events-none fixed z-0 inset-0">
        <div className="absolute w-96 h-96 bg-cyan-400 opacity-20 blur-3xl rounded-full left-[-6rem] top-[-4rem]" />
        <div className="absolute w-72 h-72 bg-violet-500 opacity-10 blur-2xl rounded-full right-[-3rem] top-[60%]" />
        <div className="absolute w-40 h-40 bg-indigo-300 opacity-20 blur-2xl rounded-full left-[80%] bottom-10" />
      </div>
    </>
  );
}
