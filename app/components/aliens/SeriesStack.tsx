'use client';

const series = [
    { id : 1, name: 'Ben 10 Classic', image: '/ben10-classic.png',
      description: "This series follows ten-year-old Ben Tennyson, who accidentally finds the Omnitrix during a summer road trip with his Grandpa Max and cousin Gwen..."},
    { id: 2, name: 'Ben 10 Alien force', image: '/ben10-alienforce.png',
      description: "Set five years later, the tone becomes darker and more serialized as 15-year-old Ben leads a new team..."},
    { id: 3, name: 'Ben10 Ultimate Alien', image: '/ben10-ultimatealien.png',
      description: "Ben's identity is revealed to the world, forcing him to navigate global celebrity while dealing with the replacement Ultimatrix... "},
];


export default function SeriesStack() {
    return (
      <div className="series-stack">
        {series.map((s, i) => (
          <div key={s.id} className="series-stack-item">
            <div
             className="series-stack-card card-wrapper p-1 rounded-2xl"
             style={{ 
                top: `${80 + i * 40}px`,
                zIndex: i + 1,
                transform: `scale(${1 - (series.length - 1 - i) * 0.03})`,
            }}
            >
              <div className="card-content radial-bg-dark rounded-xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
                <img 
                 src={s.image} 
                 alt={s.name}
                 className="w-48 h-48 md:w-64 md:h-64 object-contain flex-shrink-0"
                 />
                 <div>
                    <h2
                     className="text-2xl md:text-3xl font-black text-[#00FF00]/90 uppercase tracking-wider mb-4"
                     style={{ textShadow: "0 0 20px rgba(0, 255, 0, 0.6)" }}
                    >
                        {s.name}
                    </h2>
                    <p className="text-gray-200 text-sm md:text-base leading-relaxed text-justify">
                        {s.description}
                    </p>
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
}