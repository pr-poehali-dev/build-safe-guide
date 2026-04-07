import { useState } from "react";
import HomePage from "@/components/pages/HomePage";
import SchemaPage from "@/components/pages/SchemaPage";
import ReferencePage from "@/components/pages/ReferencePage";
import CalculatorPage from "@/components/pages/CalculatorPage";
import RecommendationsPage from "@/components/pages/RecommendationsPage";
import AuthorsPage from "@/components/pages/AuthorsPage";
import NavBar from "@/components/NavBar";

export type PageId = "home" | "schema" | "reference" | "calculator" | "recommendations" | "authors";

const Index = () => {
  const [currentPage, setCurrentPage] = useState<PageId>("home");

  const renderPage = () => {
    switch (currentPage) {
      case "home": return <HomePage onNavigate={setCurrentPage} />;
      case "schema": return <SchemaPage />;
      case "reference": return <ReferencePage />;
      case "calculator": return <CalculatorPage />;
      case "recommendations": return <RecommendationsPage />;
      case "authors": return <AuthorsPage />;
      default: return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-golos">
      <NavBar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="pt-16">
        {renderPage()}
      </main>
    </div>
  );
};

export default Index;
