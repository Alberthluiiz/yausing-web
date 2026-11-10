// =========================================================
// App.jsx · La aplicación completa
// SesionProvider envuelve todo para saber si Mary inició sesión.
// =========================================================
import { SesionProvider } from "./context/SesionContext";
import AppRouter from "./routes/AppRouter";

export default function App() {
  return (
    <SesionProvider>
      <AppRouter />
    </SesionProvider>
  );
}
