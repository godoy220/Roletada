import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, Router } from "wouter"; // Adicionei o Router aqui
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";

function AppRoutes() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/404" component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTA: Sobre o Tema
// - Primeiro escolha um tema padrão de acordo com seu estilo de design...

function App() {
  // Isso pega o "/Roletada/" que configuramos no vite.config.ts
  const base = import.meta.env.BASE_URL;

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          
          {/* Aqui dizemos ao roteador que a base do site é /Roletada/ */}
          <Router base={base}>
            <AppRoutes />
          </Router>

        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;