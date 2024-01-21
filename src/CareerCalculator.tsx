import { useEffect, useState } from 'react'

interface RunData {
  timeData: TimeData[]
  shipCorrection: number
}

interface TimeData {
  days: DaysData[]
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

  function getUpdateAcquiredValue (index: number): (event: React.ChangeEvent<HTMLInputElement>) => void {
    return (event: React.ChangeEvent<HTMLInputElement>): void => {
      const newAcquiredValues = [...acquiredValues]
      newAcquiredValues[index] = event.target.value
      setAcquiredValues(newAcquiredValues)
    }
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
      <div>
        <div>DAY</div>
        <div>ACQUIRED LOOT</div>
      </div>
      {days}
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

  function addQuota (): void {
    const newRunData = { ...runData }
    newRunData.timeData.push({
      days: [{
        acquired: 0
      }, {
        acquired: 0
      }, {
        acquired: 0
      }],
      scrapSold: 0
    })
    setRunData(newRunData)
  }

  useEffect(() => {
    console.log(runData.timeData.length)
    if (runData.timeData.length === 0 || runData.timeData[runData.timeData.length - 1].days.every(day => {
      return day.acquired > 0
    })) {
      addQuota()
    }
  }, [runData])

  function saveRunData (): void {
    localStorage.setItem('the-great-asset', JSON.stringify(runData))
  }

  return (
    <div>
      <div>
        {runData.timeData.map((timeData, index) => {
          return <QuotaTime key={index} data={timeData} quotaNumber={index + 1} setterFn={setRunData} />
        })}
      </div>
    </div>
  )
}