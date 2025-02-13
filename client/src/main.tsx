import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { UserProvider } from "./contexts/UserContext.tsx";
import { BrowserRouter } from "react-router-dom";
import { CardProvider } from "./contexts/CardContext.tsx";
import { ModalProvider } from "./contexts/ModalContext.tsx";
import { TagBoxProvider } from "./contexts/TagBoxContext.tsx";
import { TagProvider } from "./contexts/TagContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        {/* User API calls */}
        <CardProvider>
          {/* Card API calls, might depend on User */}
          <TagProvider>
            {/* Tag API calls, independent but data-related */}
            <ModalProvider>
              {/* UI state, no API calls */}
              <TagBoxProvider>
                {/* UI state, no API calls */}
                <App />
              </TagBoxProvider>
            </ModalProvider>
          </TagProvider>
        </CardProvider>
      </UserProvider>
    </BrowserRouter>
  </StrictMode>
);
