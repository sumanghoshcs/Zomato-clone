import React from 'react'

function footer() {
  return (
    <>
    <div className=' bg-slate-black space-y-px gap-x-36'>
    <div className='mt-10'>
    <img src='https://b.zmtcdn.com/web_assets/b40b97e677bc7b2ca77c58c61db266fe1603954218.png' alt='logo-image' className='h-7 w-40' />
        </div>
        <div className='flex flex-row justify-between gap-y-96 mt-10'>
            
            <div className='gap-x-96 text-slate-500'>
                <p className='text-2xl'>ABOUT ZOMATO</p>
                <p>Who We are</p>
                <p>Blog</p>
                <p>Work With Us</p>
                <p>Investor Relation</p>
                <p>Report Fraud</p>
                <p>Contact Us</p>
            </div>
            
            <div className='text-slate-500'>
                <p className='text-2xl '>ZOMAVERSE</p>
                <p>Zomato</p>
                <p>Blinkit</p>
                <p>Feeding India</p>
                <p>Hyperpure</p>
                <p>Zomaland</p>
                <p></p>
                <p></p>
            </div>
           
            <div className='text-slate-500'>
                 <p className='text-2xl '>FOR RESTAURANTS</p>
                <p>Partner With Us</p>
                <p>Apps For You</p>
            </div>
            
            <div>
                <p className='text-2xl text-slate-500'>LEARN MORE</p>
                <p>Privacy</p>
                <p>Security</p>
                <p>Terms</p>
                <p>Sitemap</p>
                <p></p>
                <p></p>
                <p></p>
            </div>
           
            <div>
                 <p className='text-2xl text-slate-500'>SOCIAL LINKS</p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
            </div>
        </div>
        </div>
        <div className='mt-10'></div>
    </>
  )
}

export default footer