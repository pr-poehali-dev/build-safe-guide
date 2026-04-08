import { useState } from "react";
import Icon from "@/components/ui/icon";

const categories = [
  {
    id: "mechanics",
    title: "Механика конструкций",
    icon: "Layers",
    color: "blue",
    laws: [
      {
        name: "Закон Гука",
        formula: "σ = E · ε",
        description: "Напряжение пропорционально деформации в пределах упругости",
        vars: ["σ — нормальное напряжение [МПа]", "E — модуль упругости [МПа]", "ε — относительная деформация [-]"],
      },
      {
        name: "Условие прочности",
        formula: "σ ≤ [σ] = R / γₘ",
        description: "Расчётное напряжение не должно превышать допустимое",
        vars: ["σ — расчётное напряжение [МПа]", "R — нормативное сопротивление [МПа]", "γₘ — коэффициент надёжности по материалу"],
      },
      {
        name: "Изгибающий момент",
        formula: "M = q · l² / 8",
        description: "Максимальный момент для равномерно распределённой нагрузки на балку",
        vars: ["M — изгибающий момент [кН·м]", "q — распределённая нагрузка [кН/м]", "l — пролёт балки [м]"],
      },
    ],
  },
  {
    id: "soil",
    title: "Механика грунтов",
    icon: "Mountain",
    color: "orange",
    laws: [
      {
        name: "Несущая способность основания",
        formula: "R = c·Nc + γ·d·Nq + 0.5·γ·b·Nγ",
        description: "Предельное сопротивление грунта под подошвой фундамента (формула Прандтля–Терцаги)",
        vars: ["c — сцепление грунта [кПа]", "γ — удельный вес грунта [кН/м³]", "d — глубина заложения [м]", "b — ширина фундамента [м]", "Nc, Nq, Nγ — безразмерные коэффициенты"],
      },
      {
        name: "Расчётное давление на грунт",
        formula: "p = N / A ≤ R",
        description: "Давление от фундамента не должно превышать расчётное сопротивление грунта",
        vars: ["p — давление [кПа]", "N — нагрузка на фундамент [кН]", "A — площадь подошвы [м²]", "R — расчётное сопротивление [кПа]"],
      },
      {
        name: "Глубина промерзания расчётная",
        formula: "df = kh · dfn",
        description: "Расчётная глубина сезонного промерзания грунта",
        vars: ["df — расчётная глубина промерзания [м]", "kh — коэффициент теплового режима здания", "dfn — нормативная глубина промерзания [м]"],
      },
    ],
  },
  {
    id: "loads",
    title: "Нагрузки на конструкции",
    icon: "ArrowDownToLine",
    color: "violet",
    laws: [
      {
        name: "Нагрузка от снега",
        formula: "S = μ · Sg",
        description: "Расчётная снеговая нагрузка на покрытие",
        vars: ["S — снеговая нагрузка [кПа]", "μ — коэффициент формы покрытия (0.7–1.0)", "Sg — нормативный вес снегового покрова [кПа]"],
      },
      {
        name: "Ветровая нагрузка",
        formula: "w = w₀ · k · c",
        description: "Нормативное давление ветра на вертикальную поверхность",
        vars: ["w — ветровая нагрузка [кПа]", "w₀ — базовое давление ветра [кПа]", "k — коэффициент высоты", "c — аэродинамический коэффициент"],
      },
      {
        name: "Полная расчётная нагрузка",
        formula: "Ntot = (Nпост + Nвр) · γf",
        description: "Суммарная нагрузка на фундамент с учётом коэффициента надёжности",
        vars: ["Nпост — постоянные нагрузки [кН]", "Nвр — временные нагрузки [кН]", "γf — коэффициент надёжности (1.1–1.4)"],
      },
    ],
  },
  {
    id: "materials",
    title: "Свойства материалов",
    icon: "Hammer",
    color: "emerald",
    laws: [
      {
        name: "Бетон (класс B25)",
        formula: "Rb = 14.5 МПа, Rbt = 1.05 МПа",
        description: "Нормативные сопротивления бетона B25 по СП 63.13330",
        vars: ["Rb — сопротивление сжатию [МПа]", "Rbt — сопротивление растяжению [МПа]", "E = 30 000 МПа — модуль упругости"],
      },
      {
        name: "Арматура (А400, ∅12–40)",
        formula: "Rs = 350 МПа, Rsc = 350 МПа",
        description: "Расчётные сопротивления арматуры класса А400",
        vars: ["Rs — сопротивление растяжению [МПа]", "Rsc — сопротивление сжатию [МПа]", "E = 200 000 МПа"],
      },
      {
        name: "Кирпичная кладка",
        formula: "R = 1.5 – 4.5 МПа",
        description: "Расчётное сопротивление кладки из полнотелого кирпича на растворе",
        vars: ["Зависит от марки кирпича (М100–М300)", "И марки раствора (М50–М200)", "Коэффициент условий работы γc"],
      },
    ],
  },
];

