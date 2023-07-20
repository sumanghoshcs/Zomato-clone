import { useState } from 'react';

const FAQComponent = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const questions = [
    'Popular cuisines near me',
    'Popular restaurant types near me',
    'Top Restaurant Chains',
    'Cities We Deliver To',
  ];

  const answers = [
    'Bakery food near meBengali food near meBeverages food near meBiryani food near meBurger food near meChinese food near meContinental food near meDesserts food near meKebab food near meMomos food near meMughlai food near meNorth Indian food near mePizza food near meRolls food near meSandwich food near meSeafood food near meShake food near meSichuan food near meSouth Indian food near meStreet food near m',
    'Bakeries near meBars near meBeverage Shops near meBhojanalya near meCafés near meCasual Dining near meClubs near meCocktail Bars near meConfectioneries near meDessert Parlors near meDhabas near meFine Dining near meFood Courts near meFood Trucks near meKiosks near meLounges near meMicrobreweries near mePaan Shop near mePubs near meQuick Bites near meSweet Shops near me',
    'Burger KingBurger SinghDomino sHaldiram sKFC',
    'Delhi NCRKolkata MumbaiBengaluru PuneHyderabad Chennai Lucknow Kochi Jaipur Ahmedabad Chandigarh Goa Indore Gangtok NashikOoty Shimla Ludhiana Guwahati Amritsar Kanpur Allahabad Aurangabad Bhopal Ranchi Visakhapatnam Bhubaneswar Coimbatore Mangalore Vadodara Nagpur Agra Dehradun Mysore Puducherry Surat Varanasi Patna Udaipur Srinagar Khajuraho Neemrana Cuttack Trivandrum Haridwar LehPushkar Rajkot Madurai Kozhikode Alappuzha Thrissur Manipal Vijayawada Jodhpur KotaAjmer Mussoorie Rishikesh Jalandhar Jammu Manali Dharamshala',
  ];

  return (
    <div className='justify-between flex flex-col gap-8'>
      <p className='text-3xl font-medium pt-6 mt-5'>Explore options near me</p>
      {questions.map((question, index) => (
        <div
          key={index}
          className={`border-2 border-gray-100 p-5 text-xl font-sm ${
            activeIndex === index ? 'h-auto' : 'h-14'
          }`}
        >
          <div className='flex items-center justify-between'>
            <p className=''>{question}</p>
            <button
              className='ml-2 focus:outline-none'
              onClick={() => toggleAccordion(index)}
            >
              {activeIndex === index ? (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  className='h-6 w-6'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M19 9l-7 7-7-7'
                  />
                </svg>
              ) : (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  className='h-6 w-6'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 5l7 7-7 7'
                  />
                </svg>
              )}
            </button>
          </div>
          {activeIndex === index && (
            <p className='border-gray-100 mt-2 '>{answers[index]}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default FAQComponent;
