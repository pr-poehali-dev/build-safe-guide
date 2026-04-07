import { PageId } from "@/pages/Index";
import Icon from "@/components/ui/icon";

interface HomePageProps {
  onNavigate: (page: PageId) => void;
}

const features = [
  {
    id: "schema" as PageId,
    icon: "GitBranch",
    title: "Интерактивная схема",
    desc: "7 ключевых вопросов о грунте, материалах, ветре и сейсмике — на выходе пошаговый план",
    color: "from-blue-500 to-cyan-400",
    border: "border-blue-500/30",
    bg: "bg-blue-500/10",
  },
  {
    id: "reference" as PageId,
    icon: "BookOpen",
    title: "Справочник законов",
    desc: "Физические законы, формулы и нормативы в удобном формате",
    color: "from-emerald-500 to-teal-400",
    border: "border-emerald-500/30",
    bg: "bg-emerald-500/10",
  },
  {
    id: "calculator" as PageId,
    icon: "Calculator",
    title: "Калькулятор нагрузок",
    desc: "Расчёт нагрузок, глубины фундамента и параметров безопасности",
    color: "from-orange-500 to-amber-400",
    border: "border-orange-500/30",
    bg: "bg-orange-500/10",
  },
  {
    id: "recommendations" as PageId,
    icon: "ClipboardList",
    title: "Рекомендации",
    desc: "Финальные рекомендации и чертежи на основе ваших данных",
    color: "from-violet-500 to-purple-400",
    border: "border-violet-500/30",
    bg: "bg-violet-500/10",
  },
];

const HomePage = ({ onNavigate }: HomePageProps) => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-16 pb-24">
        {/* Glow orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 left-1/4 w-[300px] h-[300px] bg-blue-500/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-orange-500/40 bg-orange-500/10 text-orange-400 text-xs font-medium mb-8 animate-fade-in">
            <Icon name="Building2" size={12} />
            Небоскрёбы и высотные здания
          </div>

          <h1 className="font-oswald text-5xl md:text-7xl font-bold leading-tight mb-6 animate-fade-in"
            style={{ animationDelay: "0.1s" }}>
            <span className="text-white">Строй</span>
            <br />
            <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-orange-300 bg-clip-text text-transparent">
              вертикально
            </span>
          </h1>

          <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in"
            style={{ animationDelay: "0.2s" }}>
            Интерактивная инструкция по безопасному проектированию небоскрёбов и высотных зданий — грунт, материалы, ветер, сейсмика, пошаговый план действий
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-in"
            style={{ animationDelay: "0.3s" }}>
            <button
              onClick={() => onNavigate("schema")}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-black font-bold text-base hover:from-orange-400 hover:to-amber-400 transition-all duration-200 hover:scale-105 shadow-lg shadow-orange-500/25"
            >
              <Icon name="Play" size={18} />
              Начать работу
            </button>
            <button
              onClick={() => onNavigate("calculator")}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-white/20 text-white font-medium text-base hover:border-white/40 hover:bg-white/5 transition-all duration-200"
            >
              <Icon name="Calculator" size={18} />
              Открыть калькулятор
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-4 pb-16">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: "8", label: "Фаз строительства" },
            { value: "60+", label: "Конкретных действий" },
            { value: "4", label: "Сценария рисков" },
            { value: "100%", label: "По нормативам РФ" },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-4 rounded-xl border border-white/10 bg-white/3">
              <div className="font-oswald text-3xl font-bold text-orange-400 mb-1">{stat.value}</div>
              <div className="text-white/50 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features grid */}
      <section className="px-4 pb-24">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-oswald text-3xl font-bold text-center text-white mb-3">Разделы инструкции</h2>
          <p className="text-white/40 text-center mb-12">Выберите раздел для начала работы</p>

          <div className="grid md:grid-cols-2 gap-4">
            {features.map((f) => (
              <button
                key={f.id}
                onClick={() => onNavigate(f.id)}
                className={`group text-left p-6 rounded-2xl border ${f.border} ${f.bg} hover:border-opacity-60 hover:scale-[1.02] transition-all duration-200 cursor-pointer`}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  <Icon name={f.icon} size={22} className="text-black" />
                </div>
                <h3 className="font-oswald text-xl font-bold text-white mb-2">{f.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
                <div className="flex items-center gap-1 mt-4 text-white/30 text-xs group-hover:text-white/60 transition-colors">
                  Перейти <Icon name="ArrowRight" size={12} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="text-center pb-10">
        <span className="text-white/20 text-xs">Романова С.</span>
      </div>
    </div>
  );
};

export default HomePage;