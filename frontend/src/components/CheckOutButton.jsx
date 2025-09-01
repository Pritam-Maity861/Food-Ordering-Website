import React from 'react'
import {loadstripe} from '@stripe/stripe-js';

const stripePromise = loadstripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckOutButton = () => {
  return (
    <div>
      
    </div>
  )
}

export default CheckOutButton
