import SearchInput from "./components/SearchInput";
import Commodity from "./components/Commodity";
import AppViewModel from "./viewModels/AppViewModel";
import "./styles.css";

export default function App() {
  const vm = AppViewModel();

  return (
    <div className="App">
      <div className="search-input-container">
        <SearchInput value={vm.keyword} onChange={vm.onKeywordChange} />
      </div>

      <div className="commodities">
        {vm.commodities.map((item) => (
          <Commodity key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
