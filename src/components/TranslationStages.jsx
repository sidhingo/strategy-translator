const STAGES = [
    { key: 'reading', label: 'Reading', detail: 'Pulling out the real decision, stated goals, and what\'s actually described happening' },
    { key: 'comparing', label: 'Comparing', detail: 'Checking stated intent against actual activity, branching the tradeoffs' },
  ];
  
  export default function TranslationStages({ status }) {
    const activeIndex = status === 'reading' ? 0 : 1;
  
    return (
      <div className="py-10">
        <div className="space-y-6">
          {STAGES.map((stage, i) => {
            const isActive = i === activeIndex;
            const isDone = i < activeIndex;
            return (
              <div key={stage.key} className="flex items-start gap-4">
                <div
                  className="mt-1 w-2 h-2 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor: isDone || isActive ? '#0B2545' : '#E2E8F0',
                    opacity: isActive ? 1 : isDone ? 1 : 0.5,
                  }}
                />
                <div>
                  <p className={`font-medium ${isDone || isActive ? 'text-neutral-900' : 'text-neutral-300'}`}>
                    {stage.label}
                    {isActive && '...'}
                  </p>
                  <p className={`text-sm ${isDone || isActive ? 'text-neutral-500' : 'text-neutral-300'}`}>
                    {stage.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }