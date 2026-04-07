import { useState } from "react";
import Icon from "@/components/ui/icon";

interface Question {
  id: string;
  text: string;
  subtitle?: string;
  options: { label: string; desc?: string; next: string; icon?: string }[];
}

interface ActionStep {
  phase: string;
  title: string;
  actions: string[];
  norm?: string;
  critical?: boolean;
}

interface Result {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  riskLevel: "low" | "medium" | "high" | "extreme";
  color: string;
  icon: string;
  summary: { label: string; value: string }[];
  steps: ActionStep[];
  warnings: string[];
}

/* ─────────────────────────────────────────────
   ДЕРЕВО ВОПРОСОВ
───────────────────────────────────────────── */
const questions: Record<string, Question> = {
  start: {
    id: "start",
    text: "Сколько этажей планируется в здании?",
    subtitle: "Высота — ключевой фактор, определяющий всю систему безопасности",
    options: [
      { label: "10–25 этажей", desc: "Высотное здание (до ~100 м)", next: "q_soil", icon: "Building2" },
      { label: "25–50 этажей", desc: "Небоскрёб (~100–200 м)", next: "q_soil", icon: "Building" },
      { label: "50–100 этажей", desc: "Сверхвысокое здание (~200–400 м)", next: "q_soil", icon: "TowerControl" },
      { label: "Более 100 этажей", desc: "Мегаструктура (400+ м)", next: "q_soil", icon: "Landmark" },
    ],
  },
  q_soil: {
    id: "q_soil",
    text: "Каков тип грунта на площадке строительства?",
    subtitle: "Грунт определяет тип фундамента и максимально допустимую нагрузку",
    options: [
      { label: "Скальный / Полускальный", desc: "R > 500 кПа — наилучшее основание", next: "q_seismic", icon: "Mountain" },
      { label: "Гравий / Плотный песок", desc: "R = 200–350 кПа — хорошее основание", next: "q_seismic", icon: "Layers" },
      { label: "Суглинок / Супесь", desc: "R = 150–250 кПа — требует проверки", next: "q_water", icon: "AlignJustify" },
      { label: "Мягкая глина / Торф", desc: "R < 100 кПа — сложные условия", next: "q_water", icon: "AlertTriangle" },
    ],
  },
  q_water: {
    id: "q_water",
    text: "Какой уровень грунтовых вод?",
    subtitle: "Влияет на конструкцию фундамента, гидроизоляцию и устойчивость основания",
    options: [
      { label: "Глубже 10 м", desc: "Некритично для глубокого фундамента", next: "q_seismic" },
      { label: "5–10 м", desc: "Требует гидроизоляции и дренажа", next: "q_seismic" },
      { label: "Менее 5 м", desc: "Серьёзные ограничения для котлована", next: "q_seismic" },
    ],
  },
  q_seismic: {
    id: "q_seismic",
    text: "Какова сейсмическая активность района?",
    subtitle: "По картам ОСР-2015 / Еврокод 8 — определяет тип конструктивной системы",
    options: [
      { label: "Менее 6 баллов (MSK)", desc: "Асейсмичный район — нет особых требований", next: "q_wind", icon: "ShieldCheck" },
      { label: "6–7 баллов", desc: "Умеренная сейсмика — усиленное армирование", next: "q_wind", icon: "Activity" },
      { label: "7–8 баллов", desc: "Высокая сейсмика — специальная конструктивная схема", next: "q_wind", icon: "Zap" },
      { label: "8–9 баллов и выше", desc: "Экстремальная сейсмика — максимальная защита", next: "q_wind", icon: "AlertOctagon" },
    ],
  },
  q_wind: {
    id: "q_wind",
    text: "Какова ветровая нагрузка в регионе?",
    subtitle: "Ветер — критический фактор для зданий выше 50 м. Определяет профиль и жёсткость",
    options: [
      { label: "I–II ветровой район", desc: "w₀ ≤ 0.48 кПа (Центральная Россия)", next: "q_material", icon: "Wind" },
      { label: "III–IV ветровой район", desc: "w₀ = 0.48–0.73 кПа (Поволжье, Сибирь)", next: "q_material", icon: "Wind" },
      { label: "V–VII ветровой район", desc: "w₀ = 0.73–1.47 кПа (побережья, горы)", next: "q_material", icon: "Tornado" },
    ],
  },
  q_material: {
    id: "q_material",
    text: "Какая основная конструктивная система?",
    subtitle: "Выбор несущей системы — ключевое инженерное решение для небоскрёба",
    options: [
      { label: "Монолитный железобетонный каркас", desc: "Наиболее распространён в России", next: "q_special", icon: "Box" },
      { label: "Стальной каркас + ж/б ядро", desc: "Быстрый монтаж, гибкость планировок", next: "q_special", icon: "Layers" },
      { label: "Комбинированная (гибридная)", desc: "Стальные мегаколонны + ж/б перекрытия", next: "q_special", icon: "GitMerge" },
      { label: "Стальные трубчатые структуры", desc: "Для зданий 60+ этажей (система Хана)", next: "q_special", icon: "Columns" },
    ],
  },
  q_special: {
    id: "q_special",
    text: "Какие особые природные явления характерны для района?",
    subtitle: "Дополнительные факторы, влияющие на конструктивные решения",
    options: [
      { label: "Нет особых факторов", desc: "Стандартные климатические условия", next: "r_standard", icon: "CheckCircle" },
      { label: "Карстовые полости / просадочные грунты", desc: "Риск провалов и неравномерных осадок", next: "r_karst", icon: "CircleDashed" },
      { label: "Оползневая зона / сели", desc: "Риск смещения грунтового массива", next: "r_landslide", icon: "MoveDown" },
      { label: "Техногенные воздействия", desc: "Вибрация от метро, производства", next: "r_technogenic", icon: "Drill" },
    ],
  },
};

