import Icon from "@/components/ui/icon";

const authors = [
  {
    name: "Алексей Громов",
    role: "Главный инженер-конструктор",
    desc: "15 лет опыта в проектировании жилых и промышленных объектов. Кандидат технических наук. Специализация: фундаменты и несущие конструкции.",
    icon: "HardHat",
    color: "orange",
    stats: [
      { label: "Проектов", value: "300+" },
      { label: "Лет опыта", value: "15" },
    ],
  },
  {
    name: "Мария Соколова",
    role: "Инженер-геотехник",
    desc: "Специалист по инженерной геологии и механике грунтов. Автор методик оценки несущей способности оснований для малоэтажного строительства.",
    icon: "Mountain",
    color: "blue",
    stats: [
      { label: "Изысканий", value: "500+" },
      { label: "Лет опыта", value: "12" },
    ],
  },
  {
    name: "Дмитрий Лебедев",
    role: "Нормировщик, ГОСТ/СП",
    desc: "Эксперт по строительным нормам и правилам. Участвовал в разработке ряда национальных стандартов. Обеспечивает актуальность нормативной базы проекта.",
    icon: "BookOpen",
    color: "violet",
    stats: [
      { label: "НД изучено", value: "200+" },
      { label: "Лет опыта", value: "18" },
    ],
  },
];

const colorMap: Record<string, { border: string; bg: string; text: string; icon: string }> = {
  orange: { border: "border-orange-500/30", bg: "bg-orange-500/8", text: "text-orange-400", icon: "from-orange-500 to-amber-400" },
  blue: { border: "border-blue-500/30", bg: "bg-blue-500/8", text: "text-blue-400", icon: "from-blue-500 to-cyan-400" },
  violet: { border: "border-violet-500/30", bg: "bg-violet-500/8", text: "text-violet-400", icon: "from-violet-500 to-purple-400" },
};

const partners = [
  { name: "НИИЖБ им. А.А. Гвоздева", icon: "Building2" },
  { name: "СПбГАСУ", icon: "GraduationCap" },
  { name: "ЦНИИС", icon: "FlaskConical" },
  { name: "СТО НОСТРОЙ", icon: "Award" },
];

const AuthorsPage = () => {
  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-oswald text-4xl font-bold text-white mb-2">О проекте и авторах</h1>
          <p className="text-white/40 max-w-xl mx-auto">
            СтройРасчёт — открытый образовательный инструмент для расчёта строительных конструкций, созданный инженерами для практиков
          </p>
        </div>

        {/* About project */}
        <div className="rounded-2xl border border-white/10 bg-white/3 p-7 mb-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <h2 className="font-oswald text-2xl font-bold text-white mb-3">О проекте</h2>
              <p className="text-white/60 text-sm leading-relaxed mb-4">
                Проект создан с целью помочь застройщикам, прорабам и студентам строительных специальностей быстро ориентироваться в расчётах и нормативной базе. Все алгоритмы разработаны в соответствии с действующими СП, ГОСТ и ТСН.
              </p>
              <p className="text-white/60 text-sm leading-relaxed">
                Инструмент не заменяет профессиональное проектирование — он помогает принимать обоснованные решения на предварительном этапе и правильно ставить задачи инженерам.
              </p>
            </div>
            <div className="space-y-3">
              {[
                { label: "Версия", value: "1.0", icon: "Tag" },
                { label: "Обновлено", value: "2026", icon: "Calendar" },
                { label: "Нормативная база", value: "СП 2024", icon: "FileText" },
                { label: "Лицензия", value: "Открытая", icon: "Unlock" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/8">
                  <Icon name={item.icon} size={14} className="text-white/30" />
                  <span className="text-white/40 text-xs flex-1">{item.label}</span>
                  <span className="text-white/70 text-xs font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Authors */}
        <h2 className="font-oswald text-2xl font-bold text-white mb-5">Команда авторов</h2>
        <div className="grid md:grid-cols-3 gap-4 mb-10">
          {authors.map((a) => {
            const cl = colorMap[a.color];
            return (
              <div key={a.name} className={`rounded-2xl border ${cl.border} ${cl.bg} p-5`}>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cl.icon} flex items-center justify-center mb-4`}>
                  <Icon name={a.icon} size={22} className="text-black" />
                </div>
                <h3 className="font-oswald text-lg font-bold text-white mb-0.5">{a.name}</h3>
                <div className={`text-xs font-medium mb-3 ${cl.text}`}>{a.role}</div>
                <p className="text-white/50 text-xs leading-relaxed mb-4">{a.desc}</p>
                <div className="flex gap-3">
                  {a.stats.map((s) => (
                    <div key={s.label} className="text-center flex-1">
                      <div className={`font-oswald text-xl font-bold ${cl.text}`}>{s.value}</div>
                      <div className="text-white/30 text-xs">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Partners */}
        <h2 className="font-oswald text-2xl font-bold text-white mb-4">Партнёры и использованные стандарты</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {partners.map((p) => (
            <div key={p.name} className="flex flex-col items-center gap-2 p-4 rounded-xl border border-white/10 bg-white/3 text-center">
              <Icon name={p.icon} size={20} className="text-white/30" />
              <span className="text-white/50 text-xs leading-tight">{p.name}</span>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5 flex gap-3">
          <Icon name="TriangleAlert" size={16} className="text-yellow-400/60 flex-shrink-0 mt-0.5" />
          <p className="text-white/40 text-xs leading-relaxed">
            Расчёты носят справочный характер. Для получения официальной проектной документации необходимо обращаться к лицензированным организациям. Авторы не несут ответственности за решения, принятые на основе данного инструмента без профессиональной экспертизы.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthorsPage;
