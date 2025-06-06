import { Settings } from "lucide-react";
import { Button } from "../primitives/button";
import { Input } from "../primitives/input";
import { Label } from "../primitives/label";
import { Separator } from "../primitives/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../primitives/sheet";

interface MenuConfigMobileProps {
  axisConfig: {
    x: { title: string; min: number; max: number };
    y: {
      title: string | undefined;
      min: number | undefined;
      max: number | undefined;
    };
  };
  handleAxisChange: (axis: "x" | "y", field: string, value: string) => void;
  colorConfig: Record<string, string>;
  handleColorChange: (group: string, color: string) => void;
  fileName: string;
  plotData: any;
  defaultColors: string[];
}

const MenuConfigMobile = ({
  axisConfig,
  handleAxisChange,
  colorConfig,
  handleColorChange,
  fileName,
  plotData,
  defaultColors,
}: MenuConfigMobileProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          className="fixed bottom-6 right-6 z-50 rounded-full p-4 shadow-lg h-14 w-14 flex items-center justify-center"
          variant="default"
          size="icon"
        >
          <Settings className="w-6 h-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80 max-w-full p-0">
        <SheetHeader className="p-4 pb-2 border-b">
          <SheetTitle className="flex items-center gap-2 text-lg">
            <Settings className="w-5 h-5" />
            Configuración
          </SheetTitle>
        </SheetHeader>
        <div className="p-4 overflow-y-auto h-[calc(100vh-64px)]">
          <div className="space-y-6">
            {/* Eje X */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-gray-700 border-b pb-2">
                Eje X
              </h3>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="x-title-mobile" className="text-xs font-medium">
                    Nombre del eje
                  </Label>
                  <Input
                    id="x-title-mobile"
                    type="text"
                    value={axisConfig.x.title}
                    onChange={(e) =>
                      handleAxisChange("x", "title", e.target.value)
                    }
                    className="h-8 text-sm"
                    placeholder="Ej: Tiempo (horas)"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="x-min-mobile" className="text-xs font-medium">
                      Mínimo
                    </Label>
                    <Input
                      id="x-min-mobile"
                      type="number"
                      value={axisConfig.x.min}
                      onChange={(e) =>
                        handleAxisChange("x", "min", e.target.value)
                      }
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="x-max-mobile" className="text-xs font-medium">
                      Máximo
                    </Label>
                    <Input
                      id="x-max-mobile"
                      type="number"
                      value={axisConfig.x.max}
                      onChange={(e) =>
                        handleAxisChange("x", "max", e.target.value)
                      }
                      className="h-8 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
            <Separator />
            {/* Eje Y */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-gray-700 border-b pb-2">
                Eje Y
              </h3>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="y-title-mobile" className="text-xs font-medium">
                    Nombre del eje
                  </Label>
                  <Input
                    id="y-title-mobile"
                    type="text"
                    value={axisConfig.y.title}
                    onChange={(e) =>
                      handleAxisChange("y", "title", e.target.value)
                    }
                    className="h-8 text-sm"
                    placeholder="Ej: Concentración (mg/L)"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="y-min-mobile" className="text-xs font-medium">
                      Mínimo
                    </Label>
                    <Input
                      id="y-min-mobile"
                      type="number"
                      value={axisConfig.y.min ?? ""}
                      onChange={(e) =>
                        handleAxisChange("y", "min", e.target.value)
                      }
                      placeholder="Auto"
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="y-max-mobile" className="text-xs font-medium">
                      Máximo
                    </Label>
                    <Input
                      id="y-max-mobile"
                      type="number"
                      value={axisConfig.y.max ?? ""}
                      onChange={(e) =>
                        handleAxisChange("y", "max", e.target.value)
                      }
                      placeholder="Auto"
                      className="h-8 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
            <Separator />
            {/* Colores */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-gray-700 border-b pb-2">
                Colores
              </h3>
              <div className="space-y-3">
                {Object.keys(plotData.groups).map((groupName) => (
                  <div
                    key={groupName}
                    className="flex items-center gap-3 p-2 bg-gray-50 rounded-md"
                  >
                    <Input
                      type="color"
                      value={colorConfig[groupName] || defaultColors[0]}
                      onChange={(e) =>
                        handleColorChange(groupName, e.target.value)
                      }
                      className="w-6 h-6 rounded border border-gray-300 cursor-pointer flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <Label
                        className="text-xs font-medium truncate block"
                        title={groupName}
                      >
                        {groupName}
                      </Label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Separator />
            {/* Info */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-gray-700 border-b pb-2">
                Información
              </h3>
              <div className="text-xs text-gray-600 space-y-1 bg-gray-50 p-3 rounded-md">
                <div className="flex justify-between">
                  <span>Archivo:</span>
                  <span className="font-medium">{fileName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Grupos:</span>
                  <span className="font-medium">
                    {Object.keys(plotData.groups).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Puntos:</span>
                  <span className="font-medium">
                    {Object.values(plotData.groups).reduce(
                      (acc: number, group: any) =>
                        acc + group.raw_data.time_points.length,
                      0
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MenuConfigMobile;
