import { Cell, Pie, PieChart } from 'recharts';
import { useLanguageContext } from '../context/LanguageContext';
import { useModeContext } from '../context/ModeContext';

const RADIAN = Math.PI / 180;
const COLORS = ['#00C49F', '#ff4b42ff'];

function ResolvedStateChart({ shoppingList, isAnimationActive = true }) {
    const { currentLanguage } = useLanguageContext();
    const { mode } = useModeContext();

    const items = shoppingList.items;
    const resolvedCount = items.filter(item => item.resolved === true).length;
    const unresolvedCount = items.filter(item => item.resolved === false).length;

    const data = [
        { name: (currentLanguage.id === "EN" ? "Resolved" : "Vyřešeno"), value: resolvedCount },
        { name: (currentLanguage.id === "EN" ? "Unresolved" : "Nevyřešeno"), value: unresolvedCount }
    ];

    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name, value }) => {
        if (cx == null || cy == null || innerRadius == null || outerRadius == null) {
            return null;
        }
        const radius = innerRadius + (outerRadius - innerRadius) * 0.2;
        const ncx = Number(cx);
        const x = ncx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
        const ncy = Number(cy);
        const y = ncy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

        return (
            <text className="Pie-chart-text" x={x} y={y} fill={mode === "light" ? "black" : "white"}
                textAnchor={x > ncx ? 'start' : 'end'} dominantBaseline="central"
            >
                {`${name}: ${value} (${((percent ?? 1) * 100).toFixed(0)} %)`}
            </text>
        );
    };

    return (
        <>
            <h1 style={{ marginLeft: 30, color: mode === "light" ? "black" : "white" }}>
                {currentLanguage.id === "EN" ? "Resolved / Unresolved" : "Vyřešeno / Nevyřešeno"}
            </h1>
            {items.length !== 0 ?
                <div>
                    <PieChart style={{ width: '100%', maxWidth: '500px', maxHeight: '80vh', aspectRatio: 1 }} responsive>
                        <Pie
                            data={data}
                            labelLine={false}
                            label={renderCustomizedLabel}
                            fill="#8884d8"
                            dataKey="value"
                            isAnimationActive={isAnimationActive}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                    </PieChart>
                </div> :
                <div>
                    <div className="text-center mt-4">
                        <p style={{ marginBottom: 40, color: mode === "light" ? "black" : "white" }}>
                            {currentLanguage.id === "EN" ? "No data to view." : "Žádná data k zobrazení."}
                        </p>
                    </div>
                </div>
            }
        </>
    );
}

export default ResolvedStateChart;