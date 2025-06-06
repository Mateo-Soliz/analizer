import { Eye, Heart } from "lucide-react";
import Graph from "../graph";
import { Badge } from "../primitives/badge";
import { Button } from "../primitives/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../primitives/dialog";

export const FooterCard = ({ chart }: { chart: any }) => (
  <div className="flex items-center justify-between pt-2 border-t">
    <div className="flex items-center gap-4 text-sm text-muted-foreground">
      <div className="flex items-center gap-1">
        <Eye className="h-3 w-3" />
        <span>{chart?.views}</span>
      </div>
      <div className="flex items-center gap-1">
        <Heart className="h-3 w-3" />
        <span>{chart?.likes}</span>
      </div>
      {chart?.isPublic && (
        <Badge variant="outline" className="text-xs">
          Público
        </Badge>
      )}
    </div>
    <div className="flex gap-1">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-3xl max-h-[700px]">
          <DialogHeader>
            <DialogTitle>{chart?.title}</DialogTitle>
            <DialogDescription>{chart?.description}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 w-full">
            <Graph
              data={chart?.data?.data?.plot_data}
              fileName={chart?.title}
              config={false}
              className="max-h-[600px] w-full"
            />
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Eje X: </span>
                <span>{chart?.xAxis}</span>
              </div>
              <div>
                <span className="font-medium">Eje Y: </span>
                <span>{chart?.yAxis}</span>
              </div>
              <div>
                <span className="font-medium">Fecha: </span>
                <span>{chart?.data._createdAt ? new Date(chart.data._createdAt).toLocaleDateString("es-ES", { month: "long", year: "numeric" }) : "-"}</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  </div>
);
