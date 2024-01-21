export default function InputBox ({ label, value, onChange }: { label: string, value: string, onChange: (event: React.ChangeEvent<HTMLInputElement>) => void }): JSX.Element {
  return (
    <div className='box mx-6 my-0 has-text-primary is-flex is-justify-content-center'>
      <div className='is-flex is-flex-direction-column is-justify-content-center'>
        <div
          className='has-text-centered' style={{
            alignItems: 'center',
            display: 'flex'
          }}
        >
          {label}
        </div>
        <div className='m-3 is-flex is-justify-content-center is-align-items-center'>
          <input
            className='input' onChange={onChange} type='number' value={value} style={{
              width: '100px'
            }}
          />
        </div>
      </div>
    </div>
  )
}
