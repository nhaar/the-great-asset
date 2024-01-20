import React, { useState } from 'react'

export default function OvertimeCalculator (): JSX.Element {
  const [currentMoney, setCurrentMoney] = useState<string>('0')
  const [currentQuota, setCurrentQuota] = useState<number>(130)
  const [desiredValueToReach, setDesiredValueToReach] = useState<number>(500)
  const [daysRemaining, setDaysRemaining] = useState<string>('0')

  function updateCurrentQuota (event: React.ChangeEvent<HTMLInputElement>): void {
    setCurrentQuota(Number(event.target.value))
  }

  function updateDesiredValueToReach (event: React.ChangeEvent<HTMLInputElement>): void {
    setDesiredValueToReach(Number(event.target.value))
  }

  function updateDaysRemaining (event: React.ChangeEvent<HTMLInputElement>): void {
    setDaysRemaining(event.target.value)
  }

  function updateCurrentMoney (event: React.ChangeEvent<HTMLInputElement>): void {
    setCurrentMoney(event.target.value)
  }

  function getAmountToSell (): number {
    return Math.ceil(5 / 6 * ((desiredValueToReach - Number(currentMoney)) + currentQuota / 5 - 15 * (Number(daysRemaining) - 1)))
  }

  return (
    <div>
      <div>
        This calculator will calculate the total value of scrap that you need to sell in order to have the desired amount of money after receiving the overtime bonus.
      </div>
      <div>
        <div>
          The amount of money that you already have
        </div>
        <input onChange={updateCurrentMoney} type='number' value={currentMoney} />
      </div>
      <div>
        <div>
          Current profit quota to meet
        </div>
        <input onChange={updateCurrentQuota} type='number' value={currentQuota} />
      </div>
      <div>
        <div>
          Desired value to have after receiving the overtime bonus
        </div>
        <input onChange={updateDesiredValueToReach} type='number' value={desiredValueToReach} />
      </div>
      <div>
        <div>
          Days remaining (as it says in the ship, that is 0 if it is the last day)
        </div>
        <input onChange={updateDaysRemaining} type='number' value={daysRemaining} />
      </div>
      <div>
        The value of scrap that you need to sell is {getAmountToSell()}.
      </div>
    </div>
  )
}
