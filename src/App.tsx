import QuotaCalculator from './QuotaCalculator'
import OvertimeCalculator from './OvertimeCalculator'
import CareerCalculator from './CareerCalculator'
import PopoutTracker from './PopoutTracker'

function ResourceLink ({ page, title, desc }: { page: string, title: string, desc: string }): JSX.Element {
  return (
    <div className='box m-6 has-text-centered has-text-primary'>
      <a href={`/?p=${page}`} className='has-text-primary'>{title}</a>
      <h2 className='m-3'>
        {desc}
      </h2>
    </div>
  )
}

export default function App (): JSX.Element {
  const urlParams = new URLSearchParams(window.location.search)
  const page = urlParams.get('p')

  if (page === 'q') {
    return <QuotaCalculator />
  } else if (page === 'o') {
    return <OvertimeCalculator />
  } else if (page === 'c') {
    return <CareerCalculator />
  } else if (page === 'p') {
    return <PopoutTracker />
  }

  return (
    <div>
      <header className='hero'>
        <div className='hero-body container'>
          <h1 className='title has-text-primary'>
            Welcome to The Great Asset
          </h1>
        </div>
      </header>
      <h2 className='has-text-primary has-text-centered'>
        A small collection of calculator resources for Lethal Company
      </h2>
      <ResourceLink page='q' title='Next Profit Quota Calculator' desc='Calculate what the next profit quota may be.' />
      <ResourceLink page='o' title='Overtime Bonus Calculator' desc='Calculate how much you need to sell to get a total amount of money accounting overtime bonus.' />
      <ResourceLink page='c' title='Career Calculator' desc='A calculator to examine a run of Lethal Company and keeping track of stats, as well as a pace calculator.' />
      <div className='footer p-3 pb-5'>
        The Great Asset version {require('../package.json').version}. <a className='has-text-primary' href='https://github.com/nhaar/the-great-asset'>Check out the repository here.</a>
      </div>
    </div>
  )
}
