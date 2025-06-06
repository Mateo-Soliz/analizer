import {
  Activity,
  BarChart3,
  Heart,
  LineChart,
  Moon,
  PieChart,
  Sun,
  TrendingUp
} from "lucide-react";
import { Badge } from "../primitives/badge";
import {
  Card,
  CardContent
} from "../primitives/card";
import { ContentCard } from "./content-card";
import { FooterCard } from "./footer-card";
import { HeaderCard } from "./header-card";

const getChartIcon = (type: string) => {
    switch (type) {
      case "line":
        return <LineChart className="h-4 w-4" />
      case "bar":
      case "stacked-bar":
        return <BarChart3 className="h-4 w-4" />
      case "scatter":
        return <TrendingUp className="h-4 w-4" />
      case "area":
        return <Activity className="h-4 w-4" />
      default:
        return <PieChart className="h-4 w-4" />
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Sueño":
        return <Moon className="h-4 w-4" />
      case "Temperatura":
        return <Activity className="h-4 w-4" />
      case "Hormonas":
        return <Sun className="h-4 w-4" />
      case "Rendimiento":
        return <TrendingUp className="h-4 w-4" />
      case "Actividad":
        return <Heart className="h-4 w-4" />
      default:
        return <BarChart3 className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Sueño":
        return "bg-blue-100 text-blue-800"
      case "Temperatura":
        return "bg-red-100 text-red-800"
      case "Hormonas":
        return "bg-yellow-100 text-yellow-800"
      case "Rendimiento":
        return "bg-green-100 text-green-800"
      case "Actividad":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

export const AnalizerCard = ({ chart }: { chart: any }) => {
  console.log(chart);
  return (
    <Card key={chart.id} className="group hover:shadow-lg transition-shadow">
      <div className="relative">
      {/*   <Image
          src={chart?.thumbnail || "/placeholder.svg?height=200&width=300"}
          alt={chart.title}
          className="w-full h-48 object-cover rounded-t-lg"
        /> */}
        <div className="absolute top-2 right-2 flex gap-1">
          <Badge className={getCategoryColor(chart?.category)}>
            {getCategoryIcon(chart?.category)}
            <span className="ml-1">{chart?.category}</span>
          </Badge>
        </div>
        <div className="absolute top-2 left-2">
          <Badge variant="outline" className="bg-white/90">
            {getChartIcon(chart?.type)}
            <span className="ml-1 capitalize">{chart?.type}</span>
          </Badge>
        </div>
      </div>
      <HeaderCard title={chart?.title} description={chart?.description} />
      <CardContent className="space-y-4">
        <ContentCard chart={chart} />
        <FooterCard chart={chart} />
      </CardContent>
    </Card>
  );
};
