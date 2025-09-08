import React from 'react';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { configure } from 'mobx';
import ReactDOM from 'react-dom/client';
import 'dayjs/locale/zh-tw';

dayjs.extend(duration);
dayjs.locale('zh-tw');

configure({
  enforceActions: 'always'
});

import './reset.css';
import 'normalize.css';
import PagesRoot from '@src/pages';

/**
 * Strict Mode always calls your rendering function twice. (development only)
 *
 * @link https://react.dev/reference/react/StrictMode
 */
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PagesRoot />
  </React.StrictMode>
);

// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <PagesRoot />
// )
