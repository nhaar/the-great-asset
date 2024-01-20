import React from 'react'
import QuotaCalculator from './QuotaCalculator'

export default function App (): JSX.Element {
  const match: RegExpMatchArray = window.location.pathname.match(/\/the-great-asset\/(.*)/) as RegExpMatchArray
  

  const path: string = match[1]
  if (path == 'quota') {
    return <QuotaCalculator />
  }
  return (
    <div>
      Hello Company!
    </div>
  )
}
