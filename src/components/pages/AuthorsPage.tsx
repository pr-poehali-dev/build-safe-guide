import { useState } from "react";
import Icon from "@/components/ui/icon";

type TabId = "norms" | "books" | "scientists";

const norms = [
  {
    code: "СП 20.13330.2022",
    title: "Нагрузки и воздействия",
    desc: "Основной документ по расчёту ветровых, снеговых, сейсмических и других нагрузок на строительные конструкции. Используется при определении ветровых нагрузок на небоскрёбы и расчёте динамических воздействий.",
    color: "orange",
    icon: "Wind",
  },
  {
    code: "СП 14.13330.2018",
    title: "Строительство в сейсмических районах",
    desc: "Требования к конструктивным системам зданий в зонах сейсмической активности. Определяет расчётные сейсмические нагрузки, типы конструктивных схем и методы расчёта на сейсмические воздействия.",
    color: "red",
    icon: "Activity",
  },
  {
    code: "СП 22.13330.2016",
    title: "Основания зданий и сооружений",
    desc: "Нормирует расчёт оснований по несущей способности и деформациям. Включает методику расчёта осадок фундаментов высотных зданий, допустимые неравномерности осадок, требования к геотехническому мониторингу.",
    color: "blue",
    icon: "Layers",
  },
  {
    code: "СП 24.13330.2021",
    title: "Свайные фундаменты",
    desc: "Проектирование свайных фундаментов для зданий любой высоты. Содержит требования к буронабивным сваям большого диаметра (Ø800–1500 мм), применяемым в фундаментах небоскрёбов.",
    color: "emerald",
    icon: "TrendingDown",
  },
  {
    code: "СП 63.13330.2018",
    title: "Бетонные и железобетонные конструкции",
    desc: "Расчёт ж/б конструкций на прочность, жёсткость и трещиностойкость. Регулирует применение высокопрочного бетона B60–B100, используемого в ядрах жёсткости небоскрёбов.",
    color: "violet",
    icon: "Box",
  },
  {
    code: "ГОСТ Р 27751-2014",
    title: "Надёжность строительных конструкций",
    desc: "Устанавливает классы ответственности конструкций (КС-1, КС-2, КС-3) и требования к расчёту на прогрессирующее обрушение. Небоскрёбы относятся к КС-3 — высшей категории ответственности.",
    color: "orange",
    icon: "ShieldCheck",
  },
  {
    code: "СП 116.13330.2012",
    title: "Инженерная защита от опасных геологических процессов",
    desc: "Требования к защите зданий и сооружений от карста, оползней, селей и других опасных геологических явлений. Используется при проектировании в сложных геологических условиях.",
    color: "blue",
    icon: "Mountain",
  },
  {
    code: "СП 368.1325800.2017",
    title: "Здания жилые и общественные высотные. Правила проектирования",
    desc: "Специализированный свод правил для зданий высотой свыше 75 м. Содержит требования к конструктивным системам, пожарной безопасности, инженерным системам и эвакуации высотных зданий.",
    color: "emerald",
    icon: "Building2",
  },
  {
    code: "ISO 10137:2007",
    title: "Комфорт при вибрационных воздействиях (ISO)",
    desc: "Международный стандарт по оценке комфорта людей в зданиях при вибрациях. Задаёт допустимые уровни ускорений верхних этажей небоскрёбов: не более 10–25 мilli-g при ветровых воздействиях.",
    color: "violet",
    icon: "Gauge",
  },
];

