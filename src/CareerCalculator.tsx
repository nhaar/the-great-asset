import { useEffect, useState } from 'react'

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

  const days = [0, 1, 2].map((dayIndex) => {
    const dayData = data.days[dayIndex]
    return (
      <div key={dayIndex}>
        <div>{dayIndex + 1}</div>
        <input type='text' value={acquiredValues[dayIndex]} onChange={getUpdateAcquiredValue(dayIndex)} />
        <div>{dayData.acquired}</div>
      </div>
    )
  })

  return (
    <div>
      <div>
        QUOTA {quotaNumber}
      </div>
      <input type='text' value={profitQuota} onChange={updateProfitQuota} />
      <div>
        <div>DAY</div>
        <div>ACQUIRED LOOT</div>
      </div>
      {days}
      <div>
        <div>SCRAP SOLD</div>
        <input type='text' value={scrapSold} onChange={updateScrapSold} />
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

  useEffect(() => {
    if (runData.timeData.length === 0) {
      addQuota(130)
    }
    console.log(runData.timeData)
    if (runData.timeData[runData.timeData.length - 1].scrapSold <= 0) {
      setNextQuotaDiv((
        <div>
          Waiting to sell scrap...
        </div>
      ))
    } else if (getShipTotal() > 0) {
      setNextQuotaDiv((
        <div>
          You have enough to meet the next profit quota!
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
    if (newTotal === null || newTotal.match(/^\d+$/) === null) {
      window.alert('Invalid value')
      return
    }
    const newRunData = { ...runData }
    newRunData.shipCorrection = Number(newTotal) - getShipTotal()
    setRunData(newRunData)
  }

  return (
    <div>
      <div>
        {runData.timeData.map((timeData, index) => {
          return <QuotaTime key={index} data={timeData} quotaNumber={index + 1} setterFn={setRunData} />
        })}
      </div>
      {nextQuotaDiv}
      <div>
        <div>
          SHIP TOTAL
        </div>
        <div>
          {getShipTotal()}
        </div>
        <div>
          Ship total not right? Click the button to fix it.
        </div>
        <button onClick={fixShipTotal}>
          FIX SHIP TOTAL
        </button>
      </div>
    </div>
  )
}
