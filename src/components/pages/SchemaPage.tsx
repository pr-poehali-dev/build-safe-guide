import { useState } from "react";
import Icon from "@/components/ui/icon";

interface Question {
  id: string;
  text: string;
  options: { label: string; next: string; icon?: string }[];
}

interface Result {
  id: string;
  title: string;
  description: string;
  items: string[];
  color: string;
  icon: string;
}

const questions: Record<string, Question> = {
  start: {
    id: "start",
    text: "Какой тип строительного объекта вы проектируете?",
    options: [
      { label: "Жилой дом / Коттедж", next: "q_soil", icon: "House" },
      { label: "Промышленное здание", next: "q_floors", icon: "Factory" },
      { label: "Хозяйственная постройка", next: "q_simple", icon: "Warehouse" },
      { label: "Фундамент существующего здания", next: "q_foundation_type", icon: "Layers" },
    ],
  },
  q_soil: {
    id: "q_soil",
    text: "Какой тип грунта на участке?",
    options: [
      { label: "Скала / Полускала", next: "r_rock", icon: "Mountain" },
      { label: "Песок / Гравий", next: "q_water", icon: "Waves" },
      { label: "Глина / Суглинок", next: "q_frost", icon: "Layers" },
      { label: "Торф / Насыпной", next: "r_weak", icon: "AlertTriangle" },
    ],
  },
  q_floors: {
    id: "q_floors",
    text: "Сколько этажей в здании?",
    options: [
      { label: "1–2 этажа", next: "q_soil" },
      { label: "3–5 этажей", next: "q_soil" },
      { label: "Более 5 этажей", next: "r_engineer" },
    ],
  },
  q_simple: {
    id: "q_simple",
    text: "Какой материал стен?",
    options: [
      { label: "Дерево / Каркас", next: "r_light" },
      { label: "Кирпич / Блоки", next: "q_soil" },
    ],
  },
  q_foundation_type: {
    id: "q_foundation_type",
    text: "Что именно нужно сделать с фундаментом?",
    options: [
      { label: "Усилить / Расширить", next: "r_engineer" },
      { label: "Рассчитать несущую способность", next: "q_soil" },
    ],
  },
  q_water: {
    id: "q_water",
    text: "Какой уровень грунтовых вод?",
    options: [
      { label: "Глубже 3 м", next: "r_strip" },
      { label: "1–3 м", next: "r_strip_drain" },
      { label: "Менее 1 м", next: "r_pile" },
    ],
  },
  q_frost: {
    id: "q_frost",
    text: "Какова глубина промерзания грунта в вашем регионе?",
    options: [
      { label: "До 1 м (юг)", next: "r_strip" },
      { label: "1–1.5 м (средняя полоса)", next: "r_strip_deep" },
      { label: "Более 1.5 м (север)", next: "r_pile" },
    ],
  },
};

const results: Record<string, Result> = {
  r_rock: {
    id: "r_rock",
    title: "Мелкозаглублённый ленточный фундамент",
    description: "Скальный грунт не промерзает и не пучится. Оптимальное решение — мелкозаглублённый фундамент.",
    icon: "CheckCircle",
    color: "emerald",
    items: [
      "Глубина заложения: 0.3–0.5 м",
      "Ширина ленты: не менее 300 мм",
      "Армирование: 4 прутка Ø12 А400",
      "Гидроизоляция: обязательна",
    ],
  },
  r_weak: {
    id: "r_weak",
    title: "Свайный или свайно-ростверковый фундамент",
    description: "Слабый грунт требует передачи нагрузки на более глубокие, надёжные слои через сваи.",
    icon: "AlertCircle",
    color: "orange",
    items: [
      "Тип свай: буронабивные или винтовые",
      "Длина свай: до несущего слоя + 0.5 м",
      "Шаг свай: 1.5–3 м",
      "Ростверк: монолитный ж/б или металл",
      "Обязательно геологическое исследование",
    ],
  },
  r_strip: {
    id: "r_strip",
    title: "Заглублённый ленточный фундамент",
    description: "Классическое решение для жилых домов на песчаных грунтах с низкими водами.",
    icon: "CheckCircle",
    color: "emerald",
    items: [
      "Глубина: ниже промерзания + 0.2 м",
      "Ширина: толщина стены + 100–200 мм",
      "Армирование: 4 прутка Ø16 А400",
      "Щебёночная подготовка 100–150 мм",
      "Гидроизоляция 2 слоя",
    ],
  },
  r_strip_drain: {
    id: "r_strip_drain",
    title: "Ленточный фундамент с дренажом",
    description: "Повышенный уровень грунтовых вод требует устройства дренажной системы.",
    icon: "Info",
    color: "blue",
    items: [
      "Глубина: ниже промерзания + 0.3 м",
      "Пристенный дренаж обязателен",
      "Гидроизоляция: обмазочная + рулонная",
      "Глиняный замок у подошвы фундамента",
      "Отмостка шириной не менее 1 м",
    ],
  },
  r_strip_deep: {
    id: "r_strip_deep",
    title: "Заглублённый ленточный фундамент (северный)",
    description: "Для средней полосы — фундамент ниже расчётной глубины промерзания.",
    icon: "CheckCircle",
    color: "emerald",
    items: [
      "Глубина: 1.5–1.8 м",
      "Утепление отмостки пенополистиролом",
      "Армирование усиленное: 6 прутков Ø16",
      "Засыпка пазух: непучинистый грунт",
    ],
  },
  r_pile: {
    id: "r_pile",
    title: "Свайно-ростверковый фундамент",
    description: "При высоком УГВ или глубоком промерзании — сваи передают нагрузку на надёжный слой.",
    icon: "Info",
    color: "blue",
    items: [
      "Винтовые или буронабивные сваи",
      "Глубина: ниже промерзания + несущий слой",
      "Ростверк: монолитный ж/б",
      "Зазор между ростверком и грунтом: 100–150 мм",
    ],
  },
  r_light: {
    id: "r_light",
    title: "Столбчатый или свайный фундамент",
    description: "Лёгкие каркасные постройки не требуют массивного фундамента.",
    icon: "CheckCircle",
    color: "emerald",
    items: [
      "Столбы 400×400 мм или винтовые сваи",
      "Глубина: ниже промерзания",
      "Шаг: по углам + через 2–3 м",
      "Ростверк деревянный 150×150 мм",
    ],
  },
  r_engineer: {
    id: "r_engineer",
    title: "Требуется инженерное проектирование",
    description: "Для сложных объектов необходимо профессиональное геологическое исследование и проект.",
    icon: "AlertTriangle",
    color: "orange",
    items: [
      "Заказать инженерно-геологические изыскания",
      "Разработать расчётную схему в ПО",
      "Получить проект у лицензированного проектировщика",
      "Согласовать с местными органами стройнадзора",
    ],
  },
};

