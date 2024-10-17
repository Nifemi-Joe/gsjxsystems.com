import {BrowserRouter} from "react-router-dom";
import {Router} from "./router/router";
import {AuthProvider} from "./store/auth/AuthContext";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {DataProvider} from "./context/DataContext";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 10,
            cacheTime: 1000 * 60 * 15,
        },
        mutations: {
            // retry: 3,  // Optional: retry failed mutations 3 times
        },
    },
});

function App() {
  return (
      <QueryClientProvider client={queryClient}>
          <DataProvider>
              <AuthProvider>
                  <BrowserRouter>
                      <Router/>
                  </BrowserRouter>
              </AuthProvider>
          </DataProvider>
      </QueryClientProvider>
  );
}

export default App;