const colorMap: Record<string, { border: string; bg: string; text: string; badge: string }> = {
  blue: { border: "border-blue-500/30", bg: "bg-blue-500/8", text: "text-blue-400", badge: "bg-blue-500/20 text-blue-300" },
  orange: { border: "border-teal-500/30", bg: "bg-teal-500/8", text: "text-teal-400", badge: "bg-teal-500/20 text-teal-300" },
  violet: { border: "border-violet-500/30", bg: "bg-violet-500/8", text: "text-violet-400", badge: "bg-violet-500/20 text-violet-300" },
  emerald: { border: "border-emerald-500/30", bg: "bg-emerald-500/8", text: "text-emerald-400", badge: "bg-emerald-500/20 text-emerald-300" },
};

const ReferencePage = () => {
  const [activeCategory, setActiveCategory] = useState("mechanics");
  const [expanded, setExpanded] = useState<string | null>(null);

  const cat = categories.find((c) => c.id === activeCategory)!;

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="font-oswald text-4xl font-bold text-white mb-2">Справочник законов</h1>
          <p className="text-white/40">Физические законы, формулы и нормативы для расчётов</p>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((c) => {
            const cl = colorMap[c.color];
            return (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all duration-200 ${
                  activeCategory === c.id
                    ? `${cl.border} ${cl.bg} ${cl.text}`
                    : "border-white/10 text-white/50 hover:text-white hover:border-white/20"
                }`}
              >
                <Icon name={c.icon} size={14} />
                {c.title}
              </button>
            );
          })}
        </div>

        {/* Laws */}
        <div className="space-y-3">
          {cat.laws.map((law, i) => {
            const cl = colorMap[cat.color];
            const isOpen = expanded === `${cat.id}-${i}`;
            return (
              <div
                key={i}
                className={`rounded-2xl border transition-all duration-200 ${
                  isOpen ? `${cl.border} ${cl.bg}` : "border-white/10 bg-white/2 hover:border-white/20"
                }`}
              >
                <button
                  className="w-full flex items-center gap-4 p-5 text-left"
                  onClick={() => setExpanded(isOpen ? null : `${cat.id}-${i}`)}
                >
                  <div className={`px-3 py-1.5 rounded-lg font-mono text-sm font-bold ${cl.badge} flex-shrink-0`}>
                    {law.formula}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-oswald text-lg font-bold text-white">{law.name}</div>
                    <div className="text-white/40 text-sm truncate">{law.description}</div>
                  </div>
                  <Icon
                    name="ChevronDown"
                    size={18}
                    className={`text-white/30 flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 animate-fade-in">
                    <p className="text-white/60 text-sm mb-4 leading-relaxed">{law.description}</p>
                    <div className="space-y-1.5">
                      {law.vars.map((v, j) => (
                        <div key={j} className="flex items-start gap-2 text-sm">
                          <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${cl.text.replace("text-", "bg-")}`} />
                          <span className="text-white/60">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Note */}
        <div className="mt-8 p-4 rounded-xl border border-white/10 bg-white/3 flex gap-3">
          <Icon name="Info" size={18} className="text-white/30 flex-shrink-0 mt-0.5" />
          <p className="text-white/40 text-sm leading-relaxed">
            Все формулы приведены в соответствии с актуальными редакциями СП 20.13330, СП 22.13330, СП 63.13330 и ГОСТ 27751. Для ответственных конструкций расчёты должны выполняться лицензированным специалистом.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReferencePage;