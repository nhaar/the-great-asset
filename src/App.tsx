import React from 'react'
import QuotaCalculator from './QuotaCalculator'

export default function App (): JSX.Element {
  const urlParams = new URLSearchParams(window.location.search)
  const page = urlParams.get('p')

  if (page == 'q') {
    return <QuotaCalculator />
  }
  return (
    <div>
      Hello Company!
    </div>
  )
}
