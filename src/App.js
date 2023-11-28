import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './component/header/header';
import Tab from './component/tabs/tab';
import Delivery from './Delivery/delivery';
import Diningout from './Dining out/diningout';
import Nightlife from './NightLife/nightlife';
import Subfooter from './component/Footer/subfooter';
import Footer from './component/Footer/footer';
import ItemList from './component/itemlist/itemContainer';
import DefaultPage from './component/defaultpage/default';
import './App.css';

function App() {
  return (
    <div className="App mx-60 max-2xl:mx-7 max-md:mx-1 font-sans">
      <Router>
        <Header />
        <Tab />
        <Routes>
          <Route path="/" element={<Delivery />} />
          <Route path="/diningout" element={<Diningout />} />
          <Route path="/nightlife" element={<Nightlife />} />
          <Route path="/itemlist/:name/:img" element={<ItemList />} />
          <Route path="*" element={<DefaultPage />} />
        </Routes>
        <Subfooter />
        <Footer />
      </Router>
    </div>
  );
}

export default App;