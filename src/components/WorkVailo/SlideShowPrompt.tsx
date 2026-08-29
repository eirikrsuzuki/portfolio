const actions = [
  'Create Image',
  'Create Video',
  'Edit Image',
  'Edit Video',
  'Motion Control',
]

const SlideShowPrompt = () => {
  return (
    <div className="overflow-hidden w-full h-[500px] flex flex-col justify-center items-center absolute top-0 left-0 text-white px-6">
      <h2 className="vailo-prompt-heading font-bold text-theme-lg mb-5 text-center">
        What do you want to create Today?
      </h2>
      <div className="flex flex-wrap justify-center gap-2 mb-5 max-w-[420px]">
        {actions.map((action) => (
          <span
            key={action}
            className="vailo-action-chip text-theme-xs border border-white/30 bg-white/10 rounded-full px-3 py-1.5"
          >
            {action}
          </span>
        ))}
      </div>
      <div className="vailo-prompt-bar w-full max-w-[380px] rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm p-4">
        <p className="text-theme-sm text-white/60 mb-6">
          A cinematic shot of a vintage convertible driving along the coast at
          golden hour…
        </p>
        <div className="flex justify-between items-center">
          <span className="text-theme-xs text-white/50">✦ kling-v2.5-turbo</span>
          <span className="text-theme-xs font-semibold rounded-lg px-4 py-2 bg-gradient-to-r from-violet-600 to-blue-500">
            Generate
          </span>
        </div>
      </div>
    </div>
  )
}

export default SlideShowPrompt
