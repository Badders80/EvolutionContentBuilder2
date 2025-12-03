import React from "react";
import { AppProvider } from "./context/AppContext";
import { MainLayout } from "./components/layout/MainLayout";
import { ErrorBoundary } from "./components/ErrorBoundary";


const App: React.FC = () => {
  return (
    <AppProvider>
      <ErrorBoundary>
        <div>
          <div style={{position: 'fixed', top: 0, left: 0, zIndex: 9999, background: 'red', color: 'white', padding: '2px 8px', fontWeight: 'bold', fontSize: 14}}>
            DEBUG 123
          </div>
          <MainLayout />
        </div>
      </ErrorBoundary>
    </AppProvider>
  );
};

export default App;
