import { makeObservable, observable, action } from 'mobx';

class {{name}}ViewModel {
  @observable value = '{{name}}';

  constructor() {
    makeObservable(this);
  };

  @action
  onValueChange = (v: string) => {
    this.value = v;
  };
}

export default {{name}}ViewModel;
