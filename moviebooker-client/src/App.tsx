import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { RootLayout } from "./components/layout/RootLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route index element={<div>Page d'accueil à venir</div>} />
            <Route path="movies" element={<div>Liste des films à venir</div>} />
            <Route path="profile" element={<div>Profil à venir</div>} />
            <Route path="login" element={<div>Connexion à venir</div>} />
            <Route path="register" element={<div>Inscription à venir</div>} />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