const colorMap: Record<string, { border: string; bg: string; text: string; icon: string }> = {
  emerald: { border: "border-emerald-500/40", bg: "bg-emerald-500/10", text: "text-emerald-400", icon: "text-emerald-400" },
  orange: { border: "border-orange-500/40", bg: "bg-orange-500/10", text: "text-orange-400", icon: "text-orange-400" },
  blue: { border: "border-blue-500/40", bg: "bg-blue-500/10", text: "text-blue-400", icon: "text-blue-400" },
};

const SchemaPage = () => {
  const [history, setHistory] = useState<string[]>(["start"]);
  const [resultId, setResultId] = useState<string | null>(null);

  const currentId = history[history.length - 1];
  const currentQuestion = !resultId ? questions[currentId] : null;
  const currentResult = resultId ? results[resultId] : null;

  const handleOption = (next: string) => {
    if (results[next]) {
      setResultId(next);
    } else {
      setHistory([...history, next]);
    }
  };

  const handleBack = () => {
    if (resultId) {
      setResultId(null);
    } else if (history.length > 1) {
      setHistory(history.slice(0, -1));
    }
  };

  const handleReset = () => {
    setHistory(["start"]);
    setResultId(null);
  };

  const step = resultId ? history.length + 1 : history.length;

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="font-oswald text-4xl font-bold text-white mb-2">Интерактивная схема</h1>
          <p className="text-white/40">Ответьте на вопросы — получите конкретное решение</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {history.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                i < history.length ? "bg-orange-500" : "bg-white/10"
              }`}
            />
          ))}
          {resultId && <div className="h-1.5 w-6 rounded-full bg-emerald-500" />}
          <span className="text-white/40 text-xs ml-2">Шаг {step}</span>
        </div>

        {/* Question card */}
        {currentQuestion && (
          <div className="rounded-2xl border border-white/10 bg-white/3 p-8 animate-fade-in">
            <div className="flex items-start gap-3 mb-8">
              <div className="w-8 h-8 rounded-lg bg-orange-500/20 border border-orange-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-orange-400 text-sm font-bold">{step}</span>
              </div>
              <h2 className="font-oswald text-2xl font-bold text-white leading-tight">{currentQuestion.text}</h2>
            </div>

            <div className="grid gap-3">
              {currentQuestion.options.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => handleOption(opt.next)}
                  className="flex items-center gap-3 p-4 rounded-xl border border-white/10 bg-white/3 text-left hover:border-orange-500/50 hover:bg-orange-500/5 transition-all duration-200 group"
                >
                  {opt.icon && (
                    <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500/15 transition-colors">
                      <Icon name={opt.icon} size={18} className="text-white/50 group-hover:text-orange-400 transition-colors" />
                    </div>
                  )}
                  <span className="text-white/80 group-hover:text-white font-medium transition-colors">{opt.label}</span>
                  <Icon name="ChevronRight" size={16} className="ml-auto text-white/20 group-hover:text-orange-400 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Result card */}
        {currentResult && (
          <div className={`rounded-2xl border ${colorMap[currentResult.color].border} ${colorMap[currentResult.color].bg} p-8 animate-fade-in`}>
            <div className="flex items-start gap-3 mb-6">
              <Icon name={currentResult.icon} size={28} className={colorMap[currentResult.color].text} />
              <div>
                <div className={`text-xs font-medium uppercase tracking-wider mb-1 ${colorMap[currentResult.color].text}`}>Рекомендация</div>
                <h2 className="font-oswald text-2xl font-bold text-white">{currentResult.title}</h2>
              </div>
            </div>

            <p className="text-white/60 mb-6 leading-relaxed">{currentResult.description}</p>

            <div className="space-y-2.5">
              {currentResult.items.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className={`w-5 h-5 rounded-full border ${colorMap[currentResult.color].border} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${colorMap[currentResult.color].text.replace("text-", "bg-")}`} />
                  </div>
                  <span className="text-white/70 text-sm">{item}</span>
                </div>
              ))}
            </div>

            <button
              onClick={handleReset}
              className="mt-8 w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200 font-medium"
            >
              Пройти схему заново
            </button>
          </div>
        )}

        {/* Back button */}
        {(history.length > 1 || resultId) && (
          <button
            onClick={handleBack}
            className="flex items-center gap-2 mt-4 text-white/40 hover:text-white/70 transition-colors text-sm"
          >
            <Icon name="ArrowLeft" size={14} />
            Назад
          </button>
        )}
      </div>
    </div>
  );
};

export default SchemaPage;