const books = [
  {
    author: "Хан Ф.Р., Скиллинг Д.",
    title: "Конструктивные системы высотных зданий",
    year: "1972–1980",
    desc: "Фундаментальные работы по трубчатым конструктивным системам небоскрёбов. Хан разработал концепцию «framed tube» и «bundled tube», применённую в башнях Sears Tower и Willis Tower. Является основой современного проектирования суперсверхвысоких зданий.",
    color: "orange",
    icon: "BookOpen",
  },
  {
    author: "Бирбраер А.Н., Роледер А.Ю.",
    title: "Экстремальные воздействия на сооружения",
    year: "2009",
    desc: "Монография посвящена расчёту строительных конструкций на экстремальные воздействия: взрывы, удары, прогрессирующее обрушение. Используется при проектировании зданий КС-3 по методологии ГОСТ Р 27751.",
    color: "red",
    icon: "BookOpen",
  },
  {
    author: "Мэрфи Р.К., Хан Ф.Р.",
    title: "The John Hancock Center — проектирование и строительство",
    year: "1969",
    desc: "Описание конструктивной системы одного из первых небоскрёбов с внешней связевой трубой (diagonally braced tube). Заложило принципы, по которым проектируются высотные здания с усиленными фасадными конструкциями.",
    color: "blue",
    icon: "BookOpen",
  },
  {
    author: "Трофименков Ю.Г., Воробков Л.Н.",
    title: "Полевые методы исследования строительных свойств грунтов",
    year: "1981",
    desc: "Классический российский справочник по инженерной геологии. Методики оценки несущей способности грунтов, проведения зондирования и испытания свай, используемые при изысканиях под фундаменты высотных зданий.",
    color: "emerald",
    icon: "BookOpen",
  },
  {
    author: "Смирнов В.А. и др.",
    title: "Высотные здания: конструктивные решения",
    year: "2007",
    desc: "Российское издание по проектированию несущих систем высотных зданий. Охватывает монолитные каркасы с ядрами жёсткости, применение высокопрочного бетона и стали, расчёт на ветровые и сейсмические воздействия.",
    color: "violet",
    icon: "BookOpen",
  },
  {
    author: "Taranath B.S.",
    title: "Structural Analysis and Design of Tall Buildings",
    year: "1988, 2012",
    desc: "Международный стандарт учебника по конструированию высотных зданий. Охватывает все аспекты: расчёт на ветер, сейсмику, ползучесть бетона, усадку, дифференциальные осадки. Базовая книга для инженеров-конструкторов небоскрёбов.",
    color: "orange",
    icon: "BookOpen",
  },
  {
    author: "Eurocode 8 (EN 1998)",
    title: "Проектирование сейсмостойких конструкций",
    year: "2004",
    desc: "Европейский стандарт сейсмостойкого строительства, широко применяемый как основа методологии. Содержит спектры реакции, методы расчёта и требования к конструктивным деталям для различных классов сейсмической опасности.",
    color: "blue",
    icon: "BookOpen",
  },
  {
    author: "CTBUH (Council on Tall Buildings and Urban Habitat)",
    title: "Best Practice Guidelines for Tall Buildings",
    year: "2008–2023",
    desc: "Серия руководств Совета по высотным зданиям и городской среде — главного международного органа в этой области. Охватывает аэродинамику, конструктивные системы, пожарную безопасность, устойчивость к прогрессирующему обрушению.",
    color: "emerald",
    icon: "BookOpen",
  },
];

const scientists = [
  {
    name: "Фазлур Рахман Хан",
    years: "1929–1982",
    role: "«Эйнштейн конструктивных систем»",
    country: "Бангладеш / США",
    contribution: "Разработал концепцию трубчатых конструктивных систем небоскрёбов: framed tube, bundled tube, braced tube. Его решения позволили строить здания 80–100+ этажей экономично и безопасно. Применены в Willis Tower (442 м) и John Hancock Center.",
    color: "orange",
    icon: "Award",
  },
  {
    name: "Карл Терцаги",
    years: "1883–1963",
    role: "Основоположник механики грунтов",
    country: "Австрия / США",
    contribution: "Разработал теорию консолидации грунтов и методику расчёта несущей способности оснований фундаментов. Его формула (уравнение Терцаги) лежит в основе всех современных расчётов фундаментов, включая СП 22.13330.",
    color: "blue",
    icon: "Award",
  },
  {
    name: "Роберт Мэйлар",
    years: "1872–1940",
    role: "Пионер железобетонных конструкций",
    country: "Швейцария",
    contribution: "Разработал безбалочные монолитные перекрытия и методику их расчёта. Безбалочные перекрытия стали стандартом для офисных небоскрёбов — применяются практически во всех современных высотных зданиях.",
    color: "emerald",
    icon: "Award",
  },
  {
    name: "Андрей Николаевич Зелинский",
    years: "1940–2015",
    role: "Ведущий российский специалист по сейсмостойкости",
    country: "СССР / Россия",
    contribution: "Внёс значительный вклад в разработку норм сейсмостойкого строительства в СССР и России. Его работы легли в основу действующего СП 14.13330 — «Строительство в сейсмических районах».",
    color: "violet",
    icon: "Award",
  },
  {
    name: "Харди Кросс",
    years: "1885–1959",
    role: "Создатель метода распределения моментов",
    country: "США",
    contribution: "Разработал метод итерационного распределения изгибающих моментов в рамных конструкциях (метод Кросса, 1930). Стал основой ручного расчёта несущих каркасов зданий до эпохи компьютеров и до сих пор используется для проверочных расчётов.",
    color: "orange",
    icon: "Award",
  },
  {
    name: "Николай Струнников и коллектив ЦНИИСК",
    years: "1960–2000-е",
    role: "Разработчики советских/российских строительных норм",
    country: "СССР / Россия",
    contribution: "Коллектив ЦНИИСК им. Кучеренко разработал методологическую базу советских СНиП, ставших прародителями современных российских СП. В частности — нормирование нагрузок и воздействий, которое легло в основу СП 20.13330.",
    color: "blue",
    icon: "Award",
  },
];

const colorMap: Record<string, { border: string; bg: string; text: string; badge: string }> = {
  orange: { border: "border-blue-500/25", bg: "bg-blue-500/6", text: "text-blue-400", badge: "bg-blue-500/15 text-blue-300 border-blue-500/25" },
  red: { border: "border-red-500/25", bg: "bg-red-500/6", text: "text-red-400", badge: "bg-red-500/15 text-red-300 border-red-500/25" },
  blue: { border: "border-blue-500/25", bg: "bg-blue-500/6", text: "text-blue-400", badge: "bg-blue-500/15 text-blue-300 border-blue-500/25" },
  emerald: { border: "border-emerald-500/25", bg: "bg-emerald-500/6", text: "text-emerald-400", badge: "bg-emerald-500/15 text-emerald-300 border-emerald-500/25" },
  violet: { border: "border-violet-500/25", bg: "bg-violet-500/6", text: "text-violet-400", badge: "bg-violet-500/15 text-violet-300 border-violet-500/25" },
};

