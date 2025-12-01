import React from "react";
import { AppProvider } from "./context/AppContext";
import { MainLayout } from "./components/layout/MainLayout";
import { ErrorBoundary } from "./components/ErrorBoundary";

const App: React.FC = () => {
  return (
    <AppProvider>
      <ErrorBoundary>
        <MainLayout />
      </ErrorBoundary>
    </AppProvider>
  );
};

export default App;
