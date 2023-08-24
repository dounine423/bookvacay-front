import { useState, useEffect } from "react";
import moment from "moment";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { faker } from "@faker-js/faker";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,

  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },

    tooltips: {
      position: "nearest",
      mode: "index",
      intersect: false,
      yPadding: 10,
      xPadding: 10,
      caretSize: 4,
      backgroundColor: "rgba(72, 241, 12, 1)",
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "#1967d2",
      borderColor: "rgba(0,0,0,1)",
      borderWidth: 4,
    },
  },
};


const ChartMain = ({ chartData, group }) => {

  const [label, setLabel] = useState([])
  const [value, setValue] = useState([])
  const [maxVaue, setMaxValue] = useState()
  const [minValue, setMinValue] = useState()

  const data = {
    labels: label,
    datasets: [
      {
        label: "Dataset",
        data: label.map(() => faker.datatype.number({ min: minValue, max: maxVaue })),
        borderColor: "#1967d2",
        backgroundColor: "#1967d2",
        data: value,
        fill: false,
        fontSize: '16px'
      },
    ],
  };

  useEffect(() => {
    if (chartData && chartData.length > 0) {
      let tempLabel = []
      let tempValue = []
      let tempMax = chartData[0].value
      let tempMin = chartData[0].value
      chartData?.map((item) => {
        if (group == 0)
          tempLabel.push(moment(item.time).format('MMMM DD hh:mm a'))
        if (group == 1)
          tempLabel.push(moment(item.time).format('MMMM DD'))
        if (group == 2)
          tempLabel.push(moment(item.time).format('YYYY MMMM'))
        if (group == 3)
          tempLabel.push(moment(item.time).format('YYYY MMMM'))
        if (item.value > tempMax)
          tempMax = item.value
        if (item.value < tempMin)
          tempMin = item.value
        tempValue.push(item.value)
      })
      setMaxValue(tempMax)
      setMinValue(tempMin)
      setLabel([...tempLabel])
      setValue([...tempValue])
    }

  }, [chartData])

  return (
    <div className="widget-content">
      {
        chartData ? (
          <Line options={options} data={data} />
        ) : null
      }
    </div>
  );
};

export default ChartMain;
