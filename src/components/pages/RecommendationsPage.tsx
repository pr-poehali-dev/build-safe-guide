import { useState } from "react";
import Icon from "@/components/ui/icon";

const recommendations = [
  {
    id: "foundation",
    category: "Фундамент",
    icon: "Layers",
    color: "orange",
    title: "Заглублённый ленточный фундамент",
    description: "Оптимальное решение для двухэтажного дома на суглинке в центральной России",
    specs: [
      { label: "Тип фундамента", value: "Монолитный ленточный" },
      { label: "Глубина заложения", value: "1.5 м (ниже промерзания)" },
      { label: "Ширина ленты", value: "400 мм" },
      { label: "Высота ленты над уровнем земли", value: "300 мм" },
      { label: "Класс бетона", value: "B25 (W6)" },
      { label: "Армирование", value: "4×Ø16 А400, хомуты Ø8 А240 ш.200" },
    ],
    drawing: "foundation",
    note: "Обязательна щебёночная подготовка 150 мм + гидроизоляция 2 слоя рубероида на мастике",
  },
  {
    id: "walls",
    category: "Стены",
    icon: "Square",
    color: "blue",
    title: "Кирпичная кладка с утеплением",
    description: "Наружные стены из кирпича 250 мм + утеплитель + облицовка",
    specs: [
      { label: "Несущая стена", value: "Кирпич М150, толщина 250 мм" },
      { label: "Раствор", value: "М100, шов 10–12 мм" },
      { label: "Утеплитель", value: "Минвата 100 мм, λ = 0.04 Вт/м·К" },
      { label: "R стены (приведённое)", value: "≥ 3.5 м²·К/Вт" },
      { label: "Перемычки над проёмами", value: "Ж/б, высота ≥ пролёт/5" },
    ],
    drawing: "walls",
    note: "По СП 50.13330 для III климатического района требуемое R ≥ 3.49 м²·К/Вт",
  },
  {
    id: "roof",
    category: "Кровля",
    icon: "Triangle",
    color: "violet",
    title: "Двускатная стропильная кровля",
    description: "Деревянная стропильная система с металлочерепицей",
    specs: [
      { label: "Уклон кровли", value: "30–45°" },
      { label: "Стропила", value: "Сосна, 50×200 мм, шаг 600–900 мм" },
      { label: "Обрешётка", value: "25×100 мм, шаг под металлочерепицу" },
      { label: "Утеплитель чердака", value: "Минвата 200 мм" },
      { label: "Снеговая нагрузка (III р-н)", value: "1.8 × 0.7 = 1.26 кПа" },
      { label: "Ветровая нагрузка (III р-н)", value: "0.38 × k × c кПа" },
    ],
    drawing: "roof",
    note: "Все деревянные элементы обработать антисептиком и антипиреном. Вентиляционный зазор 25–50 мм.",
  },
];

const colorMap: Record<string, { border: string; bg: string; text: string; dot: string }> = {
  orange: { border: "border-orange-500/30", bg: "bg-orange-500/8", text: "text-orange-400", dot: "bg-orange-500" },
  blue: { border: "border-blue-500/30", bg: "bg-blue-500/8", text: "text-blue-400", dot: "bg-blue-500" },
  violet: { border: "border-violet-500/30", bg: "bg-violet-500/8", text: "text-violet-400", dot: "bg-violet-500" },
};

