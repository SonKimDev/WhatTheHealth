import React from 'react';
import {LineChart} from 'react-native-chart-kit';
import {COLORS, SCREEN} from '../constans/themes';

interface Props {
  data: number[];
  labels: string[];
}

const LineChartComponent = (props: Props) => {
  const {data, labels} = props;
  const chartData = {
    labels: labels,
    datasets: [
      {
        data: data,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: COLORS.PRIMARY,
    backgroundGradientFrom: COLORS.PRIMARY,
    backgroundGradientTo: COLORS.BLUE,
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 20,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '1',
      stroke: COLORS.PRIMARY,
    },
  };

  return (
    <LineChart
      data={chartData}
      width={350}
      height={200}
      chartConfig={chartConfig}
      style={{
        borderRadius: 16,
      }}
    />
  );
};

export default LineChartComponent;
