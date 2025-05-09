import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
  } from 'recharts';
  
  const COLORS = ["#D6CCE0", "#A3C9A8", "#F3CFC6", "#C1DADB", "#B0C4DE"];
  
  const StatisticsChart = ({ title, data, dataKey, fillColor = "#4CAF50", type = "bar" }) => (
    <div style={{ marginBottom: '2rem' }}>
      <h3 style={{ textAlign: 'center' }}>{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        {type === "pie" ? (
          <PieChart>
            <Pie
              data={data}
              dataKey={dataKey}
              nameKey="year"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill={fillColor}
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        ) : (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Bar dataKey={dataKey} fill={fillColor} />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
  
  export default StatisticsChart;