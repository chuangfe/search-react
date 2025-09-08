import { observer } from 'mobx-react';
import {{name}}PageViewModel from './viewModel';
import styles from './styles.module.scss';

function {{name}}Page() {
  const viewModel = {{name}}PageViewModel();
  return <div className={styles.container}>{viewModel.value}</div>;
}

{{name}}Page.displayName = '{{name}}Page';

const ObserverPage = observer({{name}}Page);

export default ObserverPage;
