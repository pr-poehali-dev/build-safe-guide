import { useState, useCallback } from "react";
import Icon from "@/components/ui/icon";

type CalcTab = "loads" | "foundation" | "safety";

const CalculatorPage = () => {
  const [tab, setTab] = useState<CalcTab>("loads");

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="font-oswald text-4xl font-bold text-white mb-2">Калькулятор</h1>
          <p className="text-white/40">Расчёт нагрузок, фундамента и параметров безопасности</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-white/3 border border-white/10 rounded-xl p-1">
          {(["loads", "foundation", "safety"] as CalcTab[]).map((t) => {
            const labels: Record<CalcTab, { label: string; icon: string }> = {
              loads: { label: "Нагрузки", icon: "ArrowDownToLine" },
              foundation: { label: "Фундамент", icon: "Layers" },
              safety: { label: "Безопасность", icon: "ShieldCheck" },
            };
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  tab === t
                    ? "bg-blue-600 text-white"
                    : "text-white/50 hover:text-white"
                }`}
              >
                <Icon name={labels[t].icon} size={14} />
                {labels[t].label}
              </button>
            );
          })}
        </div>

        {tab === "loads" && <LoadsCalc />}
        {tab === "foundation" && <FoundationCalc />}
        {tab === "safety" && <SafetyCalc />}
      </div>
    </div>
  );
};

/* ===== Калькулятор нагрузок ===== */
const LoadsCalc = () => {
  const [area, setArea] = useState("100");
  const [floors, setFloors] = useState("2");
  const [wallType, setWallType] = useState("brick");
  const [roofType, setRoofType] = useState("flat");
  const [snowRegion, setSnowRegion] = useState("3");

  const areaNum = parseFloat(area) || 0;
  const floorsNum = parseFloat(floors) || 1;

  const wallLoad: Record<string, number> = { frame: 1.5, brick: 5.5, block: 3.5, concrete: 8 };
  const roofLoad: Record<string, number> = { flat: 0.3, gable: 0.25, complex: 0.35 };
  const snowMap: Record<string, number> = { "1": 0.8, "2": 1.2, "3": 1.8, "4": 2.4, "5": 3.2, "6": 4.0 };

  const permanentLoad = wallLoad[wallType] * areaNum * floorsNum * 0.9 + roofLoad[roofType] * areaNum * 1.1;
  const liveLoad = areaNum * floorsNum * 1.5 * 1.2;
  const snowLoad = snowMap[snowRegion] * areaNum * 1.4;
  const totalLoad = (permanentLoad + liveLoad + snowLoad) * 1.1;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <InputField label="Площадь дома, м²" value={area} onChange={setArea} type="number" />
        <InputField label="Количество этажей" value={floors} onChange={setFloors} type="number" />
      </div>

      <SelectField
        label="Материал стен"
        value={wallType}
        onChange={setWallType}
        options={[
          { value: "frame", label: "Каркас / дерево" },
          { value: "block", label: "Газоблок / пеноблок" },
          { value: "brick", label: "Кирпич" },
          { value: "concrete", label: "Монолитный ж/б" },
        ]}
      />

      <SelectField
        label="Тип кровли"
        value={roofType}
        onChange={setRoofType}
        options={[
          { value: "flat", label: "Плоская" },
          { value: "gable", label: "Двускатная" },
          { value: "complex", label: "Сложная (вальмовая и др.)" },
        ]}
      />

      <SelectField
        label="Снеговой район (по СП 20.13330)"
        value={snowRegion}
        onChange={setSnowRegion}
        options={[
          { value: "1", label: "I район — 0.8 кПа (Крым, Кавказ)" },
          { value: "2", label: "II район — 1.2 кПа (Черноземье)" },
          { value: "3", label: "III район — 1.8 кПа (Москва, СПб)" },
          { value: "4", label: "IV район — 2.4 кПа (Урал)" },
          { value: "5", label: "V район — 3.2 кПа (Зап. Сибирь)" },
          { value: "6", label: "VI район — 4.0 кПа (Вост. Сибирь)" },
        ]}
      />

      <ResultBlock
        title="Результат расчёта нагрузок"
        items={[
          { label: "Постоянные нагрузки (конструкции)", value: `${permanentLoad.toFixed(0)} кН` },
          { label: "Временные нагрузки (люди, мебель)", value: `${liveLoad.toFixed(0)} кН` },
          { label: "Снеговая нагрузка", value: `${snowLoad.toFixed(0)} кН` },
          { label: "Суммарная расчётная нагрузка на фундамент", value: `${totalLoad.toFixed(0)} кН`, highlight: true },
        ]}
        note="Нагрузки рассчитаны с коэффициентом надёжности γf = 1.1–1.4 по СП 20.13330"
      />
    </div>
  );
};

/* ===== Калькулятор фундамента ===== */
const FoundationCalc = () => {
  const [load, setLoad] = useState("2000");
  const [soilType, setSoilType] = useState("sand_dense");
  const [frostDepth, setFrostDepth] = useState("1.2");
  const [foundationType, setFoundationType] = useState("strip");

  const loadNum = parseFloat(load) || 0;
  const frostNum = parseFloat(frostDepth) || 1;

  const soilR: Record<string, number> = {
    rock: 600, gravel: 350, sand_dense: 250, sand_medium: 200, clay_hard: 300, clay_soft: 150, loam: 180,
  };

  const depthBase = foundationType === "slab" ? 0.3 : frostNum + 0.2;
  const depth = depthBase;
  const R = soilR[soilType];
  const requiredArea = loadNum / R;
  const perimeterAssumed = (foundationType === "strip") ? 40 : null;
  const stripWidth = perimeterAssumed ? requiredArea / perimeterAssumed : null;
  const slabSide = Math.sqrt(requiredArea);

  return (
    <div className="space-y-6">
      <InputField label="Расчётная нагрузка на фундамент, кН" value={load} onChange={setLoad} type="number" hint="Используйте значение из вкладки «Нагрузки»" />

      <SelectField
        label="Тип грунта основания"
        value={soilType}
        onChange={setSoilType}
        options={[
          { value: "rock", label: "Скала (R = 600 кПа)" },
          { value: "gravel", label: "Гравий / щебень (R = 350 кПа)" },
          { value: "sand_dense", label: "Песок плотный (R = 250 кПа)" },
          { value: "sand_medium", label: "Песок средней плотности (R = 200 кПа)" },
          { value: "clay_hard", label: "Глина твёрдая (R = 300 кПа)" },
          { value: "clay_soft", label: "Глина мягкопластичная (R = 150 кПа)" },
          { value: "loam", label: "Суглинок (R = 180 кПа)" },
        ]}
      />

      <SelectField
        label="Тип фундамента"
        value={foundationType}
        onChange={setFoundationType}
        options={[
          { value: "strip", label: "Ленточный (для периметра ~40 м)" },
          { value: "slab", label: "Монолитная плита" },
        ]}
      />

      <InputField label="Глубина промерзания, м" value={frostDepth} onChange={setFrostDepth} type="number" hint="Нормативная по СП 131.13330 для вашего региона" />

      <ResultBlock
        title="Параметры фундамента"
        items={[
          { label: "Расчётное сопротивление грунта R", value: `${R} кПа` },
          { label: "Минимальная площадь подошвы", value: `${requiredArea.toFixed(1)} м²` },
          { label: "Глубина заложения", value: `${depth.toFixed(2)} м` },
          ...(foundationType === "strip" && stripWidth
            ? [{ label: "Ширина ленты (при периметре 40 м)", value: `${(stripWidth * 100).toFixed(0)} см`, highlight: true }]
            : [{ label: "Размер плиты (≈)", value: `${slabSide.toFixed(1)} × ${slabSide.toFixed(1)} м`, highlight: true }]),
        ]}
        note="Расчёт выполнен по формуле p = N/A ≤ R. Для проектирования используйте инженерно-геологические изыскания."
      />
    </div>
  );
};

/* ===== Калькулятор безопасности ===== */
const SafetyCalc = () => {
  const [beamSpan, setBeamSpan] = useState("5");
  const [beamWidth, setBeamWidth] = useState("200");
  const [beamHeight, setBeamHeight] = useState("400");
  const [distLoad, setDistLoad] = useState("15");

  const l = parseFloat(beamSpan) || 0;
  const b = parseFloat(beamWidth) / 1000 || 0;
  const h = parseFloat(beamHeight) / 1000 || 0;
  const q = parseFloat(distLoad) || 0;

  const M = (q * l * l) / 8;
  const W = (b * h * h) / 6;
  const sigma = W > 0 ? (M * 1000) / W : 0;
  const allowable = 350000;
  const safetyFactor = sigma > 0 ? allowable / sigma : Infinity;
  const isOk = safetyFactor >= 1.5;
  const deflection = (5 * (q / 1000) * Math.pow(l, 4)) / (384 * 200000 * ((b * Math.pow(h, 3)) / 12));
  const allowableDeflection = l / 200;
  const deflectionOk = deflection <= allowableDeflection;

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl border border-blue-500/30 bg-blue-500/8">
        <p className="text-blue-400 text-sm font-medium mb-1">Проверка балки перекрытия</p>
        <p className="text-white/50 text-xs">Расчёт по прочности и прогибу для железобетонной балки прямоугольного сечения</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <InputField label="Пролёт балки, м" value={beamSpan} onChange={setBeamSpan} type="number" />
        <InputField label="Нагрузка, кН/м" value={distLoad} onChange={setDistLoad} type="number" />
        <InputField label="Ширина сечения, мм" value={beamWidth} onChange={setBeamWidth} type="number" />
        <InputField label="Высота сечения, мм" value={beamHeight} onChange={setBeamHeight} type="number" />
      </div>

      <ResultBlock
        title="Результаты проверки"
        items={[
          { label: "Изгибающий момент M = ql²/8", value: `${M.toFixed(1)} кН·м` },
          { label: "Момент сопротивления W = bh²/6", value: `${(W * 1e6).toFixed(0)} см³` },
          { label: "Расчётное напряжение σ", value: `${(sigma / 1000).toFixed(1)} МПа` },
          { label: "Коэффициент запаса прочности", value: `${isFinite(safetyFactor) ? safetyFactor.toFixed(2) : "∞"}`, highlight: true, ok: isOk },
          { label: "Прогиб f / допустимый l/200", value: `${(deflection * 1000).toFixed(1)} мм / ${(allowableDeflection * 1000).toFixed(0)} мм`, ok: deflectionOk },
        ]}
        note="Расчёт по СП 20.13330 и СП 63.13330. σallow = 350 МПа для арматуры А400."
      />
    </div>
  );
};

/* ===== Вспомогательные компоненты ===== */
interface InputFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  hint?: string;
}

const InputField = ({ label, value, onChange, type = "text", hint }: InputFieldProps) => (
  <div>
    <label className="block text-white/60 text-sm mb-1.5">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-orange-500/60 focus:bg-orange-500/5 transition-all"
    />
    {hint && <p className="text-white/30 text-xs mt-1">{hint}</p>}
  </div>
);

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}

const SelectField = ({ label, value, onChange, options }: SelectFieldProps) => (
  <div>
    <label className="block text-white/60 text-sm mb-1.5">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-orange-500/60 transition-all appearance-none cursor-pointer"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value} className="bg-[#1a1a2e] text-white">
          {o.label}
        </option>
      ))}
    </select>
  </div>
);

interface ResultItem {
  label: string;
  value: string;
  highlight?: boolean;
  ok?: boolean;
}

interface ResultBlockProps {
  title: string;
  items: ResultItem[];
  note?: string;
}

const ResultBlock = ({ title, items, note }: ResultBlockProps) => (
  <div className="rounded-2xl border border-orange-500/30 bg-orange-500/5 p-6">
    <h3 className="font-oswald text-lg font-bold text-orange-400 mb-4">{title}</h3>
    <div className="space-y-3">
      {items.map((item, i) => (
        <div
          key={i}
          className={`flex items-center justify-between gap-4 py-2.5 px-3 rounded-lg ${
            item.highlight ? "bg-orange-500/10 border border-orange-500/20" : ""
          }`}
        >
          <span className="text-white/60 text-sm">{item.label}</span>
          <div className="flex items-center gap-2">
            {item.ok !== undefined && (
              <Icon
                name={item.ok ? "CheckCircle" : "XCircle"}
                size={14}
                className={item.ok ? "text-emerald-400" : "text-red-400"}
              />
            )}
            <span
              className={`font-mono font-bold text-sm ${
                item.ok === false ? "text-red-400" : item.ok === true ? "text-emerald-400" : item.highlight ? "text-orange-300" : "text-white"
              }`}
            >
              {item.value}
            </span>
          </div>
        </div>
      ))}
    </div>
    {note && (
      <p className="text-white/30 text-xs mt-4 leading-relaxed border-t border-white/10 pt-3">{note}</p>
    )}
  </div>
);

export default CalculatorPage;