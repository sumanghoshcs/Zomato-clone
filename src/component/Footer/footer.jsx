import React, { useState } from 'react';
import Down from '../../Images/down.png';
import Select from 'react-select';
import Country from "../../Json-file/country.json"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faYoutube, faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';

function Footer() {
  const data = Country.all_country_code
  const [showMap, setShowMap] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState('');
    
  const handleCountryClick = () => {
    setShowMap((prevState) => !prevState); // Toggle map visibility
  };

  const handleCountrySelection = (country) => {
    setSelectedCountry(country);
    setShowMap(false); // Hide the map after a selection is made
  };
  const countryOptions = data.map((item) => ({
    value: item.name,
    label: item.name,
    image : item.flagImgUrl,

  }));

  const formatOptionLabel = ({ label, image }) => (
    <div className="flex">
      <img src={image} alt="country-image" style={{ width: '30px', height: '30px', marginRight: '10px' }} />
      <span>{label}</span>
    </div>
  );
  
  return (
    <>
      <div className=' bg-slate-black space-y-px gap-x-36 bg-slate-50'>
        <div className='mt-10 p-5 flex justify-between'>
          <div>
          <img src='https://b.zmtcdn.com/web_assets/b40b97e677bc7b2ca77c58c61db266fe1603954218.png' alt='logo' className='h-7 w-40' />
          </div>
          <div className='flex gap-10'>
          <div className='flex'>
          <Select
      value={selectedCountry ? { value: selectedCountry, label: selectedCountry, src:selectedCountry } : null}
      onChange={handleCountrySelection}
      options={countryOptions}
      placeholder="Select a country"
      formatOptionLabel={formatOptionLabel}
    />
          </div>
          <div className='text-slate-500 '>
           <select className='p-2 border-2 border-text-slate-500 rounded'>
            <option>English</option>
            <option>Turkce</option>
            <option>hindi</option>
            <option>Portugues</option>
            <option>Indonesian</option>
            <option>Espanol</option>
            <option>Cestina</option>
            <option>Slovensina</option>
            <option>Polish</option>
            <option>Italian</option>
            <option>Vietnamese</option>
           </select>
          </div>
          </div>
        </div>
        {/* ... Rest of the JSX ... */}
        <div className='flex flex-row justify-between gap-y-96 '>
            
            <div className='gap-x-96 text-slate-500'>
                <p className='text-xl text-black font-semibold'>ABOUT ZOMATO</p>
                <p>Who We are</p>
                <p>Blog</p>
                <p>Work With Us</p>
                <p>Investor Relation</p>
                <p>Report Fraud</p>
                <p>Contact Us</p>
            </div>
            
            <div className='text-slate-500'>
                <p className='text-xl text-black font-semibold'>ZOMAVERSE</p>
                <p>Zomato</p>
                <p>Blinkit</p>
                <p>Feeding India</p>
                <p>Hyperpure</p>
                <p>Zomaland</p>
                <p></p>
                <p></p>
            </div>
           
            <div className='text-slate-500'>
                 <p className='text-xl text-black font-semibold'>FOR RESTAURANTS</p>
                <p>Partner With Us</p>
                <p>Apps For You</p>
                <p className='text-xl text-black font-semibold'>FOR ENTERPRISES</p>
                <p>Zomato for Enterprises</p>
            </div>
            
            <div className='text-slate-500'>
                <p className='text-xl text-black font-semibold'>LEARN MORE</p>
                <p>Privacy</p>
                <p>Security</p>
                <p>Terms</p>
                <p>Sitemap</p>
                <p></p>
                <p></p>
                <p></p>
            </div>
           
            <div className='flex flex-col'>
                 <p className='text-xl text-black font-semibold'>SOCIAL LINKS</p>
                 <div className='flex flex-row gap-2'>
                 <FontAwesomeIcon icon={faLinkedin} style={{ fontSize: '22px' }}/>
      <FontAwesomeIcon icon={faYoutube} style={{ fontSize: '22px' }}/>
      <FontAwesomeIcon icon={faFacebook} style={{ fontSize: '22px' }}/>
      <FontAwesomeIcon icon={faTwitter} style={{ fontSize: '22px' }}/>
      <FontAwesomeIcon icon={faInstagram} style={{ fontSize: '22px' }}/>
                 </div>
      
            </div>
        </div>
        </div>
        <div className='mt-10'></div>
    </>
  )
}

export default Footer;
