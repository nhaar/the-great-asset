import React from 'react'
import QuotaCalculator from './QuotaCalculator'
import OvertimeCalculator from './OvertimeCalculator'

export default function App (): JSX.Element {
  const urlParams = new URLSearchParams(window.location.search)
  const page = urlParams.get('p')

  if (page === 'q') {
    return <QuotaCalculator />
  } else if (page === 'o') {
    return <OvertimeCalculator />
  }
  return (
    <div>
      Hello Company!
    </div>
  )
}
