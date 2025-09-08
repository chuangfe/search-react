import { observer } from 'mobx-react';
import {{name}}ViewModel from './viewModel';
import styles from './styles.module.scss';

function {{name}}(viewModel: {{name}}ViewModel) {
  return <div className={styles.container}>{viewModel.value}</div>;
}

{{name}}.displayName = '{{name}}';

const ObserverComponent = observer({{name}});

export default ObserverComponent;
