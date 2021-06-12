import React from "react";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
}

function LayoutPage({ children }: LayoutProps) {
  return (
    <div className="bg-bottom">
      <Header />
      {children}
      <Footer />
    </div>
  );
}

export default LayoutPage;
