import React, { useState } from 'react'
import InputBox from './InputBox'

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
      <h2 className='has-text-centered has-text-primary m-6'>
        This calculator will calculate the total value of scrap that you need to sell in order to have the desired amount of money after receiving the overtime bonus.
      </h2>
      <InputBox label='The amount of money that you already have' value={currentMoney} onChange={updateCurrentMoney} />
      <InputBox label='Current profit quota to meet' value={currentQuota.toString()} onChange={updateCurrentQuota} />
      <InputBox label='Desired value to have after receiving the overtime bonus' value={desiredValueToReach.toString()} onChange={updateDesiredValueToReach} />
      <InputBox label='Days remaining (as it says in the ship, that is 0 if it is the last day)' value={daysRemaining} onChange={updateDaysRemaining} />
      <div className='box m-6 is-flex is-flex-direction-column is-justify-content-center has-text-centered has-text-primary'>
        <div>
          The value of scrap that you need to sell is {getAmountToSell()}.
        </div>
      </div>
    </div>
  )
}
