import { spawn } from 'child_process';
import fs from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log(JSON.stringify(data, null, 2));
    // Validar los datos recibidos
    if (!data.timePoints || !data.groups || !data.values) {
      return NextResponse.json(
        { error: 'Datos incompletos. Se requieren timePoints, groups y values' },
        { status: 400 }
      );
    }
    console.log("Datos validados");
    // Crear un archivo temporal con los datos
    const tempDataPath = path.join(process.cwd(), 'temp_data.json');
    fs.writeFileSync(tempDataPath, JSON.stringify(data));
    console.log("Archivo temporal creado");
    // Crear script Python para el análisis circadiano
    const scriptPath = path.join(process.cwd(), 'temp_analyzer.py');
    const scriptContent = `
import json
import numpy as np
import pandas as pd
from scipy.optimize import curve_fit
from scipy.stats import f, iqr, mannwhitneyu

# Cargar datos
with open('${tempDataPath}', 'r') as file:
    data = json.load(file)

# Convertir a DataFrame
df = pd.DataFrame({
    'Time point': data['timePoints'],
    **{group: values for group, values in zip(data['groups'], data['values'])}
})

# Configuración
use_extended_model = ${data.useExtendedModel ? 'True' : 'False'}
no_significant = ${data.noSignificant || 0.999}
use_median_iqr = ${data.useMedianIqr ? 'True' : 'False'}

# Modelos
def circadian_model(t, a, b, c):
    return a + b * np.sin(2 * np.pi * t / 24) + c * np.cos(2 * np.pi * t / 24)

def extended_sinusoidal_model(t, a, b, c, d):
    return a + (b * np.sin(2 * np.pi * t / 24) + c * np.cos(2 * np.pi * t / 24)) / (1 - d * np.sin(2 * np.pi * t / 24))

def reduced_model(t, a):
    return a

def f_test(sse_reduced, sse_full, df_reduced, df_full):
    num = (sse_reduced - sse_full) / (df_reduced - df_full)
    denom = sse_full / df_full
    f_stat = num / denom
    p_value = 1 - f.cdf(f_stat, df_reduced - df_full, df_full)
    return f_stat, p_value

# Análisis
results = {}
mann_whitney_results = {}
plot_data = {
    'time_points': np.linspace(0, 24, 1000).tolist(),
    'groups': {}
}

# Análisis por grupo
for group in data['groups']:
    data1 = df.dropna(subset=[group])
    t = data1['Time point']
    y = data1[group]

    # Calcular estadísticas descriptivas
    stats = data1.groupby('Time point')[group].agg(
        median='median',
        iqr=lambda x: iqr(x, nan_policy='omit')
    ).reset_index()

    plot_data['groups'][group] = {
        'raw_data': {
            'time_points': t.tolist(),
            'values': y.tolist()
        },
        'descriptive_stats': {
            'time_points': stats['Time point'].tolist(),
            'medians': stats['median'].tolist(),
            'iqr': stats['iqr'].tolist()
        }
    }

    try:
        # Seleccionar modelo
        model_func = extended_sinusoidal_model if use_extended_model else circadian_model
        initial_params = [np.mean(y), 1, 1, 0.1] if use_extended_model else [np.mean(y), 1, 1]

        # Ajuste del modelo completo
        params_full, _ = curve_fit(model_func, t, y, p0=initial_params, maxfev=10000)
        y_pred_full = model_func(t, *params_full)
        sse_full = np.sum((y - y_pred_full) ** 2)
        df_full = len(y) - len(params_full)

        # Ajuste del modelo reducido
        params_reduced, _ = curve_fit(reduced_model, t, y, p0=[np.mean(y)])
        y_pred_reduced = reduced_model(t, *params_reduced)
        sse_reduced = np.sum((y - y_pred_reduced) ** 2)
        df_reduced = len(y) - len(params_reduced)

        # F-test
        f_stat, p_value_f = f_test(sse_reduced, sse_full, df_reduced, df_full)

        # Cálculo de parámetros
        a, b, c, *d = params_full
        mesor = a
        amplitude = np.sqrt(b ** 2 + c ** 2)
        acrophase_rad = np.arctan2(c, b)
        acrophase_hours = (acrophase_rad * 24 / (2 * np.pi)) % 24

        # Calcular MSE, R2 y Chi2
        mse = np.mean((y - y_pred_full) ** 2)
        ss_tot = np.sum((y - np.mean(y)) ** 2)
        r2 = 1 - sse_full / ss_tot if ss_tot != 0 else float('nan')
        chi2 = np.sum((y - y_pred_full) ** 2 / (y_pred_full + 1e-8))  # evitar división por cero

        # Tiempo del máximo y curva ajustada
        t_fine = np.linspace(0, 24, 1000)
        y_fit = model_func(t_fine, *params_full)
        peak_time = t_fine[np.argmax(y_fit)]

        # Guardar datos para la gráfica
        plot_data['groups'][group]['fitted_curve'] = {
            'time_points': t_fine.tolist(),
            'values': y_fit.tolist(),
            'is_significant': bool(p_value_f < no_significant)
        }

        results[group] = {
            'mesor': float(mesor),
            'amplitude': float(amplitude),
            'acrophase': float(acrophase_hours),
            'acrophase_rad': float(acrophase_rad),
            'peak_time': float(peak_time),
            'mse': float(mse),
            'r2': float(r2),
            'chi2': float(chi2),
            'f_statistic': float(f_stat),
            'p_value': float(p_value_f),
            'is_significant': bool(p_value_f < no_significant),
            'model_type': 'extended' if use_extended_model else 'standard'
        }

    except Exception as e:
        print("Error en el ajuste del modelo:", e)
        results[group] = {'error': str(e)}
        plot_data['groups'][group]['fitted_curve'] = None

# Análisis Mann-Whitney
for tp in sorted(df['Time point'].unique()):
    mann_whitney_results[str(tp)] = {}
    for i in range(len(data['groups'])):
        for j in range(i+1, len(data['groups'])):
            g1 = data['groups'][i]
            g2 = data['groups'][j]
            x = df.loc[df['Time point'] == tp, g1].dropna()
            y = df.loc[df['Time point'] == tp, g2].dropna()
            
            if len(x) > 0 and len(y) > 0:
                try:
                    U, p = mannwhitneyu(x, y, alternative='two-sided')
                    mann_whitney_results[str(tp)][f"{g1}_vs_{g2}"] = {
                        'U_statistic': float(U),
                        'p_value': float(p)
                    }
                except Exception as e:
                    mann_whitney_results[str(tp)][f"{g1}_vs_{g2}"] = {
                        'error': str(e)
                    }

# Guardar resultados
output = {
    'circadian_analysis': results,
    'mann_whitney_tests': mann_whitney_results,
    'plot_data': plot_data
}

# Escribir resultados
with open('${tempDataPath}_results.json', 'w') as f:
    json.dump(output, f)
`;

    fs.writeFileSync(scriptPath, scriptContent);
    console.log("Script Python creado");
    // Ejecutar el script Python
    return new Promise((resolve, reject) => {
      const pythonProcess = spawn('python3', [scriptPath]);
      console.log("Script Python ejecutado");
      
      let pythonError = '';
      let pythonOutput = '';

      // Capturar la salida estándar
      pythonProcess.stdout.on('data', (data) => {
        pythonOutput += data.toString();
        console.log('Python stdout:', data.toString());
      });

      // Capturar la salida de error
      pythonProcess.stderr.on('data', (data) => {
        pythonError += data.toString();
        console.log('Python stderr:', data.toString());
      });

      pythonProcess.on('close', (code) => {
        try {
          // Limpiar archivos temporales
          fs.unlinkSync(scriptPath);
          console.log("Archivos temporales eliminados");
          
          if (code !== 0) {
            console.log("Error en el script Python:", pythonError);
            throw new Error(`Error en el script Python: ${pythonError}`);
          }

          const resultsPath = `${tempDataPath}_results.json`;
          console.log("Archivo temporal de resultados creado");
          
          if (!fs.existsSync(resultsPath)) {
            console.log("No se encontró el archivo de resultados");
            throw new Error("No se generó el archivo de resultados");
          }

          console.log("Archivo temporal de resultados leido");
          const results = JSON.parse(fs.readFileSync(resultsPath, 'utf-8'));
          fs.unlinkSync(resultsPath);
          fs.unlinkSync(tempDataPath);
          console.log("Archivo temporal de resultados eliminado");
          resolve(NextResponse.json(results));
        } catch (e) {
          console.log("Error interno al procesar los resultados:", e);
          // Limpiar archivos temporales en caso de error
          try {
            if (fs.existsSync(tempDataPath)) fs.unlinkSync(tempDataPath);
            if (fs.existsSync(`${tempDataPath}_results.json`)) fs.unlinkSync(`${tempDataPath}_results.json`);
          } catch (cleanupError) {
            console.log("Error al limpiar archivos temporales:", cleanupError);
          }
          
          resolve(NextResponse.json(
            { error: `Error interno al procesar los resultados: ${e.message}` },
            { status: 500 }
          ));
        }
      });

      pythonProcess.on('error', (err) => {
        console.log("Error al ejecutar Python:", err);
        // Limpiar archivos temporales
        try {
          if (fs.existsSync(tempDataPath)) fs.unlinkSync(tempDataPath);
          if (fs.existsSync(scriptPath)) fs.unlinkSync(scriptPath);
        } catch (cleanupError) {
          console.log("Error al limpiar archivos temporales:", cleanupError);
        }
        
        reject(NextResponse.json(
          { error: `Error al ejecutar Python: ${err.message}` },
          { status: 500 }
        ));
      });
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 