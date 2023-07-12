import Header from './component/header/header';
import './App.css';
import Tab from '../src/component/tabs/tab'
import FirstOrder from './component/firstorder/firstorder';
import TopBrands from './component/topbrands/topbrands';
import Foodcard from './component/foodcard/foodcard';
import FoodList from './component/foodsList/foodList';
function App() {
  return (
    <div className="App mx-60 font-sans">
      <Header />
      <Tab/>
      <FirstOrder/>
      <TopBrands/>
      <FoodList/>
      <div className='mt-80'></div>
    </div>
  );
}

export default App;
