import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SearchPage from './Search';

const PagesRoot = () => {
  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route element={<SearchPage />} path="*" />
      </Routes>
    </BrowserRouter>
  );
};

export default PagesRoot;
