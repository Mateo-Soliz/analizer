import { Calendar } from "lucide-react";
import { Badge } from "../primitives/badge";

export const ContentCard = ({ chart }: { chart: any }) => (
  <div className="space-y-4">
    {/* Información de los ejes */}
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm">
        <span className="font-medium">Eje X:</span>
        <span className="text-muted-foreground">{chart.xAxis}</span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <span className="font-medium">Eje Y:</span>
        <span className="text-muted-foreground">{chart.yAxis}</span>
      </div>
    </div>
    {/* Metadatos */}
    <div className="flex items-center justify-between text-sm text-muted-foreground">
      <div className="flex items-center gap-1">
        <Calendar className="h-3 w-3" />
        <span>{chart.date}</span>
      </div>
    </div>
    {/* Tags */}
    <div className="flex flex-wrap gap-1">
      {chart.tags.map((tag: string) => (
        <Badge key={tag} variant="secondary" className="text-xs">
          {tag}
        </Badge>
      ))}
    </div>
  </div>
);
