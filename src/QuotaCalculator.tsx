import React, { useState } from 'react'
import { getNewProfitQuota } from './utils'
import InputBox from './InputBox'

export default function QuotaCalculator (): JSX.Element {
  const [timesFulfilled, setTimesFulfilled] = useState<string>('0')
  const [previousQuota, setPreviousQuota] = useState<number>(130)

  function updateTimesFulfilled (event: React.ChangeEvent<HTMLInputElement>): void {
    console.log(event.target.value)
    setTimesFulfilled(event.target.value)
  }

  function updatePreviousQuota (event: React.ChangeEvent<HTMLInputElement>): void {
    setPreviousQuota(Number(event.target.value))
  }

  function getNewProfitQuotaInCalculator (randomValue: number): number {
    return getNewProfitQuota(randomValue, Number(timesFulfilled), previousQuota)
  }

  return (
    <div>
      <h1 className='has-text-centered has-text-primary m-5'>
        This calculator will calculate the possible new profit quotas.
      </h1>
      <InputBox label='Previous profit quota' value={previousQuota.toString()} onChange={updatePreviousQuota} />
      <InputBox label='How many times the quota has been fulfilled before. Should be 0 if did not get any quota, and so forth.' value={timesFulfilled} onChange={updateTimesFulfilled} />
      <div className='box m-6 is-flex is-flex-direction-column is-justify-content-center has-text-centered has-text-primary'>
        <div>
          The smallest possible new profit quota is {getNewProfitQuotaInCalculator(-0.5)}.
        </div>
        <div>
          The average possible new profit quota is {getNewProfitQuotaInCalculator(0)}.
        </div>
        <div>
          The biggest possible new profit quota is {getNewProfitQuotaInCalculator(0.5)}.
        </div>
      </div>
    </div>
  )
}
