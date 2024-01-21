import React from 'react'
import QuotaCalculator from './QuotaCalculator'
import OvertimeCalculator from './OvertimeCalculator'
import CareerCalculator from './CareerCalculator'

export default function App (): JSX.Element {
  const urlParams = new URLSearchParams(window.location.search)
  const page = urlParams.get('p')

  if (page === 'q') {
    return <QuotaCalculator />
  } else if (page === 'o') {
    return <OvertimeCalculator />
  } else if (page === 'c') {
    return <CareerCalculator />
  }

  return (
    <div>
      <div>
        Welcome to The Great Asset.

      </div>
      <div>
        <a href='/the-great-asset/?p=q'>Next Profit Quota Calculator</a>
      </div>
      <div>
        <a href='/the-great-asset/?p=o'>Overtime Bonus Calculator</a>
      </div>
      <div>
        <a href='/the-great-asset/?p=c'>Career Calculator</a>
      </div>
    </div>
  )
}
