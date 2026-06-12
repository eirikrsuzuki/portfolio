import clsx from 'clsx'

const experiments = [
  { id: '#1', solvent: 'Toluene', catalyst: 'XantPhos', temp: '25 °C', yieldPct: 54.0 },
  { id: '#2', solvent: 'Cyclopentyl ME', catalyst: 'XantPhos', temp: '60 °C', yieldPct: 61.2 },
  { id: '#5', solvent: 'DMSO', catalyst: 'BrettPhos', temp: '80 °C', yieldPct: 67.5 },
  { id: '#8', solvent: 'DMAc', catalyst: 'tBuXPhos', temp: '100 °C', yieldPct: 75.3 },
  { id: '#11', solvent: 'Toluene', catalyst: 'BrettPhos', temp: '85 °C', yieldPct: 83.1 },
  { id: '#13', solvent: 'Toluene', catalyst: 'BrettPhos', temp: '90 °C', yieldPct: 92.0 },
]

const SlideShowExperiments = () => {
  return (
    <div className="overflow-hidden w-full h-[500px] flex flex-col justify-center items-center absolute top-0 left-0 px-6">
      <div className="reactwise-table-card w-full max-w-[400px] rounded-xl bg-white text-gray-800 shadow-xl overflow-hidden font-roboto">
        <div className="px-4 pt-4 pb-3 border-b border-gray-100">
          <h2 className="font-bold text-theme-sm">Buchwald-Hartwig Coupling</h2>
          <p className="text-theme-xs text-gray-500">
            Optimize the synthesis of a secondary aniline by variation of
            solvent, ligand and temperature
          </p>
        </div>
        <div className="grid grid-cols-[40px_1fr_1fr_56px_56px] gap-x-2 px-4 py-2 text-theme-xs text-gray-400">
          <span>Exp</span>
          <span>Solvent</span>
          <span>Catalyst</span>
          <span>Temp.</span>
          <span className="text-right">Yield</span>
        </div>
        {experiments.map((experiment) => (
          <div
            key={experiment.id}
            className={clsx(
              'reactwise-exp-row grid grid-cols-[40px_1fr_1fr_56px_56px] gap-x-2 px-4 py-2 text-theme-xs border-t border-gray-100',
              { 'bg-green-50': experiment.yieldPct >= 80 }
            )}
          >
            <span className="text-gray-400">{experiment.id}</span>
            <span>{experiment.solvent}</span>
            <span>{experiment.catalyst}</span>
            <span>{experiment.temp}</span>
            <span
              className={clsx('text-right font-semibold', {
                'text-green-600': experiment.yieldPct >= 80,
              })}
            >
              {experiment.yieldPct.toFixed(1)} %
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SlideShowExperiments