const DrawingFoundation = () => (
  <svg viewBox="0 0 400 200" className="w-full h-auto" fill="none">
    <rect x="20" y="60" width="360" height="30" rx="3" fill="#f97316" fillOpacity="0.15" stroke="#f97316" strokeOpacity="0.5" strokeWidth="1.5" />
    <text x="200" y="80" textAnchor="middle" fill="#f97316" fontSize="11" fontFamily="monospace">Лента 400×300 мм (над землёй)</text>
    <rect x="20" y="90" width="360" height="80" rx="3" fill="#f97316" fillOpacity="0.08" stroke="#f97316" strokeOpacity="0.3" strokeWidth="1" strokeDasharray="6 3" />
    <text x="200" y="135" textAnchor="middle" fill="#f97316" fillOpacity="0.7" fontSize="11" fontFamily="monospace">Лента 400×1200 мм (в земле)</text>
    <line x1="20" y1="92" x2="20" y2="170" stroke="#ffffff" strokeOpacity="0.2" strokeWidth="1" strokeDasharray="4 4" />
    <line x1="380" y1="92" x2="380" y2="170" stroke="#ffffff" strokeOpacity="0.2" strokeWidth="1" strokeDasharray="4 4" />
    <rect x="20" y="170" width="360" height="15" fill="#ffffff" fillOpacity="0.05" stroke="#ffffff" strokeOpacity="0.15" strokeWidth="1" />
    <text x="200" y="182" textAnchor="middle" fill="#ffffff" fillOpacity="0.3" fontSize="10" fontFamily="monospace">Щебень 150 мм</text>
    <line x1="0" y1="90" x2="400" y2="90" stroke="#ffffff" strokeOpacity="0.15" strokeWidth="1" strokeDasharray="8 4" />
    <text x="5" y="88" fill="#ffffff" fillOpacity="0.3" fontSize="9" fontFamily="monospace">±0.000 Уровень земли</text>
    <line x1="0" y1="170" x2="20" y2="170" stroke="#f97316" strokeOpacity="0.4" strokeWidth="1" />
    <text x="5" y="168" fill="#f97316" fillOpacity="0.6" fontSize="9" fontFamily="monospace">-1.500</text>
    <line x1="60" y1="100" x2="60" y2="165" stroke="#60a5fa" strokeOpacity="0.5" strokeWidth="1" strokeDasharray="3 2" />
    <circle cx="60" cy="102" r="2" fill="#60a5fa" fillOpacity="0.7" />
    <circle cx="60" cy="163" r="2" fill="#60a5fa" fillOpacity="0.7" />
    <text x="65" y="135" fill="#60a5fa" fillOpacity="0.7" fontSize="9" fontFamily="monospace">Ø16 А400</text>
  </svg>
);

const DrawingWalls = () => (
  <svg viewBox="0 0 400 200" className="w-full h-auto" fill="none">
    <rect x="30" y="20" width="50" height="160" fill="#60a5fa" fillOpacity="0.15" stroke="#60a5fa" strokeOpacity="0.5" strokeWidth="1.5" />
    <text x="55" y="108" textAnchor="middle" fill="#60a5fa" fontSize="9" fontFamily="monospace" transform="rotate(-90,55,108)">Кирпич 250</text>
    <rect x="80" y="20" width="40" height="160" fill="#a78bfa" fillOpacity="0.15" stroke="#a78bfa" strokeOpacity="0.4" strokeWidth="1" />
    <text x="100" y="108" textAnchor="middle" fill="#a78bfa" fontSize="9" fontFamily="monospace" transform="rotate(-90,100,108)">Мин.вата 100</text>
    <rect x="120" y="20" width="30" height="160" fill="#60a5fa" fillOpacity="0.08" stroke="#60a5fa" strokeOpacity="0.2" strokeWidth="1" />
    <text x="135" y="108" textAnchor="middle" fill="#60a5fa" fontSize="8" fontFamily="monospace" transform="rotate(-90,135,108)">Облицовка</text>
    <line x1="160" y1="20" x2="400" y2="20" stroke="#ffffff" strokeOpacity="0.05" strokeWidth="1" />
    <text x="175" y="60" fill="#ffffff" fillOpacity="0.5" fontSize="11" fontFamily="monospace">Состав стены:</text>
    <text x="175" y="85" fill="#60a5fa" fillOpacity="0.8" fontSize="10" fontFamily="monospace">• Кирпич М150 — 250 мм</text>
    <text x="175" y="105" fill="#a78bfa" fillOpacity="0.8" fontSize="10" fontFamily="monospace">• Минвата λ=0.04 — 100 мм</text>
    <text x="175" y="125" fill="#60a5fa" fillOpacity="0.6" fontSize="10" fontFamily="monospace">• Облицовочный кирпич</text>
    <text x="175" y="150" fill="#ffffff" fillOpacity="0.3" fontSize="10" fontFamily="monospace">Итого: R = 3.5 м²·К/Вт</text>
  </svg>
);

const DrawingRoof = () => (
  <svg viewBox="0 0 400 200" className="w-full h-auto" fill="none">
    <polygon points="200,20 30,160 370,160" fill="#a78bfa" fillOpacity="0.1" stroke="#a78bfa" strokeOpacity="0.5" strokeWidth="1.5" />
    <line x1="200" y1="20" x2="200" y2="160" stroke="#a78bfa" strokeOpacity="0.3" strokeWidth="1" strokeDasharray="5 3" />
    <line x1="115" y1="90" x2="200" y2="20" stroke="#f97316" strokeOpacity="0.6" strokeWidth="2" />
    <line x1="285" y1="90" x2="200" y2="20" stroke="#f97316" strokeOpacity="0.6" strokeWidth="2" />
    <text x="200" y="14" textAnchor="middle" fill="#a78bfa" fontSize="9" fontFamily="monospace">Конёк</text>
    <text x="100" y="110" fill="#f97316" fillOpacity="0.7" fontSize="9" fontFamily="monospace">Стропила 50×200</text>
    <text x="30" y="178" fill="#ffffff" fillOpacity="0.4" fontSize="9" fontFamily="monospace">Уклон 30–45° · Металлочерепица · Минвата 200 мм</text>
    <line x1="200" y1="160" x2="260" y2="160" stroke="#ffffff" strokeOpacity="0.2" strokeWidth="1" />
    <line x1="260" y1="20" x2="260" y2="160" stroke="#ffffff" strokeOpacity="0.15" strokeWidth="1" strokeDasharray="4 4" />
    <text x="262" y="95" fill="#ffffff" fillOpacity="0.3" fontSize="9" fontFamily="monospace">h</text>
  </svg>
);

const drawings: Record<string, JSX.Element> = {
  foundation: <DrawingFoundation />,
  walls: <DrawingWalls />,
  roof: <DrawingRoof />,
};

const RecommendationsPage = () => {
  const [activeId, setActiveId] = useState<string>("foundation");
  const active = recommendations.find((r) => r.id === activeId)!;
  const cl = colorMap[active.color];

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="font-oswald text-4xl font-bold text-white mb-2">Рекомендации и чертежи</h1>
          <p className="text-white/40">Финальные решения с параметрами и схематичными чертежами</p>
        </div>

        {/* Category selector */}
        <div className="flex flex-wrap gap-3 mb-8">
          {recommendations.map((r) => {
            const c = colorMap[r.color];
            return (
              <button
                key={r.id}
                onClick={() => setActiveId(r.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 ${
                  activeId === r.id
                    ? `${c.border} ${c.bg} ${c.text}`
                    : "border-white/10 text-white/50 hover:text-white hover:border-white/20"
                }`}
              >
                <Icon name={r.icon} size={14} />
                {r.category}
              </button>
            );
          })}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Specs */}
          <div className={`rounded-2xl border ${cl.border} ${cl.bg} p-6`}>
            <div className={`text-xs font-medium uppercase tracking-wider ${cl.text} mb-1`}>{active.category}</div>
            <h2 className="font-oswald text-2xl font-bold text-white mb-2">{active.title}</h2>
            <p className="text-white/50 text-sm mb-6 leading-relaxed">{active.description}</p>

            <div className="space-y-3">
              {active.specs.map((s, i) => (
                <div key={i} className="flex items-start justify-between gap-4 py-2 border-b border-white/5 last:border-0">
                  <span className="text-white/50 text-sm">{s.label}</span>
                  <span className="text-white font-medium text-sm text-right">{s.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 p-3 rounded-lg border border-white/10 bg-white/3 flex gap-2">
              <Icon name="Info" size={14} className="text-white/30 flex-shrink-0 mt-0.5" />
              <p className="text-white/40 text-xs leading-relaxed">{active.note}</p>
            </div>
          </div>

          {/* Drawing */}
          <div className="rounded-2xl border border-white/10 bg-white/3 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Icon name="PenTool" size={14} className="text-white/30" />
              <span className="text-white/40 text-sm">Схематичный чертёж</span>
            </div>
            <div className="bg-[#0d0d1a] rounded-xl p-4 border border-white/5">
              {drawings[active.drawing]}
            </div>
            <p className="text-white/20 text-xs mt-3 text-center">Чертёж схематичный, не является рабочей документацией</p>
          </div>
        </div>

        {/* Export hint */}
        <div className="mt-6 p-4 rounded-xl border border-white/10 bg-white/3 flex items-center gap-3">
          <Icon name="FileText" size={18} className="text-white/30" />
          <div>
            <p className="text-white/60 text-sm font-medium">Нужна рабочая документация?</p>
            <p className="text-white/30 text-xs">Используйте данные из калькулятора и справочника для передачи инженеру-проектировщику</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationsPage;
