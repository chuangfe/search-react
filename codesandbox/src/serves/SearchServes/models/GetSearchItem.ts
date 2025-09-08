export interface GetSearchItemProps {
  id: string;
  name: string;
}

export default class GetSearchItem {
  id: string;
  name: string;

  constructor({ id, name }: GetSearchItemProps) {
    this.id = id;
    this.name = name;
  }
}
