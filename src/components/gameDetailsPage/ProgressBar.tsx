function ProgressBar() {
  return (
    <div className="progress">
        <div className="progress-bar bg-success progress-bar-stripped" role="progressbar" aria-valuenow={25} aria-valuemin = {0} aria-valuemax={100} style={{"width": "25%"}}></div>
    </div>
  )
}

export default ProgressBar