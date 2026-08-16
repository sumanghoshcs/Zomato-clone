import React, { useState } from 'react';
import Select from 'react-select';
import Country from "../../Json-file/country.json"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faYoutube, faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';

function Footer() {
  const data = Country.all_country_code
  const [selectedCountry, setSelectedCountry] = useState(null);

  const handleCountrySelection = (country) => {
    setSelectedCountry(country);
  };

  const countryOptions = data.map((item) => ({
    value: item.name,
    label: item.name,
    image: item.flagImgUrl,
  }));

  const formatOptionLabel = ({ label, image }) => (
    <div className="flex items-center">
      <img src={image} alt={label} style={{ width: '22px', height: '22px', marginRight: '10px', borderRadius: '2px', objectFit: 'cover' }} />
      <span>{label}</span>
    </div>
  );

  const columns = [
    {
      title: "ABOUT ZOMATO",
      links: ["Who We are", "Blog", "Work With Us", "Investor Relation", "Report Fraud", "Contact Us"],
    },
    {
      title: "ZOMAVERSE",
      links: ["Zomato", "Blinkit", "Feeding India", "Hyperpure", "Zomaland"],
    },
    {
      title: "FOR RESTAURANTS",
      links: ["Partner With Us", "Apps For You"],
      secondTitle: "FOR ENTERPRISES",
      secondLinks: ["Zomato for Enterprises"],
    },
    {
      title: "LEARN MORE",
      links: ["Privacy", "Security", "Terms", "Sitemap"],
    },
  ];

  return (
    <div className="bg-slate-50 mt-12 px-4 md:px-10 lg:px-20 2xl:px-44 py-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <img src='https://b.zmtcdn.com/web_assets/b40b97e677bc7b2ca77c58c61db266fe1603954218.png' alt='logo' className='h-7 w-40' />
        <div className='flex flex-wrap gap-4'>
          <div className="min-w-44">
            <Select
              value={selectedCountry}
              onChange={handleCountrySelection}
              options={countryOptions}
              placeholder="India ▼"
              formatOptionLabel={formatOptionLabel}
              isSearchable
            />
          </div>
          <select className='p-2 border-2 border-gray-200 rounded min-w-32 text-sm' defaultValue="English">
            <option>English</option>
            <option>Turkce</option>
            <option>Hindi</option>
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

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mt-10">
        {columns.map((col) => (
          <div key={col.title} className="text-slate-500 text-sm">
            <p className="text-base text-black font-semibold mb-3">{col.title}</p>
            {col.links.map((link) => (
              <p key={link} className="py-1 hover:text-black cursor-pointer transition-colors">{link}</p>
            ))}
            {col.secondTitle && (
              <>
                <p className="text-base text-black font-semibold mb-3 mt-6">{col.secondTitle}</p>
                {col.secondLinks.map((link) => (
                  <p key={link} className="py-1 hover:text-black cursor-pointer transition-colors">{link}</p>
                ))}
              </>
            )}
          </div>
        ))}

        <div>
          <p className="text-base text-black font-semibold mb-3">SOCIAL LINKS</p>
          <div className='flex gap-3'>
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 hover:bg-black hover:text-white transition-colors cursor-pointer">
              <FontAwesomeIcon icon={faLinkedin} />
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 hover:bg-black hover:text-white transition-colors cursor-pointer">
              <FontAwesomeIcon icon={faInstagram} />
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 hover:bg-black hover:text-white transition-colors cursor-pointer">
              <FontAwesomeIcon icon={faTwitter} />
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 hover:bg-black hover:text-white transition-colors cursor-pointer">
              <FontAwesomeIcon icon={faYoutube} />
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 hover:bg-black hover:text-white transition-colors cursor-pointer">
              <FontAwesomeIcon icon={faFacebook} />
            </span>
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-gray-200 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
        <p>By continuing past this page, you agree to our Terms of Service, Cookie Policy, Privacy Policy and Content Policies.</p>
        <p>© 2026 Zomato Clone | For educational purposes only</p>
      </div>
    </div>
  )
}

export default Footer
