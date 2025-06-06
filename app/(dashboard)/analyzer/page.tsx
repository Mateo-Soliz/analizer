"use client";
import { CircadianAnalysisResults } from "@/app/(page)/analyze/page";
import AnalysisTable from "@/components/AnalysisTable";
import Graph from "@/components/graph";
import { Button } from "@/components/primitives/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/primitives/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/primitives/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/primitives/form";
import { Input } from "@/components/primitives/input";
import { useFileAnalysis } from "@/hooks/useFileAnalysis";
import { useUserStore } from "@/lib/client-only/stores/user/user.store";
import { getTableData } from "@/lib/server-only/analyzer/analizer.mapper";
import {
  createGallery,
  saveDataSet,
} from "@/lib/server-only/data-set/data.service";
import { Badge, CheckCircle, FileText, Upload } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

const AnalyzerPage = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [analysisResults, setAnalysisResults] =
    useState<CircadianAnalysisResults | null>(null);
  const { analyzeFile, isLoading, error, uploadProgress } = useFileAnalysis();

  const [plotData, setPlotData] = useState<any>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [axisXName, setAxisXName] = useState<string | null>("Time point (ZT)");
  const [axisYName, setAxisYName] = useState<string | null>("Value");

  // Formulario con react-hook-form
  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      type: "scatter",
      tags: ["Circadiano", "diurno", "oscilación"],
      xAxis: axisXName,
      yAxis: axisYName,
      data: plotData,
      isPublic: true,
      likes: 0,
      views: 0,
      date: new Date().toISOString(),
      category: "",
    },
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleProcessData = async () => {
    if (!uploadedFile) {
      return;
    }
    try {
      const results = await analyzeFile(uploadedFile);
      setPlotData(results.plot_data);
      setAnalysisResults(results);
    } catch (err) {
      console.error("Error en el proceso:", err);
    }
  };
  const { user } = useUserStore();
  const onSubmit = async (data: any) => {
    try {
      if (!user?.id) {
        throw new Error("El usuario no tiene un id definido. No se puede guardar el dataset.");
      }
      // @ts-ignore
      console.log("user", user);
      const result = await saveDataSet({
        owner: user.id,
        name: data.title,
        data: analysisResults,
      });
      const galleryResult = await createGallery({
        title: data.title,
        description: data.description,
        type: data.type,
        xAxis: data.xAxis,
        yAxis: data.yAxis,
        data: result.id,
        owner: user.id,
        tags: data.tags,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setShowSaveDialog(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Subir Archivo de Datos
          </CardTitle>
          <CardDescription>
            Sube archivos CSV con tus datos de ritmos circadianos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Área de drag & drop */}
          <div
            className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <div className="space-y-2">
              <p className="text-lg font-medium">Arrastra tu archivo aquí</p>
              <p className="text-sm text-muted-foreground">
                o haz clic para seleccionar
              </p>
            </div>
            <Input
              type="file"
              accept=".xlsx"
              onChange={handleFileUpload}
              className="mt-4 max-w-xs mx-auto"
            />
          </div>

          {/* Archivo subido */}
          {uploadedFile && (
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="font-medium">{uploadedFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(uploadedFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge>
                      <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
                      Listo
                    </Badge>
                  </div>
                </div>
              </CardContent>
              <Button
                className="mx-10"
                onClick={handleProcessData}
                disabled={isLoading}
              >
                {isLoading ? "Procesando..." : "Procesar Datos"}
              </Button>
            </Card>
          )}

          {/* Mostrar progreso */}
          {isLoading && uploadProgress.step && (
            <div className="mt-4 p-4 bg-blue-100 text-blue-700 rounded-md">
              {uploadProgress.message}
            </div>
          )}

          {/* Mostrar errores */}
          {error && (
            <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
              <p className="font-semibold">Error:</p>
              <p>{error}</p>
            </div>
          )}

          {/* Formatos soportados */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="p-2 text-center">
                <FileText className="h-6 w-6 mx-auto text-blue-600 mb-2" />
                <p className="font-medium">Excel</p>
                <p className="text-xs text-muted-foreground">Archivos .xlsx</p>
              </CardContent>
            </Card>
            <Card className="bg-muted/50">
              <CardContent className="p-2 text-center">
                <FileText className="h-6 w-6 mx-auto text-green-600 mb-2 opacity-50" />
                <p className="font-medium">CSV</p>
                <p className="text-xs text-muted-foreground">
                  Datos separados por comas (próximamente)
                </p>
              </CardContent>
            </Card>
            <Card className="bg-muted/50">
              <CardContent className="p-2 text-center">
                <FileText className="h-6 w-6 mx-auto text-purple-600 mb-2 opacity-50" />
                <p className="font-medium">JSON</p>
                <p className="text-xs text-muted-foreground">
                  Datos estructurados (próximamente)
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
      {plotData && (
        <div className="flex flex-col gap-4">
          <Graph
            data={plotData}
            fileName={uploadedFile?.name || ""}
            className="max-w-7xl max-h-[700px] mx-auto"
            setAxisXName={setAxisXName}
            setAxisYName={setAxisYName}
          />
          <AnalysisTable
            data={getTableData(analysisResults as CircadianAnalysisResults)}
          />
          <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
            <DialogTrigger asChild>
              <Button>Guardar Datos</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Guardar gráfica en galería</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            required
                            placeholder="Nombre de la gráfica"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descripción</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            required
                            placeholder="Descripción"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de gráfica</FormLabel>
                        <FormControl>
                          <select
                            {...field}
                            className="w-full border rounded-md p-2"
                          >
                            <option value="bar">Barra</option>
                            <option value="line">Línea</option>
                            <option value="area">Área</option>
                            <option value="scatter">Dispersión</option>
                            <option value="pie">Pastel</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Etiquetas</FormLabel>
                        <div className="flex flex-col gap-2">
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              value="Circadiano"
                              checked={field.value?.includes("Circadiano")}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  field.onChange([
                                    ...(field.value || []),
                                    "Circadiano",
                                  ]);
                                } else {
                                  field.onChange(
                                    (field.value || [])?.filter(
                                      (v: string) => v !== "Circadiano"
                                    )
                                  );
                                }
                              }}
                            />
                            Circadiano
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              value="diurno"
                              checked={field.value?.includes("diurno")}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  field.onChange([
                                    ...(field.value || []),
                                    "diurno",
                                  ]);
                                } else {
                                  field.onChange(
                                    (field.value || [])?.filter(
                                      (v: string) => v !== "diurno"
                                    )
                                  );
                                }
                              }}
                            />
                            diurno
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              value="oscilación"
                              checked={field.value?.includes("oscilación")}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  field.onChange([
                                    ...(field.value || []),
                                    "oscilación",
                                  ]);
                                } else {
                                  field.onChange(
                                    (field.value || [])?.filter(
                                      (v: string) => v !== "oscilación"
                                    )
                                  );
                                }
                              }}
                            />
                            oscilación
                          </label>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Campos de solo lectura para los ejes */}
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <FormLabel>Eje X</FormLabel>
                      <Input value={axisXName || ""} readOnly />
                    </div>
                    <div className="flex-1">
                      <FormLabel>Eje Y</FormLabel>
                      <Input value={axisYName || ""} readOnly />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Guardar</Button>
                    <DialogClose asChild>
                      <Button variant="outline" type="button">
                        Cancelar
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
};
export default AnalyzerPage;
