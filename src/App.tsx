import { lazy, Suspense } from 'react';
import Spinner from './components/styles/Spiner';


const Home = lazy(() => import('./page/home'));

function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-svh">

      <Suspense fallback={<Spinner />}>
        <Home />
      </Suspense>
    </div>
  );
}

export default App;
