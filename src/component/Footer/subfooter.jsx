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
    'Bakery, Bengali, Beverages, Biryani, Burger, Chinese, Continental, Desserts, Kebab, Momos, Mughlai, North Indian, Pizza, Rolls, Sandwich, Seafood, Shake, Sichuan, South Indian, Street food...',
    'Bakeries, Bars, Beverage Shops, Bhojanalya, Cafés, Casual Dining, Clubs, Cocktail Bars, Confectioneries, Dessert Parlors, Dhabas, Fine Dining, Food Courts, Food Trucks, Kiosks, Lounges, Microbreweries, Pubs, Quick Bites, Sweet Shops...',
    'Burger King, Domino\'s, Haldiram\'s, KFC, Pizza Hut, Arsalan, WOW! Momo, Chowman...',
    'Delhi NCR, Kolkata, Mumbai, Bengaluru, Pune, Hyderabad, Chennai, Lucknow, Kochi, Jaipur, Ahmedabad, Chandigarh, Goa, Indore, Gangtok, Nashik, Ooty, Shimla, Ludhiana, Guwahati, Amritsar, Kanpur, Bhopal, Ranchi, Visakhapatnam, Bhubaneswar, Coimbatore, Mangalore, Vadodara, Nagpur, Agra, Dehradun, Mysore, Puducherry, Surat, Varanasi, Patna, Udaipur, Srinagar, Rajkot, Madurai, Vijayawada, Jodhpur, Kota, Mussoorie, Rishikesh, Jalandhar, Jammu, Manali, Dharamshala...',
  ];

  return (
    <div className="mx-4 md:mx-10 lg:mx-20 2xl:mx-44 flex flex-col gap-4 md:gap-6 mt-8">
      <p className="text-2xl md:text-3xl font-medium text-gray-900 pt-4">Explore options near me</p>
      {questions.map((question, index) => {
        const open = activeIndex === index;
        return (
          <div
            key={index}
            className="border-2 border-gray-100 rounded-lg overflow-hidden"
          >
            <button
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-base md:text-xl text-gray-800"
              onClick={() => toggleAccordion(index)}
            >
              <span>{question}</span>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                className={`h-6 w-6 shrink-0 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`}
              >
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
              </svg>
            </button>
            {open && (
              <p className="px-5 pb-5 text-sm md:text-base text-slate-500 leading-relaxed">
                {answers[index]}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default FAQComponent;
