import "./App.css";
import { AppRoutes } from "./routes";
import { AppProvider } from "./provider/AppProvider";

function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}

export default App;
