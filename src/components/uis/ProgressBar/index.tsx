type Props = {
  pos: number
  max?: number
}

const ProgressBar = ({ pos, max = 100 }: Props) => {
  const percent = (pos / max) * 100

  return (
    <div className="outer-progress-bar">
      <div className="inner-progress-bar" style={{ width: `${percent}%` }}></div>
    </div>
  )
}

export default ProgressBar