const tabs: { id: TabId; label: string; icon: string; count: number }[] = [
  { id: "norms", label: "Нормативные документы", icon: "FileText", count: norms.length },
  { id: "books", label: "Книги и монографии", icon: "BookOpen", count: books.length },
  { id: "scientists", label: "Учёные и разработчики", icon: "FlaskConical", count: scientists.length },
];

const AuthorsPage = () => {
  const [activeTab, setActiveTab] = useState<TabId>("norms");
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="font-oswald text-4xl font-bold text-white mb-2">Источники и литература</h1>
          <p className="text-white/40 max-w-2xl mx-auto">
            Нормативные документы, научные труды и учёные, чьи работы легли в основу материалов инструкции
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => { setActiveTab(t.id); setExpanded(null); }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 ${
                activeTab === t.id
                  ? "bg-blue-500/15 border-blue-500/40 text-blue-400"
                  : "border-white/10 text-white/50 hover:text-white hover:border-white/20"
              }`}
            >
              <Icon name={t.icon} size={14} />
              {t.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-md ${activeTab === t.id ? "bg-blue-500/20 text-blue-300" : "bg-white/8 text-white/30"}`}>
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {/* Нормативные документы */}
        {activeTab === "norms" && (
          <div className="space-y-2.5">
            {norms.map((n, i) => {
              const cl = colorMap[n.color];
              const isOpen = expanded === `norm-${i}`;
              return (
                <div key={i} className={`rounded-xl border transition-all duration-200 ${isOpen ? `${cl.border} ${cl.bg}` : "border-white/8 bg-white/2 hover:border-white/15"}`}>
                  <button
                    className="w-full flex items-center gap-4 p-4 text-left"
                    onClick={() => setExpanded(isOpen ? null : `norm-${i}`)}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${cl.bg} border ${cl.border}`}>
                      <Icon name={n.icon} size={16} className={cl.text} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${cl.badge}`}>{n.code}</span>
                      </div>
                      <div className="font-oswald text-base font-bold text-white mt-1 leading-tight">{n.title}</div>
                    </div>
                    <Icon name="ChevronDown" size={16} className={`text-white/25 flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 animate-fade-in">
                      <p className="text-white/55 text-sm leading-relaxed">{n.desc}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Книги */}
        {activeTab === "books" && (
          <div className="space-y-2.5">
            {books.map((b, i) => {
              const cl = colorMap[b.color];
              const isOpen = expanded === `book-${i}`;
              return (
                <div key={i} className={`rounded-xl border transition-all duration-200 ${isOpen ? `${cl.border} ${cl.bg}` : "border-white/8 bg-white/2 hover:border-white/15"}`}>
                  <button
                    className="w-full flex items-center gap-4 p-4 text-left"
                    onClick={() => setExpanded(isOpen ? null : `book-${i}`)}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${cl.bg} border ${cl.border}`}>
                      <Icon name="BookOpen" size={16} className={cl.text} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-white/35 text-xs">{b.author}</span>
                        <span className={`text-xs px-2 py-0.5 rounded border ${cl.badge}`}>{b.year}</span>
                      </div>
                      <div className="font-oswald text-base font-bold text-white mt-0.5 leading-tight">{b.title}</div>
                    </div>
                    <Icon name="ChevronDown" size={16} className={`text-white/25 flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 animate-fade-in">
                      <p className="text-white/55 text-sm leading-relaxed">{b.desc}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Учёные */}
        {activeTab === "scientists" && (
          <div className="grid md:grid-cols-2 gap-4">
            {scientists.map((s, i) => {
              const cl = colorMap[s.color];
              return (
                <div key={i} className={`rounded-2xl border ${cl.border} ${cl.bg} p-5`}>
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cl.bg} border ${cl.border}`}>
                      <Icon name={s.icon} size={18} className={cl.text} />
                    </div>
                    <div>
                      <h3 className="font-oswald text-lg font-bold text-white leading-tight">{s.name}</h3>
                      <div className="flex items-center gap-2 flex-wrap mt-0.5">
                        <span className={`text-xs font-medium ${cl.text}`}>{s.role}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-white/30 text-xs font-mono">{s.years}</span>
                    <span className="text-white/20">·</span>
                    <span className="text-white/30 text-xs">{s.country}</span>
                  </div>
                  <p className="text-white/55 text-xs leading-relaxed">{s.contribution}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-8 p-4 rounded-xl border border-white/8 bg-white/2 flex gap-3">
          <Icon name="Info" size={16} className="text-white/25 flex-shrink-0 mt-0.5" />
          <p className="text-white/35 text-xs leading-relaxed">
            Все нормативные документы приведены в редакциях, актуальных на 2024–2026 годы. Перед проектированием рекомендуется проверять действующие версии СП и ГОСТ на официальных ресурсах Минстроя России и Росстандарта.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthorsPage;