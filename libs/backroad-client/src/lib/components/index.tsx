import { BackroadComponent, InbuiltComponentTypes } from '@backroad/core';
import { Button } from './button';
import { Markdown } from './markdown';
import { NumberInput } from './number_input';
import { LineChart } from './line_chart';
import { Select } from './select';
import { Image } from './image';
import { Link } from './link';
import { LinkGroup } from './link_group';
import { Stats } from './stats';
import { Multiselect } from './multiselect';
import { Json } from './json';
import { Title } from './title';
import { Table } from './table';
import { BarChart } from './bar_chart';
import { PieChart } from './pie_chart';
import { DoughnutChart } from './doughnut_chart';
import { RadarChart } from './radar_chart';
import { ScatterChart } from './scatter_chart';
export const backroadClientComponents: {
  [key in InbuiltComponentTypes]: (
    props: BackroadComponent<key, true>
  ) => JSX.Element;
} = {
  number_input: NumberInput,
  markdown: Markdown,
  button: Button,
  line_chart: LineChart,
  select: Select,
  image: Image,
  link: Link,
  link_group: LinkGroup,
  stats: Stats,
  multiselect: Multiselect,
  json: Json,
  title: Title,
  table: Table,
  bar_chart: BarChart,
  pie_chart: PieChart,
  doughnut_chart: DoughnutChart,
  radar_chart: RadarChart,
  scatter_chart: ScatterChart
};
