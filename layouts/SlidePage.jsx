import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { createGlobalStyle } from "styled-components";
import Slide from "../components/Slide";
import PresentationMode from "../components/PresentationMode";
import Swipeable from "../components/Swipeable";
import useEventListener from "../hooks/useEventListener";
import { useTotalPages } from "../context/TotalPagesContext";
import { useMode } from "../context/ModeContext";
import { useCurrentSlide } from "../context/CurrentSlideContext";
import { Storage } from "../hooks/useStorage";
import { MODES } from "../constants/modes";
import Header from "../components/Header";

const GlobalStyle = createGlobalStyle`
  :root {
    --bg: #FFFFFF;
    --meta: #888;
    --accent: #41B883;
    --text: #213547;
    --base: 1.5rem;
    --code: 1rem;
    --heading-font-family: "Poppins";
    --heading-font-weight: 800;
  }

  @media (max-width: 600px) {
    :root {
      --base: 1.2rem;
    }
  }

  * {
    box-sizing: border-box;
  }

  body,
  html {
    font-family: "Roboto", -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial,
      sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
    font-size: var(--base);
    -webkit-font-smoothing: antialiased;
    font-feature-settings: 'calt', 'liga', 'hist', 'onum', 'pnum';

    overflow: auto;

    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;

    color: var(--text);
    background-color: var(--bg);
  }

  #slide {
    display: flex;
    overflow: hidden;
    justify-content: center;
    align-items: center;

    width: 100vw;
    height: 100vh;
    padding: 1rem;

    text-align: center;

    -webkit-overflow-scrolling: touch;
  }

  #slide ul,
  #slide ol {
      text-align: left;
      margin-left: 32px;
  }

  #slide ol {
    list-style: none;
    counter-reset: slide-ol-counter;
  }

  #slide ol li {
    counter-increment: slide-ol-counter;
    margin-bottom:0.5em;
  }

  #slide ol li::before {
    content: "0" counter(slide-ol-counter) ".";
    font-weight: bold;
    font-size: 2rem;
    margin-right: 0.5rem;
    letter-spacing:1px;
    font-family: var(--heading-font-family);
    line-height: 1;
    position:relative;
    top:0.1em;
}

  a {
    color: var(--text);

    text-decoration-skip-ink: auto;
  }

  blockquote {
    font-size: 120%;
    font-weight: bold;

    width: 50vw;

    text-align: left;
  }

  @media (max-width: 900px) {
    blockquote {
      width: 90vw;
    }
  }

  blockquote div::before {
    content: '\\201C';
  }

  blockquote div::after {
    content: '\\201D';
  }

  cite {
    font-size: 80%;
    font-weight: normal;
    font-style: normal;

    display: block;

    margin-top: 2rem;
  }

  cite::before {
    content: '\\2014\\00a0';
  }

  pre {
    font-size: 0.75em !important;

    display: inline-block;
    overflow-x: scroll;

    margin: 2rem 0;

    text-align: left;

    color: var(--accent);
  }

  code {
    font-family: menlo, monospace;
  }

  a:hover {
    color: var(--accent);
  }

  header {
    font-size: 50%;

    position: fixed;
    top: 0;
    left: 0;

    display: flex;
    justify-content: space-between;
    align-items: center;

    width: 100%;
    padding: 20px;

    user-select: none;
  }

  header a,
  time {
    text-decoration: none;

    color: var(--meta);
  }

  h1 {
    font-size: 10vh;
  }

  h2 {
    text-transform: uppercase;
  }

  li strong {
    font-weight: bolder;
    color: var(--accent);
  }
`;

export default function SlidePage({ children, next, metas }) {
  const {
    currentSlide,
    setSlide,
    steps,
    currentStep,
    setCurrentStep,
    clearSteps,
  } = useCurrentSlide();
  const router = useRouter();
  const totalPages = useTotalPages();
  const { mode, setMode } = useMode();

  const NEXT = [13, 32, 39];
  const PREV = 37;
  const PRESENTER = 80;
  let slideCount = 0;

  const navigate = ({ keyCode, altKey }) => {
    // Handle Presentation Mode shortcut
    if (altKey) {
      if (keyCode === PRESENTER) {
        if (mode === MODES.SPEAKER) {
          setMode(MODES.SLIDESHOW);
          router.push(
            router.pathname,
            `${router.pathname}?mode=${MODES.SLIDESHOW}#${currentSlide}`,
            { shallow: true }
          );
        } else {
          setMode(MODES.SPEAKER);
          router.push(
            router.pathname,
            `${router.pathname}?mode=${MODES.SPEAKER}#${currentSlide}`,
            { shallow: true }
          );
        }
        return false;
      }
    }

    // Handle Previous page
    if (keyCode === PREV && currentSlide === 0) {
      if (router.query && router.pathname) {
        if (router.pathname > 1) {
          router.push(`${parseInt(router.pathname, 10) - 1}?mode=${mode}#999`);
        }
      }
      return false;
    }

    // Handle next page
    if (NEXT.indexOf(keyCode) !== -1 && currentSlide === slideCount) {
      if (router.query && router.pathname && next) {
        router.push(`${next}?mode=${mode}`);
      }
      return false;
    }

    // Handle slide changes
    if (NEXT.indexOf(keyCode) !== -1) {
      // Do we have Steps inside the slide? Navigate those first
      if (steps.length > 0 && currentStep < steps.length - 1)
        return setCurrentStep((prevStep) => prevStep + 1);

      // Otherwise go to next slide
      setSlide((prevState) => {
        return prevState + 1;
      });
      clearSteps();
    } else if (keyCode === PREV) {
      // Do we have Steps inside the slide? Navigate those first
      if (steps.length > 0 && currentStep !== 0)
        return setCurrentStep((prevStep) => prevStep - 1);

      // Otherwise go to prev slide
      setSlide((prevState) => {
        // router.push(
        //   `${router.pathname}`,
        //   `${router.pathname}?mode=${mode}#${prevState - 1}`
        // );
        return prevState - 1;
      });
      clearSteps();
    }
  };

  useEffect(() => {
    router.push(
      `${router.pathname}`,
      `${router.pathname}?mode=${mode}#${currentSlide}`
    );
  }, [currentSlide, mode, router.pathname]);

  useEventListener("keydown", navigate);

  const swipeLeft = () => {
    navigate({ keyCode: NEXT[0] });
  };

  const swipeRight = () => {
    navigate({ keyCode: PREV });
  };

  const slideNotes = () => {
    let generatorCount = 0;
    let generatedNotes = [];
    // Filter down children by only Slides
    React.Children.map(children, (child) => {
      // Check for <hr> element to separate slides
      const childType = child && child.props && (child.props.mdxType || []);
      if (childType && childType.includes("hr")) {
        generatorCount += 1;
        return;
      }
      // Check if it's a SpeakerNotes component
      if (childType && childType.includes("SpeakerNotes")) {
        if (!Array.isArray(generatedNotes[generatorCount])) {
          generatedNotes[generatorCount] = [];
        }
        generatedNotes[generatorCount].push(child);
      }
    });
    return generatedNotes;
  };

  const renderSlide = () => {
    let generatedSlides = [];
    let generatorCount = 0;

    // Filter down children by only Slides
    React.Children.map(children, (child) => {
      // Check for <hr> element to separate slides
      const childType = child && child.props && (child.props.mdxType || []);
      if (childType && childType.includes("hr")) {
        generatorCount += 1;
        return;
      }

      // Check if it's a SpeakerNotes component
      if (childType && !childType.includes("SpeakerNotes")) {
        // Add slide content to current generated slide
        if (!Array.isArray(generatedSlides[generatorCount])) {
          generatedSlides[generatorCount] = [];
        }
        generatedSlides[generatorCount].push(child);
      }
    });

    // Get total slide count
    slideCount = generatorCount;

    // Return current slide
    if (currentSlide === 999) {
      router.push(
        router.pathname,
        `${router.pathname}?mode=${mode}#${slideCount}`,
        { shallow: true }
      );
      setSlide(slideCount);
    }
    return <Slide>{generatedSlides[currentSlide]}</Slide>;
  };

  return (
    <Swipeable onSwipedLeft={swipeLeft} onSwipedRight={swipeRight}>
      <Header {...metas} />
      <GlobalStyle />
      <Storage />
      <PresentationMode
        mode={mode}
        notes={slideNotes()}
        currentSlide={currentSlide}
      >
        <div id="slide" style={{ width: "100%" }}>
          {renderSlide()}
        </div>
      </PresentationMode>
      <div style={{ position: "fixed", right: "50px", bottom: "30px" }}>
        {currentSlide} / beaucoup
      </div>
    </Swipeable>
  );
}
