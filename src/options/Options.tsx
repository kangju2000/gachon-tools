import packageJson from './../../package.json'

const { version } = packageJson

export function Options() {
  return (
    <div>
      <h1>Options</h1>
      <p>Version: {version}</p>
    </div>
  )
}
