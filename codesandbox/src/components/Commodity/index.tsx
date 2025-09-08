import React from "react";
import GetSearchItem from "../../Serves/SearchServes/models/GetSearchItem";
import "./styles.css";

interface Props {
  item: GetSearchItem;
}

function Commodity({ item }: Props) {
  return (
    <div className="commodity">
      <div className="commodity-name">{item.name}</div>
    </div>
  );
}

export default React.memo(Commodity);
