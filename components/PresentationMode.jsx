import React from "react";
import styled from "styled-components";
import { MODES } from "../constants/modes";

const PresentationFrame = styled.div`
  display: flex;
  padding: 3rem;
  max-height: 100vh;
  background-color: #f0f0f0;
  height: 100vh;
`;

const SlideWindow = styled.div`
  width: 65%;
  overflow-y: scroll;
  aspect-ratio: 16 / 9;

  & > div {
    padding: 1rem;
    max-height: 80vh;
  }

  #slide {
    align-items: flex-start;
    height: auto;
    aspect-ratio: 16 / 10;
    max-width: calc(60vw - 80px);
    border-radius: 2px;
    background: linear-gradient(145deg, #f8f8f8, #ffffff);
    box-shadow: 13px 13px 26px #b6b6b6, -13px -13px 26px #ffffff;
    margin: 40px;
  }
`;

const Sidebar = styled.div`
  width: 35%;

  & > div {
    padding: 1rem;
  }
`;

const SpeakerNotesWindow = styled.div`
  width: calc(100% - 80px);
  height: 60vh;
  overflow-y: scroll;
  border-radius: 10px;
  background: linear-gradient(145deg, #f8f8f8, #ffffff);
  box-shadow: 7px 7px 14px #b6b6b6, -7px -7px 14px #ffffff;
  margin: 40px;

  font-size: 26px;

  & > div {
    padding: 1rem;
  }
`;

export default function PresentationMode({
  mode,
  notes,
  currentSlide,
  children,
}) {
  if (mode === MODES.SPEAKER) {
    return (
      <PresentationFrame>
        <SlideWindow>
          <div>{children}</div>
        </SlideWindow>
        <Sidebar>
          <div>
            {/* <NextSlideFrame /> */}
            <SpeakerNotesWindow>
              <div>{notes[currentSlide]}</div>
            </SpeakerNotesWindow>
          </div>
        </Sidebar>
      </PresentationFrame>
    );
  }
  return children;
}
