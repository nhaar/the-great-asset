import { useEffect, useState } from 'react'
import { getNewProfitQuota, isValidNumberInput } from './utils'

interface RunData {
  timeData: TimeData[]
  shipCorrection: number
}

interface TimeData {
  days: DaysData[]
  currentQuota: number
  scrapSold: number
}

interface DaysData {
  acquired: number
}

function isDaysData (obj: any): obj is DaysData {
  if (obj === undefined || obj === null) {
    return false
  }
  if (obj.acquired === undefined) {
    return false
  } else if (typeof obj.acquired !== 'number') {
    return false
  }
  return true
}

function isTimeData (obj: any): obj is TimeData {
  if (obj === undefined || obj === null) {
    return false
  }
  if (obj.days === undefined) {
    return false
  } else if (!Array.isArray(obj.quotas)) {
    return false
  } else if (obj.quotas.every(isDaysData) === false) {
    return false
  }
  if (obj.scrapSold === undefined) {
    return false
  } else if (typeof obj.scrapSold !== 'number') {
    return false
  }
  if (obj.currentQuota === undefined) {
    return false
  } else if (typeof obj.currentQuota !== 'number') {
    return false
  }
  return true
}

function isRunData (obj: any): obj is RunData {
  if (obj === undefined || obj === null) {
    return false
  }
  if (obj.timeData === undefined) {
    return false
  } else if (!Array.isArray(obj.timeData)) {
    return false
  } else if (obj.timeData.every(isTimeData) === false) {
    return false
  }
  if (obj.shipCorrection === undefined) {
    return false
  } else if (typeof obj.shipCorrection !== 'number') {
    return false
  }
  return true
}

function QuotaTime ({ data, quotaNumber, setterFn }: { data: TimeData, quotaNumber: number, setterFn: (prev: any) => any }): JSX.Element {
  const [acquiredValues, setAcquiredValues] = useState<string[]>(['0', '0', '0'])
  const [profitQuota, setProfitQuota] = useState<string>(String(data.currentQuota))
  const [scrapSold, setScrapSold] = useState<string>(String(data.scrapSold))

  useEffect(() => {
    setterFn((prev: any) => {
      const newRunData = { ...prev }
      newRunData.timeData[quotaNumber - 1].days = acquiredValues.map((value) => {
        return {
          acquired: Number(value)
        }
      })
      return newRunData
    })
  }, [acquiredValues])

  useEffect(() => {
    setterFn((prev: any) => {
      const newRunData = { ...prev }
      newRunData.timeData[quotaNumber - 1].currentQuota = Number(profitQuota)
      return newRunData
    })
  }, [profitQuota])

  useEffect(() => {
    setterFn((prev: any) => {
      const newRunData = { ...prev }
      newRunData.timeData[quotaNumber - 1].scrapSold = Number(scrapSold)
      return newRunData
    })
  }, [scrapSold])

  function getUpdateAcquiredValue (index: number): (event: React.ChangeEvent<HTMLInputElement>) => void {
    return (event: React.ChangeEvent<HTMLInputElement>): void => {
      const newAcquiredValues = [...acquiredValues]
      newAcquiredValues[index] = event.target.value
      setAcquiredValues(newAcquiredValues)
    }
  }

  function updateProfitQuota (event: React.ChangeEvent<HTMLInputElement>): void {
    setProfitQuota(event.target.value)
  }

  function updateScrapSold (event: React.ChangeEvent<HTMLInputElement>): void {
    setScrapSold(event.target.value)
  }

  const dayComponents = []

  for (let i = 0; i < 3; i++) {
    dayComponents.push((
      <div key={String(i) + '1'}>{i + 1}</div>
    ))
    dayComponents.push((
      <input className='input' key={String(i) + '2'} type='text' value={acquiredValues[i]} onChange={getUpdateAcquiredValue(i)} />
    ))
  }

  return (
    <div
      className='box has-text-primary is-flex is-flex-direction-column has-text-centered is-justify-content-center' style={{
        width: '60%'
      }}
    >
      <div>
        QUOTA {quotaNumber}
      </div>
      <div className='is-flex is-justify-content-center'>
        <input
          type='text' value={profitQuota} onChange={updateProfitQuota} className='input' style={{
            width: '100px'
          }}
        />
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr'
      }}
      >
        <div>DAY</div>
        <div>ACQUIRED LOOT</div>
        {dayComponents}
      </div>
      <div>
        <div>SCRAP SOLD</div>
        <input className='input' type='text' value={scrapSold} onChange={updateScrapSold} />
      </div>
    </div>
  )
}