/* ─────────────────────────────────────────────
   РЕЗУЛЬТАТЫ С ПОШАГОВЫМ ПЛАНОМ
───────────────────────────────────────────── */
const results: Record<string, Result> = {
  r_standard: {
    id: "r_standard",
    title: "Стандартная программа проектирования небоскрёба",
    subtitle: "Комплексный план для высотного строительства в нормальных условиях",
    description: "На основе ваших ответов сформирован полный план действий для безопасного проектирования и строительства высотного здания в соответствии с российскими и международными нормами.",
    riskLevel: "medium",
    color: "blue",
    icon: "Building2",
    summary: [
      { label: "Тип фундамента", value: "Глубокие буронабивные сваи / «стена в грунте»" },
      { label: "Конструктивная система", value: "Монолит + стальной каркас с ж/б ядром" },
      { label: "Ветрозащита", value: "Аэродинамическое профилирование фасада" },
      { label: "Сейсмика", value: "Усиленное армирование узлов, демпферы" },
      { label: "Нормативная база", value: "СП 20, СП 22, СП 63, СП 14, ГОСТ 27751" },
    ],
    steps: [
      {
        phase: "Фаза 1",
        title: "Предпроектные изыскания (6–12 месяцев)",
        critical: true,
        norm: "СП 11-105-97, ГОСТ Р 58033",
        actions: [
          "Заказать комплексные инженерно-геологические изыскания на глубину не менее 1.5× от ширины фундамента",
          "Провести инженерно-геодезические изыскания: топосъёмка, разбивочный план",
          "Выполнить инженерно-гидрологические изыскания: уровень, химсостав, агрессивность грунтовых вод",
          "Заказать аэрологические исследования: замеры скоростей ветра на высотах 10–500 м",
          "Провести аэродинамические испытания макета здания в аэродинамической трубе (при h > 100 м)",
          "Выполнить сейсмическое микрорайонирование площадки (СП 14.13330.2018)",
          "Собрать данные по техногенным воздействиям: метро, вибрация, электромагнитные поля",
        ],
      },
      {
        phase: "Фаза 2",
        title: "Концептуальное и предварительное проектирование",
        norm: "СП 368.1325800, МГСН 4.04",
        actions: [
          "Выбрать конструктивную схему здания: каркасная, ядровая, трубчатая или гибридная",
          "Разработать компоновочную схему несущей системы с учётом аэродинамики формы",
          "Рассчитать предварительные нагрузки на фундамент: постоянные, временные, сейсмические, ветровые",
          "Определить тип и глубину фундамента — для небоскрёбов обычно ≥ 20–40 м буронабивные сваи Ø800–1500 мм",
          "Оценить осадку фундамента: допустимая неравномерность ≤ 0.002 (по СП 22.13330)",
          "Провести концептуальный расчёт на прогрессирующее обрушение (ГОСТ Р 27751)",
          "Выбрать класс бетона: для ядра и колонн — B60–B100, перекрытия — B30–B45",
        ],
      },
      {
        phase: "Фаза 3",
        title: "Расчёт ветровых и сейсмических воздействий",
        critical: true,
        norm: "СП 20.13330.2022, СП 14.13330.2018",
        actions: [
          "Построить расчётную конечно-элементную модель здания (ETABS, SCAD, Лира-САПР или Tekla Structural Designer)",
          "Выполнить динамический расчёт на ветровые нагрузки с учётом пульсационной составляющей",
          "Проверить перемещения верхушки здания: допустимый дрейф ≤ H/500 от ветра, ≤ H/300 от сейсмики",
          "Рассчитать межэтажные перемещения: ≤ h/300–h/500 для защиты перегородок и фасадов",
          "Подобрать систему демпфирования: TMD (настроенный демпфер массы), вязкостные демпферы или жидкостные",
          "Выполнить расчёт на усталость для стальных элементов при циклическом ветровом воздействии",
          "Проверить комфорт людей на верхних этажах: пиковое ускорение ≤ 10–25 мг (мilli-g) по ISO 10137",
        ],
      },
      {
        phase: "Фаза 4",
        title: "Проектирование фундамента и подземной части",
        critical: true,
        norm: "СП 22.13330.2016, СП 24.13330.2021",
        actions: [
          "Запроектировать высокопрочную плиту-ростверк: толщина 3–6 м, бетон B40–B60",
          "Разместить буронабивные сваи: диаметр 800–1500 мм, длина до коренных пород",
          "Предусмотреть «стену в грунте» для котлована глубиной > 10 м — метод «Top-Down» при стеснённых условиях",
          "Устроить многоуровневую гидроизоляцию: кристаллизационная + рулонная + инъекционная",
          "Запроектировать систему мониторинга осадок фундамента: датчики на период строительства и эксплуатации",
          "Предусмотреть анкерные плиты или контрфорсы при наличии подвальных этажей под грунтовыми водами",
          "Рассчитать подъёмное давление воды (архимедова сила) на заглублённую часть здания",
        ],
      },
      {
        phase: "Фаза 5",
        title: "Конструктив надземной части",
        norm: "СП 63.13330.2018, СП 20.13330.2022",
        actions: [
          "Запроектировать центральное ж/б ядро жёсткости с толщиной стен 400–800 мм (уменьшается к верху)",
          "Разместить колонны по периметру: стальные или ж/б мегаколонны с шагом 6–12 м",
          "Предусмотреть outrigger-системы (консольные фермы) на технических этажах каждые 10–15 этажей",
          "Запроектировать монолитные перекрытия толщиной 200–300 мм с безбалочной схемой",
          "Предусмотреть деформационные швы в протяжённых корпусах",
          "Выбрать класс арматуры: A500C (свариваемая) для сейсмических районов",
          "Запроектировать антикоррозионную защиту стальных элементов: огнезащита EI60–EI120",
        ],
      },
      {
        phase: "Фаза 6",
        title: "Пожарная безопасность и эвакуация",
        critical: true,
        norm: "СП 1.13130.2020, СП 7.13130.2013, ФЗ-123",
        actions: [
          "Запроектировать незадымляемые лестничные клетки типа Н1 (через воздушную зону) или Н3",
          "Разместить пожарные лифты: не менее 2 на секцию с электропитанием от двух независимых источников",
          "Предусмотреть зоны безопасности (refuges) каждые 10–15 этажей для маломобильных групп",
          "Спроектировать систему дымоудаления: подпор воздуха в лестницах ≥ 20 Па, вытяжка с каждого этажа",
          "Предусмотреть систему АУПТ (автоматического пожаротушения) во всех помещениях",
          "Обеспечить огнестойкость несущих конструкций R120–R240 (в зависимости от высоты)",
          "Запроектировать центральный пожарный пост с системой управления эвакуацией",
        ],
      },
      {
        phase: "Фаза 7",
        title: "Инженерные системы и мониторинг",
        norm: "СП 60.13330.2020, ГОСТ Р 22.1.12",
        actions: [
          "Установить систему структурного мониторинга (SHM): датчики ускорений, деформаций, кренов",
          "Запроектировать систему активного демпфирования при динамических воздействиях",
          "Предусмотреть резервное электроснабжение: дизель-генераторы + ИБП для критических систем",
          "Спроектировать систему молниезащиты класса I по ГОСТ Р МЭК 62305",
          "Установить метеостанцию на крыше: мониторинг ветра, обледенения, температуры",
          "Предусмотреть вертолётную площадку (при h > 150 м) или систему аварийного снижения",
          "Разработать план мероприятий по техническому обслуживанию фасада (BMU — gondola system)",
        ],
      },
      {
        phase: "Фаза 8",
        title: "Согласования, экспертиза и надзор",
        critical: true,
        norm: "Градостроительный кодекс РФ, 384-ФЗ",
        actions: [
          "Пройти государственную экспертизу проектной документации (обязательно для высотных зданий)",
          "Согласовать отступления от норм через специальные технические условия (СТУ) в Минстрое",
          "Получить заключения: МЧС, Роспотребнадзор, органы охраны памятников (при необходимости)",
          "Организовать авторский надзор главного инженера проекта на весь период строительства",
          "Назначить технический надзор заказчика с правом остановки работ",
          "Вести журнал мониторинга деформаций соседних зданий в зоне влияния котлована",
          "После завершения провести обследование и получить разрешение на ввод в эксплуатацию",
        ],
      },
    ],
    warnings: [
      "Проектирование зданий выше 75 м требует разработки СТУ (специальных технических условий)",
      "Аэродинамические испытания в трубе обязательны для зданий h > 100 м и нестандартной формы",
      "Расчёт на прогрессирующее обрушение обязателен по ГОСТ Р 27751 для зданий КС-3",
    ],
  },

  r_karst: {
    id: "r_karst",
    title: "Небоскрёб в зоне карста и просадочных грунтов",
    subtitle: "Повышенные требования к фундаменту и мониторингу основания",
    description: "Карстовые полости и просадочные грунты создают риск неравномерных осадок и провалов. Требуется специальная программа изысканий и конструктивных мероприятий.",
    riskLevel: "high",
    color: "orange",
    icon: "AlertTriangle",
    summary: [
      { label: "Основной риск", value: "Провал основания, неравномерные осадки" },
      { label: "Фундамент", value: "Сваи до коренных непросадочных пород" },
      { label: "Грунтоукрепление", value: "Цементация, jet-grouting полостей" },
      { label: "Мониторинг", value: "Постоянный, с автоматической сигнализацией" },
    ],
    steps: [
      {
        phase: "Фаза 1",
        title: "Специальные изыскания в карстовой зоне",
        critical: true,
        norm: "СП 116.13330.2012, ГОСТ Р 27751",
        actions: [
          "Провести комплексные геофизические исследования: сейсморазведка, электротомография, ГПР для выявления полостей",
          "Выполнить буровые работы увеличенного объёма: шаг скважин ≤ 5 м на территории застройки",
          "Определить коэффициент суффозионной сжимаемости и риск образования новых полостей",
          "Установить наблюдательную сеть скважин и реперов до начала любых работ",
          "Оценить карстовую опасность по методике ВСН 490-87 или аналогу",
        ],
      },
      {
        phase: "Фаза 2",
        title: "Укрепление основания и ликвидация полостей",
        critical: true,
        norm: "СП 22.13330.2016 прил. Д",
        actions: [
          "Выполнить тампонирование и цементацию всех выявленных карстовых полостей",
          "Применить технологию jet-grouting для укрепления слабых грунтов в зоне фундамента",
          "Устроить цементационный экран по периметру фундаментной плиты",
          "Разработать мероприятия по предотвращению суффозии: дренажный контур с фильтрами",
          "Запроектировать конструктивно усиленную плиту-ростверк с перераспределением нагрузок при выпадении свай",
        ],
      },
      {
        phase: "Фаза 3",
        title: "Конструктивные меры и мониторинг",
        norm: "ГОСТ Р 22.1.12-2005",
        actions: [
          "Предусмотреть в конструктивной схеме резервирование: каждый несущий элемент должен иметь альтернативный путь передачи нагрузки",
          "Установить систему автоматического мониторинга: датчики осадок с передачей данных в реальном времени",
          "Разработать план аварийного реагирования при обнаружении критических деформаций",
          "Выполнять плановые геодезические наблюдения не реже 1 раза в квартал на весь срок эксплуатации",
          "Ввести ограничения на динамические нагрузки вблизи здания (запрет забивки свай, взрывных работ)",
        ],
      },
    ],
    warnings: [
      "Строительство в зоне интенсивного карста может потребовать отказа от данной площадки",
      "Все специальные технические решения требуют согласования в государственной экспертизе",
      "Мониторинг основания должен вестись в течение всего срока эксплуатации здания",
    ],
  },

  r_landslide: {
    id: "r_landslide",
    title: "Небоскрёб в оползневой зоне",
    subtitle: "Критические требования к стабилизации склона и защите основания",
    description: "Оползневые зоны и участки с риском селей требуют обязательной стабилизации склона перед началом строительства и постоянного мониторинга.",
    riskLevel: "extreme",
    color: "red",
    icon: "AlertOctagon",
    summary: [
      { label: "Основной риск", value: "Смещение массива, потеря несущей способности" },
      { label: "Приоритет №1", value: "Стабилизация склона до начала проектирования" },
      { label: "Фундамент", value: "Сваи с анкерным закреплением в устойчивых породах" },
      { label: "Заключение", value: "Обязательно: независимая геотехническая экспертиза" },
    ],
    steps: [
      {
        phase: "Фаза 0",
        title: "КРИТИЧНО: Оценка возможности строительства",
        critical: true,
        norm: "СП 116.13330.2012",
        actions: [
          "До любого проектирования: заказать независимую геотехническую экспертизу оползневой опасности",
          "Определить границы оползнеопасной зоны и проверить, попадает ли площадка в неё",
          "Оценить интенсивность и скорость оползневых процессов (активный / периодический / древний)",
          "Рассмотреть перенос площадки строительства — это наиболее безопасное решение",
          "При невозможности переноса — разработать программу противооползневых мероприятий",
        ],
      },
      {
        phase: "Фаза 1",
        title: "Противооползневые мероприятия",
        critical: true,
        norm: "СП 116.13330.2012, СНиП 2.06.15-85",
        actions: [
          "Устроить систему перехватывающего дренажа для снижения уровня грунтовых вод в склоне",
          "Запроектировать подпорные стены, контрфорсы или анкерные системы для удержания склона",
          "Выполнить пригрузку подножия склона или срезку верхней части для улучшения устойчивости",
          "Применить метод глубокого дренирования: дренажные штольни или скважины",
          "Засадить склон глубококорневыми растениями для дополнительного армирования грунта",
        ],
      },
      {
        phase: "Фаза 2",
        title: "Конструктив и мониторинг",
        norm: "ГОСТ Р 22.1.12, СП 22.13330",
        actions: [
          "Запроектировать сваи-анкеры, уходящие в устойчивые коренные породы ниже плоскости скольжения",
          "Предусмотреть жёсткий монолитный ростверк, работающий как единая плита на упругом основании",
          "Установить инклинометры и экстензометры для мониторинга горизонтальных смещений склона",
          "Разработать систему раннего предупреждения с автоматической сигнализацией при превышении порогов",
          "Обеспечить круглосуточный геотехнический мониторинг в период строительства",
        ],
      },
    ],
    warnings: [
      "КРИТИЧНО: строительство в активной оползневой зоне крайне не рекомендуется",
      "Сели и оползни могут развиваться стремительно — требуется план экстренной эвакуации",
      "Страховые компании могут отказать в страховании объекта в зоне оползневой опасности",
    ],
  },

  r_technogenic: {
    id: "r_technogenic",
    title: "Небоскрёб в зоне техногенных воздействий",
    subtitle: "Защита от вибрации, электромагнитных полей и динамических нагрузок",
    description: "Вибрации от метро, промышленных предприятий и транспорта могут вызывать усталостные разрушения конструкций и дискомфорт для пользователей.",
    riskLevel: "medium",
    color: "violet",
    icon: "Activity",
    summary: [
      { label: "Основные источники", value: "Метро, железная дорога, промпредприятия" },
      { label: "Защита", value: "Виброизоляция фундамента, демпферы" },
      { label: "Расчёт", value: "Динамический анализ с учётом вынужденных колебаний" },
      { label: "Нормы", value: "СП 26.13330, ГОСТ 31191, ISO 4866" },
    ],
    steps: [
      {
        phase: "Фаза 1",
        title: "Исследование техногенных воздействий",
        norm: "ГОСТ 31191-2004, ISO 4866",
        actions: [
          "Провести измерения вибрации на площадке: 24-часовой мониторинг с частотным анализом",
          "Определить частоты и амплитуды вибраций от каждого источника",
          "Оценить электромагнитную обстановку при наличии линий электропередачи высокого напряжения",
          "Исследовать возможность резонанса вибраций с собственными частотами здания",
        ],
      },
      {
        phase: "Фаза 2",
        title: "Виброзащита конструкций",
        critical: true,
        norm: "СП 26.13330.2012",
        actions: [
          "Запроектировать виброизолирующий фундамент: пружинные или резинометаллические виброизоляторы",
          "Разнести собственные частоты здания и частоты вынуждающих колебаний не менее чем в 2 раза",
          "Установить вязкостные демпферы в узлах несущего каркаса для поглощения динамической энергии",
          "Предусмотреть деформационные швы в местах примыкания к источникам вибрации",
          "Проверить допустимые уровни вибрации для жилых помещений: ≤ 92 дБ по ГОСТ 31191",
        ],
      },
      {
        phase: "Фаза 3",
        title: "Мониторинг и техническое обслуживание",
        norm: "ГОСТ Р 22.1.12",
        actions: [
          "Установить постоянную систему мониторинга вибраций в фундаменте и на нескольких этажах",
          "Разработать регламент технического обслуживания виброизоляторов (замена каждые 20–30 лет)",
          "Вести журнал событий: фиксировать все нештатные вибрационные воздействия",
          "Проводить плановые обследования несущих конструкций на предмет усталостных трещин",
        ],
      },
    ],
    warnings: [
      "Резонанс вибраций с собственными частотами здания может привести к катастрофическим последствиям",
      "При строительстве вблизи метро необходимо согласование с метрополитеном",
    ],
  },
};

/* ─────────────────────────────────────────────
   ЦВЕТОВЫЕ СХЕМЫ
───────────────────────────────────────────── */
const colorMap: Record<string, { border: string; bg: string; text: string; badge: string; dot: string }> = {
  blue: { border: "border-blue-500/40", bg: "bg-blue-500/8", text: "text-blue-400", badge: "bg-blue-500/20 text-blue-300", dot: "bg-blue-500" },
  orange: { border: "border-orange-500/40", bg: "bg-orange-500/8", text: "text-orange-400", badge: "bg-orange-500/20 text-orange-300", dot: "bg-orange-500" },
  red: { border: "border-red-500/40", bg: "bg-red-500/8", text: "text-red-400", badge: "bg-red-500/20 text-red-300", dot: "bg-red-500" },
  violet: { border: "border-violet-500/40", bg: "bg-violet-500/8", text: "text-violet-400", badge: "bg-violet-500/20 text-violet-300", dot: "bg-violet-500" },
};

const riskLabels: Record<string, { label: string; color: string }> = {
  low: { label: "Низкий риск", color: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30" },
  medium: { label: "Средний риск", color: "text-blue-400 bg-blue-500/15 border-blue-500/30" },
  high: { label: "Высокий риск", color: "text-orange-400 bg-orange-500/15 border-orange-500/30" },
  extreme: { label: "Экстремальный риск", color: "text-red-400 bg-red-500/15 border-red-500/30" },
};

/* ─────────────────────────────────────────────
   КОМПОНЕНТ РЕЗУЛЬТАТА
───────────────────────────────────────────── */
const ResultView = ({ result, onReset }: { result: Result; onReset: () => void }) => {
  const [openStep, setOpenStep] = useState<number | null>(null);
  const cl = colorMap[result.color];
  const risk = riskLabels[result.riskLevel];

  return (
    <div className="animate-fade-in space-y-5">
      {/* Header */}
      <div className={`rounded-2xl border ${cl.border} ${cl.bg} p-6`}>
        <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cl.bg} border ${cl.border}`}>
              <Icon name={result.icon} size={20} className={cl.text} />
            </div>
            <div>
              <div className={`text-xs font-medium uppercase tracking-wider mb-0.5 ${cl.text}`}>Рекомендация сформирована</div>
              <h2 className="font-oswald text-xl font-bold text-white leading-tight">{result.title}</h2>
            </div>
          </div>
          <span className={`text-xs font-medium px-3 py-1 rounded-full border ${risk.color}`}>{risk.label}</span>
        </div>
        <p className="text-white/55 text-sm leading-relaxed">{result.description}</p>
      </div>

      {/* Summary */}
      <div className="rounded-2xl border border-white/10 bg-white/3 p-5">
        <h3 className="font-oswald text-base font-bold text-white mb-4 flex items-center gap-2">
          <Icon name="ClipboardList" size={16} className="text-white/30" />
          Ключевые параметры
        </h3>
        <div className="grid sm:grid-cols-2 gap-2">
          {result.summary.map((s, i) => (
            <div key={i} className="flex justify-between gap-3 py-2 px-3 rounded-lg bg-white/3 border border-white/5">
              <span className="text-white/40 text-xs">{s.label}</span>
              <span className="text-white/80 text-xs font-medium text-right">{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Steps */}
      <div>
        <h3 className="font-oswald text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Icon name="ListChecks" size={18} className="text-orange-400" />
          Пошаговый план действий
          <span className="text-xs font-normal text-white/30 ml-1">({result.steps.length} фаз)</span>
        </h3>

        <div className="space-y-2">
          {result.steps.map((step, i) => {
            const isOpen = openStep === i;
            return (
              <div
                key={i}
                className={`rounded-xl border transition-all duration-200 ${
                  isOpen
                    ? step.critical ? "border-orange-500/40 bg-orange-500/5" : "border-white/20 bg-white/5"
                    : "border-white/8 bg-white/2 hover:border-white/15"
                }`}
              >
                <button
                  className="w-full flex items-center gap-3 p-4 text-left"
                  onClick={() => setOpenStep(isOpen ? null : i)}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold font-oswald ${
                    step.critical ? "bg-orange-500/20 text-orange-400 border border-orange-500/30" : "bg-white/8 text-white/50 border border-white/10"
                  }`}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white/30 text-xs font-medium">{step.phase}</span>
                      {step.critical && (
                        <span className="text-orange-400 text-xs font-medium bg-orange-500/10 px-1.5 py-0.5 rounded border border-orange-500/20">КРИТИЧНО</span>
                      )}
                    </div>
                    <div className="font-oswald text-base font-bold text-white leading-tight">{step.title}</div>
                    {step.norm && (
                      <div className="text-white/25 text-xs mt-0.5 font-mono">{step.norm}</div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-white/20 text-xs">{step.actions.length} действий</span>
                    <Icon
                      name="ChevronDown"
                      size={16}
                      className={`text-white/30 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 animate-fade-in">
                    <div className="space-y-2">
                      {step.actions.map((action, j) => (
                        <div key={j} className="flex items-start gap-3 p-2.5 rounded-lg bg-white/3 border border-white/5">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold ${
                            step.critical ? "bg-orange-500/20 text-orange-400" : "bg-white/8 text-white/40"
                          }`}>
                            {j + 1}
                          </div>
                          <span className="text-white/70 text-sm leading-relaxed">{action}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Warnings */}
      {result.warnings.length > 0 && (
        <div className="rounded-xl border border-yellow-500/25 bg-yellow-500/5 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Icon name="TriangleAlert" size={16} className="text-yellow-400" />
            <span className="text-yellow-400 text-sm font-medium">Важные предупреждения</span>
          </div>
          <div className="space-y-2">
            {result.warnings.map((w, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="w-1 h-1 rounded-full bg-yellow-500/60 mt-2 flex-shrink-0" />
                <p className="text-white/50 text-xs leading-relaxed">{w}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={onReset}
        className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/8 transition-all duration-200 font-medium flex items-center justify-center gap-2"
      >
        <Icon name="RotateCcw" size={14} />
        Пройти схему заново
      </button>
    </div>
  );
};

/* ─────────────────────────────────────────────
   ГЛАВНЫЙ КОМПОНЕНТ
───────────────────────────────────────────── */
const TOTAL_STEPS = 7;

const SchemaPage = () => {
  const [history, setHistory] = useState<string[]>(["start"]);
  const [answers, setAnswers] = useState<{ question: string; answer: string }[]>([]);
  const [resultId, setResultId] = useState<string | null>(null);

  const currentId = history[history.length - 1];
  const currentQuestion = !resultId ? questions[currentId] : null;
  const currentResult = resultId ? results[resultId] : null;

  const handleOption = (next: string, label: string) => {
    const newAnswers = [...answers, { question: questions[currentId]?.text || "", answer: label }];
    setAnswers(newAnswers);
    if (results[next]) {
      setResultId(next);
    } else {
      setHistory([...history, next]);
    }
  };

  const handleBack = () => {
    if (resultId) {
      setResultId(null);
      setAnswers(answers.slice(0, -1));
    } else if (history.length > 1) {
      setHistory(history.slice(0, -1));
      setAnswers(answers.slice(0, -1));
    }
  };

  const handleReset = () => {
    setHistory(["start"]);
    setAnswers([]);
    setResultId(null);
  };

  const step = history.length;
  const progress = resultId ? 100 : Math.round((step / TOTAL_STEPS) * 100);

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-orange-500/30 bg-orange-500/8 text-orange-400 text-xs font-medium mb-4">
            <Icon name="Building2" size={12} />
            Небоскрёбы и высотные здания
          </div>
          <h1 className="font-oswald text-4xl font-bold text-white mb-2">Интерактивная схема</h1>
          <p className="text-white/40">Ответьте на {TOTAL_STEPS} вопросов — получите пошаговый план строительства</p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/30 text-xs">
              {resultId ? "Анализ завершён" : `Вопрос ${step} из ${TOTAL_STEPS}`}
            </span>
            <span className={`text-xs font-medium ${resultId ? "text-emerald-400" : "text-orange-400"}`}>
              {progress}%
            </span>
          </div>
          <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${resultId ? "bg-emerald-500" : "bg-gradient-to-r from-orange-500 to-amber-400"}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Answers breadcrumb */}
        {answers.length > 0 && !resultId && (
          <div className="mb-6 flex flex-wrap gap-2">
            {answers.map((a, i) => (
              <div key={i} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/8 text-xs text-white/40">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500/60" />
                {a.answer}
              </div>
            ))}
          </div>
        )}

        {/* Question card */}
        {currentQuestion && (
          <div className="rounded-2xl border border-white/12 bg-white/3 p-7 animate-fade-in">
            <div className="mb-7">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-md bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
                  <span className="text-orange-400 text-xs font-bold">{step}</span>
                </div>
                <span className="text-orange-400/60 text-xs uppercase tracking-wider font-medium">Вопрос {step}</span>
              </div>
              <h2 className="font-oswald text-2xl font-bold text-white leading-tight mb-2">{currentQuestion.text}</h2>
              {currentQuestion.subtitle && (
                <p className="text-white/35 text-sm">{currentQuestion.subtitle}</p>
              )}
            </div>

            <div className="grid gap-2.5">
              {currentQuestion.options.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => handleOption(opt.next, opt.label)}
                  className="flex items-center gap-3 p-4 rounded-xl border border-white/8 bg-white/2 text-left hover:border-orange-500/50 hover:bg-orange-500/5 transition-all duration-150 group"
                >
                  {opt.icon && (
                    <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500/12 transition-colors">
                      <Icon name={opt.icon} size={18} className="text-white/40 group-hover:text-orange-400 transition-colors" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-white/85 font-medium group-hover:text-white transition-colors text-sm">{opt.label}</div>
                    {opt.desc && (
                      <div className="text-white/30 text-xs mt-0.5">{opt.desc}</div>
                    )}
                  </div>
                  <Icon name="ChevronRight" size={15} className="text-white/15 group-hover:text-orange-400 transition-colors flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Result */}
        {currentResult && (
          <ResultView result={currentResult} onReset={handleReset} />
        )}

        {/* Back */}
        {(history.length > 1 || resultId) && (
          <button
            onClick={handleBack}
            className="flex items-center gap-2 mt-5 text-white/30 hover:text-white/60 transition-colors text-sm"
          >
            <Icon name="ArrowLeft" size={14} />
            Вернуться к предыдущему вопросу
          </button>
        )}
      </div>
    </div>
  );
};

export default SchemaPage;
