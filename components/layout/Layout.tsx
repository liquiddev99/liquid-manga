import { useState, useEffect } from "react";
import { ArrowCircleUpIcon } from "@heroicons/react/solid";

import React from "react";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
}

function LayoutPage({ children }: LayoutProps) {
  const [showScroll, setShowScroll] = useState(false);

  const checkIfShow = () => {
    if (!showScroll && window.pageYOffset > 400) {
      setShowScroll(true);
    } else if (showScroll && window.pageYOffset < 400) {
      setShowScroll(false);
    }
  };
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  useEffect(() => {
    window.addEventListener("scroll", checkIfShow);
  }, []);

  return (
    <div className="bg-bottom">
      <Header />
      {children}
      <Footer />
      <ArrowCircleUpIcon
        className={`h-7 w-7 md:h-12 md:w-12 fixed right-4 bottom-3 cursor-pointer ${
          showScroll ? "block" : "hidden"
        }`}
        onClick={scrollToTop}
      />
    </div>
  );
}

export default LayoutPage;
