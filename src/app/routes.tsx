import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Camera from './pages/Camera';
import Leaderboard from './pages/Leaderboard';
import RecyclingMap from './pages/RecyclingMap';
import Impact from './pages/Impact';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      {
        index: true,
        Component: Home
      },
      {
        path: 'camera',
        Component: Camera
      },
      {
        path: 'leaderboard',
        Component: Leaderboard
      },
      {
        path: 'map',
        Component: RecyclingMap
      },
      {
        path: 'impact',
        Component: Impact
      }
    ]
  }
]);
