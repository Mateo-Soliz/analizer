export type DataSetType = {
  owner: string;
  name: string;
  data: any;
};

export type ChartGalleryType = {
  title: string;
  description: string;
  type: string;
  xAxis: string;
  yAxis: string;
  data: string;
  tags: string[];
  isPublic?: boolean;
  date?: string;
  category?: string;
  views?: number;
  likes?: number;
  owner: string;
};