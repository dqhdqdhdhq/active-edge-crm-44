
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Members from "./pages/Members";
import Guests from "./pages/Guests";
import Classes from "./pages/Classes";
import Trainers from "./pages/Trainers";
import CheckIn from "./pages/CheckIn";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Expenses from "./pages/Expenses";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipPrimitive.Provider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="members" element={<Members />} />
            <Route path="guests" element={<Guests />} />
            <Route path="classes" element={<Classes />} />
            <Route path="trainers" element={<Trainers />} />
            <Route path="check-in" element={<CheckIn />} />
            <Route path="expenses" element={<Expenses />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipPrimitive.Provider>
  </QueryClientProvider>
);

export default App;
