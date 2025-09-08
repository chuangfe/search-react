import { observer } from 'mobx-react';
import SearchPageViewModel from './viewModel';
import styles from './styles.module.scss';

function SearchPage() {
  const viewModel = SearchPageViewModel();
  return <div className={styles.container}>{viewModel.value}</div>;
}

SearchPage.displayName = 'SearchPage';

const ObserverPage = observer(SearchPage);

export default ObserverPage;
