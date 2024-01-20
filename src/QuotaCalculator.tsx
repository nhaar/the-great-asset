import React, { useState } from 'react'

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

  function getNewProfitQuota (randomValue: number): number {
    // the result is truncated in the end in-game
    const times: number = Number(timesFulfilled)
    return Math.floor(previousQuota + 100 * (1 + Math.pow(times, 2) / 16) * (randomValue + 1))
  }

  return (
    <div>
      <div>
        This calculator will calculate the possible new profit quotas.
      </div>
      <div>
        <div>
          Previous profit quota
        </div>
        <input onChange={updatePreviousQuota} type='number' value={previousQuota} />
      </div>
      <div>
        <div>
          How many times the quota has been fulfilled before.
        </div>
        <input onChange={updateTimesFulfilled} type='number' value={timesFulfilled} />
      </div>
      <div>
        The smallest possible new profit quota is {getNewProfitQuota(-0.5)}.
      </div>
      <div>
        The average possible new profit quota is {getNewProfitQuota(0)}.
      </div>
      <div>
        The biggest possible new profit quota is {getNewProfitQuota(0.5)}.
      </div>
    </div>
  )
}
