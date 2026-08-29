const SlideShowOptimize = () => {
  return (
    <div className="overflow-hidden w-full h-[500px] flex flex-col justify-center items-center absolute top-0 left-0 text-white px-6">
      <h2 className="reactwise-best-heading font-bold text-theme-lg mb-5 text-center">
        Smarter suggestions, 10x faster results
      </h2>
      <div className="reactwise-best-card w-full max-w-[340px] rounded-xl bg-white text-gray-800 shadow-xl p-4 font-roboto">
        <div className="flex justify-between items-center mb-4">
          <span className="font-bold text-theme-sm">Best Experiment</span>
          <span className="text-theme-xs font-semibold text-green-600 bg-green-50 rounded-md px-2 py-1">
            #13
          </span>
        </div>
        <div className="mb-3">
          <div className="flex justify-between text-theme-xs mb-1">
            <span className="text-gray-500">Yield</span>
            <span className="font-semibold">92.0 %</span>
          </div>
          <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
            <div className="reactwise-yield-bar h-full w-[92%] rounded-full bg-green-500" />
          </div>
        </div>
        <div className="mb-5">
          <div className="flex justify-between text-theme-xs mb-1">
            <span className="text-gray-500">Impurity</span>
            <span className="font-semibold">1.2 %</span>
          </div>
          <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
            <div className="reactwise-impurity-bar h-full w-[6%] rounded-full bg-amber-400" />
          </div>
        </div>
        <div className="reactwise-create-btn">
          <div className="flex justify-between text-theme-xs mb-3">
            <span className="text-gray-500">Suggested next experiments</span>
            <span className="font-semibold">5</span>
          </div>
          <div className="text-center text-theme-xs font-semibold text-white bg-blue-600 rounded-lg py-2.5">
            Create experiments
          </div>
        </div>
      </div>
    </div>
  )
}

export default SlideShowOptimize
