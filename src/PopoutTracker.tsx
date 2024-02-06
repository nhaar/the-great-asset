import { useEffect, useState } from 'react'
import { RunData, getHowManyQuotasCanBeDoneInRun, getLocalData, getRunAverageLootPerDay, getRunShipTotal } from './CareerCalculator'

import './styles/fonts.css'

/** Component for the page that contains the minified run tracker */
export default function PopoutTracker (): JSX.Element {
  const [runData, setRunData] = useState<RunData | null>(null)
  const [fontColor, setFontColor] = useState<string>('#f35104')
  const [backgroundColor, setBackgroundColor] = useState<string>('#00ff00')
  const [fontSize, setFontSize] = useState<string>('36')
  const [lineSpacing, setLineSpacing] = useState<string>('-20')

  // creates loop that constantly checks for changes
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)

    // if not a string then it will break
    const name = urlParams.get('run') as string

    const updater = (): void => {
      const localData = getLocalData()
      const curRunData = localData[name]
      if (curRunData !== runData) {
        setRunData(curRunData)
      }
    }

    updater()
    setInterval(updater, 1000)
  }, [])

  /**
   * Get the current quota number
   * @returns
   */
  function getCurrentQuotaNumber (): number {
    if (runData === null) return 0

    return runData.timeData.length
  }

  /**
   * Get the current profit quota
   * @returns
   */
  function getCurrentProfitQuota (): number {
    if (runData === null) return 0

    return runData.timeData[runData.timeData.length - 1].currentQuota
  }

  /**
   * Get the total scrap in the ship
   * @returns
   */
  function getShipTotal (): number {
    if (runData === null) return 0

    return getRunShipTotal(runData)
  }

  /**
   * Get the average loot per day
   * @returns
   */
  function getAverageLootPerDay (): number {
    if (runData === null) return 0

    return getRunAverageLootPerDay(runData)
  }

  function getPaceString (pace: { timesFulfilled: number, finalQuota: number }): string {
    return `Q${pace.timesFulfilled} (${pace.finalQuota})`
  }

  const defaultPace = getPaceString({ timesFulfilled: 0, finalQuota: 0 })

  /** Get the worst possible quota number at current pace */
  function getWorstPace (): string {
    if (runData === null) return defaultPace

    return getPaceString(getHowManyQuotasCanBeDoneInRun(runData, 0.5, -0.5))
  }

  /** Get the average possible quota number at current pace */
  function getAveragePace (): string {
    if (runData === null) return defaultPace

    return getPaceString(getHowManyQuotasCanBeDoneInRun(runData, 0, 0))
  }

  /** Get the best possible quota number at current pace */
  function getBestPace (): string {
    if (runData === null) return defaultPace

    return getPaceString(getHowManyQuotasCanBeDoneInRun(runData, -0.5, 0.5))
  }

  /** Style used to fix line spacing */
  const marginStyle = {
    marginBottom: `${lineSpacing}px`
  }

  return (
    <div>
      <div
        className='is-flex has-text-primary' style={{
          columnGap: '2px'
        }}
      >
        <div>
          <span>Font Color: </span>
          <input type='color' value={fontColor} onChange={e => setFontColor(e.target.value)} />
        </div>
        <div>
          <span>Background Color:</span>
          <input type='color' value={backgroundColor} onChange={e => setBackgroundColor(e.target.value)} />
        </div>
        <div>
          <span>Font Size:</span>
          <input type='number' value={fontSize} onChange={e => setFontSize(e.target.value)} />
        </div>
        <div>
          <span>Line Spacing (use negative if too big)</span>
          <input type='number' value={lineSpacing} onChange={e => setLineSpacing(e.target.value)} />
        </div>
      </div>
      <div
        className='lethal-font p-3' style={{
          fontSize: `${fontSize}px`,
          color: fontColor,
          backgroundColor
        }}
      >
        <div style={marginStyle}>
          In Quota #{getCurrentQuotaNumber()}: {getCurrentProfitQuota()}
        </div>
        <div style={marginStyle}>
          Ship Total: {getShipTotal()}
        </div>
        <div style={marginStyle}>
          Avg/Day: {getAverageLootPerDay().toFixed(2)}
        </div>
        <div style={marginStyle}>
          Quota Pace:
        </div>
        <div style={marginStyle}>
          &nbsp;&nbsp;Worst: {getWorstPace()}
        </div>
        <div style={marginStyle}>
          &nbsp;&nbsp;Average: {getAveragePace()}
        </div>
        <div style={marginStyle}>
          &nbsp;&nbsp;Best: {getBestPace()}
        </div>
      </div>
    </div>
  )
}
