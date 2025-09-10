import { Input } from 'antd';
import { observer } from 'mobx-react';
import SearchPageViewModel from './viewModel';
import styles from './styles.module.scss';

function SearchPage() {
  const viewModel = SearchPageViewModel();

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h1>Search</h1>
      </div>

      <div className={styles.search}>
        <Input.Search
          className={styles.input}
          size="large"
          value={viewModel.keyword}
          onChange={viewModel.onKeywordChange}
        />
      </div>
    </div>
  );
}

SearchPage.displayName = 'SearchPage';

const ObserverPage = observer(SearchPage);

export default ObserverPage;