export default function CareerCalculator (): JSX.Element {
  const [runData, setRunData] = useState<RunData>(() => {
    const savedData: string | null = localStorage.getItem('the-great-asset')
    const defaultData: RunData = {
      timeData: [],
      shipCorrection: 0
    }
    if (savedData === null) {
      return defaultData
    }
    const localData = JSON.parse(savedData)
    if (isRunData(localData)) {
      return localData
    } else {
      return defaultData
    }
  })

  const [nextQuotaDiv, setNextQuotaDiv] = useState<JSX.Element>(<div />)

  function getShipTotal (): number {
    let total: number = 0
    for (const timeData of runData.timeData) {
      for (const dayData of timeData.days) {
        total += dayData.acquired
      }
      total -= timeData.scrapSold
    }

    return total + runData.shipCorrection
  }

  function addQuota (profitQuota: number): void {
    const newRunData = { ...runData }
    newRunData.timeData.push({
      days: [{
        acquired: 0
      }, {
        acquired: 0
      }, {
        acquired: 0
      }],
      currentQuota: profitQuota,
      scrapSold: 0
    })
    setRunData(newRunData)
  }

  function clickAddQuotaButton (): void {
    const newQuota: string | null = window.prompt('What is the new quota?')
    if (!isValidNumberInput(newQuota)) {
      window.alert('Invalid value')
      return
    }
    addQuota(Number(newQuota))
  }

  useEffect(() => {
    if (runData.timeData.length === 0) {
      addQuota(130)
    }
    const currentTimeData: TimeData = runData.timeData[runData.timeData.length - 1]
    if (currentTimeData.scrapSold <= 0) {
      setNextQuotaDiv((
        <div>
          Waiting to sell scrap...
        </div>
      ))
    } else if (getShipTotal() >= 0 && currentTimeData.scrapSold >= currentTimeData.currentQuota) {
      setNextQuotaDiv((
        <div>
          <div>
            You have met the next profit quota!
          </div>
          <button onClick={clickAddQuotaButton}>
            CLICK TO ADD NEW QUOTA
          </button>
        </div>
      ))
    } else {
      setNextQuotaDiv((
        <div>
          <div>
            As you have not met the profit quota, your performance has been deemed below standard. Welcome to our disciplinary process.
          </div>
          <div>
            You survived up to quota {runData.timeData.length}.
          </div>
        </div>))
    }
  }, [runData])

  function saveRunData (): void {
    localStorage.setItem('the-great-asset', JSON.stringify(runData))
  }

  function fixShipTotal (): void {
    const newTotal: string | null = window.prompt('What is the ship total?')
    if (!isValidNumberInput(newTotal)) {
      window.alert('Invalid value')
      return
    }
    const newRunData = { ...runData }
    newRunData.shipCorrection = Number(newTotal) - getShipTotal()
    setRunData(newRunData)
  }

  function getNumberOfUndoneDays (): number {
    let days: number = 0
    const totalQuotas = runData.timeData.length
    if (totalQuotas === 0) {
      return 0
    }
    console.log(totalQuotas)
    const lastQuota = runData.timeData[totalQuotas - 1]

    for (let i = 2; i >= 0; i--) {
      if (lastQuota.days[i].acquired > 0) {
        break
      }
      days++
    }

    return days
  }

  function getAverageLootPerDay (): number {
    let total: number = 0
    let days: number = 0
    for (const timeData of runData.timeData) {
      for (const dayData of timeData.days) {
        total += dayData.acquired
        days++
      }
    }

    // correction to ignore days that haven't been done yet
    days -= getNumberOfUndoneDays()
    if (days === 0) {
      return 0
    }
    return (total + runData.shipCorrection) / days
  }

  const avgLootPerDay = getAverageLootPerDay()

  function getHowManyQuotasCanBeDone (randomValueThroughout: number, randomValueAtEnd: number): { timesFulfilled: number, finalQuota: number } {
    if (runData.timeData.length === 0) {
      return { timesFulfilled: 0, finalQuota: 130 }
    }
    let previousQuota: number = 0
    let currentQuota: number = runData.timeData[runData.timeData.length - 1].currentQuota
    let timesFulfilled: number = runData.timeData.length - 1
    let scrapValue = getShipTotal() + getNumberOfUndoneDays() * avgLootPerDay
    while (scrapValue >= currentQuota) {
      scrapValue += 3 * avgLootPerDay
      scrapValue -= currentQuota
      previousQuota = currentQuota
      currentQuota = getNewProfitQuota(randomValueThroughout, timesFulfilled, currentQuota)
      timesFulfilled++
    }

    const finalQuota = getNewProfitQuota(randomValueAtEnd, timesFulfilled - 1, previousQuota)
    return { timesFulfilled, finalQuota }
  }

  function FinalQuotaStat ({ randomValueThroughout, randomValueAtEnd, randomMessage }: { randomValueThroughout: number, randomValueAtEnd: number, randomMessage: string }): JSX.Element {
    const { timesFulfilled, finalQuota } = getHowManyQuotasCanBeDone(randomValueThroughout, randomValueAtEnd)
    return (
      <div>
        <div>
          {randomMessage}, you will be able to get to quota {timesFulfilled}, and your final quota will be {finalQuota}.
        </div>
      </div>
    )
  }

  return (
    <div className='has-text-primary mx-6'>
      <h2 className='ml-3 has-text-centered'>
        Career Calculator
      </h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '40% 1fr'
      }}
      >
        <div className='is-flex is-flex-direction-column'>
          <div>
            {runData.timeData.map((timeData, index) => {
              return <QuotaTime key={index} data={timeData} quotaNumber={index + 1} setterFn={setRunData} />
            })}
          </div>
          {nextQuotaDiv}
        </div>
        <div className='is-flex is-flex-direction-column'>
          <div className='mb-6'>
            <div>
              SHIP TOTAL: {getShipTotal()}
            </div>
            <div>
              Ship total not right? Click the button to fix it.
            </div>
            <button onClick={fixShipTotal}>
              FIX SHIP TOTAL
            </button>
          </div>
          <div className='mb-6'>
            <div>
              Total average loot per day: {avgLootPerDay.toFixed(2)}
            </div>
            <div>
              This value ignores days that haven't been done yet in the current quota.
            </div>
          </div>
          <div>
            <div>
              At the current pace:
            </div>
            <FinalQuotaStat randomMessage='* In the worst possible RNG' randomValueThroughout={0.5} randomValueAtEnd={-0.5} />
            <FinalQuotaStat randomMessage='* In the average RNG' randomValueThroughout={0} randomValueAtEnd={0} />
            <FinalQuotaStat randomMessage='* In the best possible RNG' randomValueThroughout={-0.5} randomValueAtEnd={0.5} />
            <div>
              This pace will be specially inaccurate if you are in the first few quotas (before enough paid moon averages are accounted and before the quota exceeds the price to go to the paid moon)
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
