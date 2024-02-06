import { useEffect, useState } from 'react'
import { getNewProfitQuota, isValidNumberInput } from './utils'

/** All run tracker data that is stored locally. Maps arbitrary names to their run data */
export interface LocalData {
  [name: string]: RunData
}

/** All data used to define a run */
export interface RunData {
  /** Data of each "quota season". */
  timeData: TimeData[]
  /** A number to correct the ship total in case needed. */
  shipCorrection: number
}

/** Data for a "quota season" */
interface TimeData {
  /** Data for each day in the season */
  days: DaysData[]
  /** Current quota to meet in this "season" */
  currentQuota: number
  /** The total scrap sold at the end */
  scrapSold: number
}

/** Information relevant to a day */
interface DaysData {
  /** The acquired amount of scrap */
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
  } else if (!Array.isArray(obj.days)) {
    return false
  } else if (obj.days.every(isDaysData) === false) {
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

/**
 * Checks if an object is of type `LocalData`
 * @param obj
 * @returns
 */
function isLocalData (obj: any): obj is LocalData {
  if (obj === undefined || obj === null) {
    return false
  }
  for (const key in obj) {
    if (!isRunData(obj[key])) {
      return false
    }
  }
  return true
}

function QuotaTime ({ data, quotaNumber, setterFn }: { data: TimeData, quotaNumber: number, setterFn: (prev: any) => any }): JSX.Element {
  const [acquiredValues, setAcquiredValues] = useState<string[]>(data.days.map((dayData) => String(dayData.acquired)))
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

/** Component that handles tracking a specific run */
function RunTracker ({ name, localData, setLocalData }: { name: string, localData: LocalData, setLocalData: React.Dispatch<React.SetStateAction<LocalData>> }): JSX.Element {
  const [nextQuotaDiv, setNextQuotaDiv] = useState<JSX.Element>(<div />)

  /** Reference to this run's data */
  const runData = localData[name]

  /**
   * Sets a new value for the run data by giving a new value
   * @param newRunData
   */
  function setRunData (newRunData: RunData): void

  /**
   * Sets a new value for the run data by using a setter function, like normal React states.
   * @param setter
   */
  function setRunData (setter: (prev: RunData) => RunData): void

  function setRunData (x: RunData | ((prev: RunData) => RunData)): void {
    if (x instanceof Function) {
      setLocalData(prev => {
        const r = { ...prev[name] }
        const newRunData = x(r)
        return { ...prev, [name]: newRunData }
      })
    } else {
      setLocalData((prev: LocalData) => ({ ...prev, [name]: x }))
    }
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

  /**
   * Gets the total amount of scrap in the ship
   * @param bypassCorrection If `true`, will ignore the ship correction
   * @returns
   */
  function getShipTotal (bypassCorrection: boolean = false): number {
    return getRunShipTotal(runData, bypassCorrection)
  }

  /** General function that updates the next quota info and adds new quota data */
  function updateCurrentQuota (): void {
    const runData = localData[name]
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

    saveRunData()
  }

  useEffect(updateCurrentQuota, [name])
  useEffect(updateCurrentQuota, [localData])

  function saveRunData (): void {
    localStorage.setItem('the-great-asset', JSON.stringify(localData))
  }

  function fixShipTotal (): void {
    const newTotal: string | null = window.prompt('What is the ship total?')
    if (!isValidNumberInput(newTotal)) {
      window.alert('Invalid value')
      return
    }
    const newRunData = { ...runData }
    newRunData.shipCorrection = Number(newTotal) - getShipTotal(true)
    setRunData(newRunData)
  }

  /**
   * Gets the average loot per day
   * @returns
   */
  function getAverageLootPerDay (): number {
    return getRunAverageLootPerDay(runData)
  }

  const avgLootPerDay = getAverageLootPerDay()

  function getHowManyQuotasCanBeDone (randomValueThroughout: number, randomValueAtEnd: number): { timesFulfilled: number, finalQuota: number } {
    return getHowManyQuotasCanBeDoneInRun(runData, randomValueThroughout, randomValueAtEnd)
  }

  function FinalQuotaStat ({ randomValueThroughout, randomValueAtEnd, randomMessage }: { randomValueThroughout: number, randomValueAtEnd: number, randomMessage: string }): JSX.Element {
    const { timesFulfilled, finalQuota } = getHowManyQuotasCanBeDone(randomValueThroughout, randomValueAtEnd)
    return (
      <div>
        <div>
          {randomMessage}, you will be able to get to quota {timesFulfilled + 1}, and your final quota will be {finalQuota}.
        </div>
      </div>
    )
  }

  /** Open popout tracker for the current run */
  function openPopout (): void {
    window.open(`/the-great-asset/?p=p&run=${name}`)
  }

  return (
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
          <button className='button' onClick={openPopout}>POPOUT (For placing in OBS and others)</button>
        </div>
        <div className='mb-6'>
          <div>
            SHIP TOTAL: {getShipTotal()}
          </div>
          <div>
            Ship total not right? Click the button to fix it.
          </div>
          <button className='button' onClick={fixShipTotal}>
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
            This pace will be specially inaccurate if you are in the first few quotas depending on your strats (before enough paid moon averages are accounted and before the quota exceeds the price to go to the paid moon)
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Gets the local data from the local storage
 * @returns
 */
export function getLocalData (): LocalData {
  const savedData: string | null = localStorage.getItem('the-great-asset')
  const defaultData: LocalData = {}
  if (savedData === null) {
    return defaultData
  }
  const localData = JSON.parse(savedData)
  if (isLocalData(localData)) {
    return localData
  } else {
    return defaultData
  }
}

/** Page component, displays everything */
export default function CareerCalculator (): JSX.Element {
  const [localData, setLocalData] = useState<LocalData>(getLocalData)
  const [selectedRun, setSelectedRun] = useState<string>('')

  /** To store all the ways to access previously created runs */
  const tabComponents = [
    <div
      className='mr-4 is-flex' style={{
        alignItems: 'center',
        justifyContent: 'center'
      }} key='0000'
    >RUNS
    </div>
  ]
  for (const run in localData) {
    tabComponents.push((
      <button
        key={run} className='button mr-2' onClick={(): void => setSelectedRun(run)}
      >
        {run}
      </button>
    ))
  }

  /**
   * Creates a new run and adds it to the local data
   */
  function addNewRun (): void {
    const runName: string | null = window.prompt('What is the name of the run?')
    if (runName === null) {
      return
    }
    setLocalData((prev: LocalData) => ({ ...prev, [runName]: { timeData: [], shipCorrection: 0 } }))
  }

  /**
   * Deletes the selected run
   */
  function deleteRun (): void {
    const confirm = window.confirm(`Are you sure you want to delete this run? "${selectedRun}"`)
    if (confirm) {
      const newLocalData = { ...localData }
      /* eslint-disable @typescript-eslint/no-dynamic-delete */
      // disabling this because would require too big of a refactoring to change the data structure and there's not any concern in deleting it here.
      delete newLocalData[selectedRun]
      /* eslint-disable @typescript-eslint/no-dynamic-delete */
      setLocalData(newLocalData)
      setSelectedRun('')
      saveRunData(newLocalData)
    }
  }

  /** Saves data locally */
  function saveRunData (localData: LocalData): void {
    localStorage.setItem('the-great-asset', JSON.stringify(localData))
  }

  return (
    <div className='has-text-primary mx-6 mb-6'>
      <h2 className='ml-3 mb-6 has-text-centered'>
        Career Calculator
      </h2>
      <div className='mb-3'>
        <button className='button mr-3' onClick={addNewRun}>New Run</button>
        <button className='button' onClick={deleteRun}>Delete Run</button>
      </div>
      <div className='is-flex is-flex-direction-row mb-2'>
        {tabComponents}
      </div>
      {selectedRun === '' ? <div /> : <RunTracker key={selectedRun} name={selectedRun} localData={localData} setLocalData={setLocalData} />}
    </div>
  )
}

/**
 * Gets the total amount of scrap in the ship in a run
 * @param runData
 * @param bypassCorrection If `true`, will ignore the ship correction
 * @returns
 */
export function getRunShipTotal (runData: RunData, bypassCorrection: boolean = false): number {
  let total: number = 0
  for (const timeData of runData.timeData) {
    for (const dayData of timeData.days) {
      total += dayData.acquired
    }
    total -= timeData.scrapSold
  }

  if (bypassCorrection) {
    return total
  }
  return total + runData.shipCorrection
}

/**
 * Gets the average loot per day in a run
 * @param runData
 * @returns
 */
export function getRunAverageLootPerDay (runData: RunData): number {
  let total: number = 0
  let days: number = 0
  for (const timeData of runData.timeData) {
    for (const dayData of timeData.days) {
      total += dayData.acquired
      days++
    }
  }

  // correction to ignore days that haven't been done yet
  days -= getRunNumberOfUndoneDays(runData)
  if (days === 0) {
    return 0
  }
  return (total + runData.shipCorrection) / days
}

/**
 * Gets the number of days that haven't been done yet in a run
 * @param runData
 * @returns
 */
function getRunNumberOfUndoneDays (runData: RunData): number {
  let days: number = 0
  const totalQuotas = runData.timeData.length
  if (totalQuotas === 0) {
    return 0
  }
  const lastQuota = runData.timeData[totalQuotas - 1]

  for (let i = 2; i >= 0; i--) {
    if (lastQuota.days[i].acquired > 0) {
      break
    }
    days++
  }

  return days
}

/**
 * Gets how many quotas can be done in a run with the given random values
 * @param runData
 * @param randomValueThroughout The generated random value for each quota throughout the run
 * @param randomValueAtEnd The generated random value for the last quota
 * @returns
 */
export function getHowManyQuotasCanBeDoneInRun (runData: RunData, randomValueThroughout: number, randomValueAtEnd: number): { timesFulfilled: number, finalQuota: number } {
  const avgLootPerDay = getRunAverageLootPerDay(runData)

  if (runData.timeData.length === 0) {
    return { timesFulfilled: 0, finalQuota: 130 }
  }
  let previousQuota: number = 130
  let currentQuota: number = runData.timeData[runData.timeData.length - 1].currentQuota
  let timesFulfilled: number = runData.timeData.length - 1
  let scrapValue = getRunShipTotal(runData) + getRunNumberOfUndoneDays(runData) * avgLootPerDay
  let hadAnyIncrease: boolean = false
  while (scrapValue >= currentQuota) {
    hadAnyIncrease = true
    scrapValue += 3 * avgLootPerDay
    scrapValue -= currentQuota
    previousQuota = currentQuota
    currentQuota = getNewProfitQuota(randomValueThroughout, timesFulfilled, currentQuota)
    timesFulfilled++
  }

  // if the next quota is already impossible, `hadAnyIncrease` should be false and we
  // don't need to calculate anything
  let finalQuota: number = 0
  if (hadAnyIncrease) {
    finalQuota = getNewProfitQuota(randomValueAtEnd, timesFulfilled - 1, previousQuota)
  } else {
    finalQuota = currentQuota
  }
  return { timesFulfilled, finalQuota }
}
