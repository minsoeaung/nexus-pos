import {RouterProvider} from 'react-router-dom';
import {router} from './pages/router.tsx';
import {QueryClient, QueryClientProvider} from 'react-query';
import {ReactQueryDevtools} from 'react-query/devtools';
import {ConfigProvider} from 'antd';
import {AuthContextProvider} from './context/AuthContext.tsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 60 * 1000 * 5, // 5 minutes
      retry: 0,
    },
    mutations: {
      retry: 0,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        theme={{
          token: {
            fontFamily: "IBM Plex Sans",
            borderRadius: 4,
          },
        }}
      >
        <AuthContextProvider>
          <RouterProvider router={router}/>
        </AuthContextProvider>
      </ConfigProvider>
      <ReactQueryDevtools initialIsOpen={false}/>
    </QueryClientProvider>
  );
}

export default App;
