import { observer } from 'mobx-react';
import type { SearchItem } from '@src/constants/data';
import styles from './styles.module.scss';

interface Props {
  item: SearchItem;
}

function SearchItemView(props: Props) {
  return <div className={styles.container}>{props.item.name}</div>;
}

SearchItemView.displayName = 'SearchItem';

const ObserverComponent = observer(SearchItemView);

export default ObserverComponent;
