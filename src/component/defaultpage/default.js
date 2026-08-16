import React from 'react'
import { Link } from 'react-router-dom'

function DefaultPage() {
  return (
    <div className="text-center py-16 px-4">
      <img
        src='https://b.zmtcdn.com/images/z404x2.png?output-format=webp'
        alt='default-img'
        className="mx-auto w-80 md:w-96"
      />
      <p className="mt-6 text-lg text-gray-600 max-w-lg mx-auto">
        This is a 404 page and we think it's fairly clear. You aren't going to
        find what you're looking for here. But we know you're hungry, so don't
        fret or rage. Hit that big red button to go back to our homepage.
      </p>
      <Link
        to="/"
        className="inline-block mt-8 rounded-lg bg-zomato px-10 py-3.5 text-white font-semibold hover:bg-zomato-dark transition-colors"
      >
        Take me home
      </Link>
    </div>
  )
}

export default DefaultPage
