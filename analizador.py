import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from scipy.optimize import curve_fit
from sklearn.metrics import mean_squared_error
from scipy.stats import f, iqr, mannwhitneyu   # ← IMPORTA mannwhitneyu

# Parámetro para alternar entre el modelo cosinor estándar y el modelo extendido
use_extended_model = False  # Cambiar a True para usar el modelo extendido
use_median_iqr = True  # Cambiar a False para usar puntos individuales
no_significant = 0.999  # Si el modelo no es significativo, conectar promedios con una línea recta
iqr_name: str = "IQR_CAF"
value_max: float = 500000
# Secuencia de colores y lineas en el orden que aparecen el el excel
colors = ["darkblue", "darkblue", "red", "red", "red", "red", "grey", "grey"]
ls = ["-", "--", "-", "--", "-", "-"]
point_graph = ["o", "^", "o", "^", "o", "^"]
title: str = 'Diurnal oscillation of ' # Diurnal oscillation of
label_x: str = 'ZT'
graph_name: str = "Tlr9"
label_y: str = "Relative gene expression"  # mmol/g  Alpha-diversity index: Chao1
# Si esta True los valores del eje y son max_graph y min_graph, el intervalo interval_graph, si es False se pone automatico
legend_graph = True
max_graph = 200000.0
min_graph = 0.0
interval_graph = 40000
path: str = "/Users/mateosolizrueda/Desktop/asdasdasdasd/"
# metabolomica/graficas individuales/  C:/Users/jr_69/OneDrive - URV/Escritorio/2023/Microbiota/PCRs/
file: str = "Bacteroidota_CAF_CH.xlsx"


# Modelo cosinor estándar
def circadian_model(t, a, b, c):
    return a + b * np.sin(2 * np.pi * t / 24) + c * np.cos(2 * np.pi * t / 24)


# Modelo extendido
def extended_sinusoidal_model(t, a, b, c, d):
    return a + (b * np.sin(2 * np.pi * t / 24) + c * np.cos(2 * np.pi * t / 24)) / (1 - d * np.sin(2 * np.pi * t / 24))


# Modelo reducido (solo mesor)
def reduced_model(t, a):
    return a


# F-test
def f_test(sse_reduced, sse_full, df_reduced, df_full):
    num = (sse_reduced - sse_full) / (df_reduced - df_full)
    denom = sse_full / df_full
    f_stat = num / denom
    p_value = 1 - f.cdf(f_stat, df_reduced - df_full, df_full)
    return f_stat, p_value


# Cargar datos desde un archivo Excel
data = pd.read_excel(path + file)
groups = list(data.columns[1:])

# Archivo para guardar resultados
output_file = path + graph_name + ".txt"
with open(output_file, "w") as file:
    file.write(f"{'Extended ' if use_extended_model else ''}Circadian fitting results\n")
    file.write("=" * 50 + "\n\n")

# Inicializar figura
fig, ax1 = plt.subplots()

# Después de cargar los datos
print("1. Datos cargados desde Excel")

# Antes del bucle principal
print("2. Iniciando procesamiento de grupos experimentales")

# Iterar sobre cada grupo experimental
for group, color, ls1, point in zip(data.columns[1:], colors, ls, point_graph):
    print(f"3. Procesando grupo: {group}")
    
    # Antes del ajuste del modelo
    print(f"   - Intentando ajustar modelo para {group}")
    
    data1 = data.dropna(subset=[group])
    t = data1['Time point']
    y = data1[group]

    # Ajustar modelo
    model_func = extended_sinusoidal_model if use_extended_model else circadian_model
    initial_params = [np.mean(y), 1, 1, 0.1] if use_extended_model else [np.mean(y), 1, 1]

    try:
        params_full, _ = curve_fit(model_func, t, y, p0=initial_params, maxfev=10000)
        y_pred_full = model_func(t, *params_full)
        sse_full = np.sum((y - y_pred_full) ** 2)
        df_full = len(y) - len(params_full)
        print(f"   - Modelo ajustado exitosamente para {group}")
    except RuntimeError:
        print(f"   - Error: El ajuste no convergió para {group}")
        continue

    # Ajustar modelo reducido
    params_reduced, _ = curve_fit(reduced_model, t, y, p0=[np.mean(y)])
    y_pred_reduced = reduced_model(t, *params_reduced)
    sse_reduced = np.sum((y - y_pred_reduced) ** 2)
    df_reduced = len(y) - len(params_reduced)

    # F-test
    f_stat, p_value_f = f_test(sse_reduced, sse_full, df_reduced, df_full)

    # Calcular parámetros del modelo completo
    a, b, c, *d = params_full
    mesor = a
    amplitude = np.sqrt(b ** 2 + c ** 2)
    acrophase_rad = np.arctan2(c, b)
    acrophase_hours = (acrophase_rad * 24 / (2 * np.pi)) % 24

    # Validar tiempo del máximo
    t_fine = np.linspace(0, 24, 10000)
    y_fit = model_func(t_fine, *params_full)
    peak_time = t_fine[np.argmax(y_fit)]

    # Guardar resultados
    with open(output_file, "a") as file:
        file.write(f"Group: {group}\n")
        file.write(f"Mesor: {mesor:.2f}\n")
        file.write(f"Amplitude: {amplitude:.2f}\n")
        file.write(f"Acrophase: {acrophase_hours:.2f} hours\n")
        file.write(f"Peak time: {peak_time:.2f} hours\n")
        file.write(f"F-Statistic: {f_stat:.2f}\n")
        file.write(f"P-value (F-test): {p_value_f:.4f}\n")
        file.write("-" * 50 + "\n\n")

    # Antes de graficar
    print(f"   - Generando gráficos para {group}")

    # Graficar puntos individuales
    ax1.plot(t, y, color=color, marker=point, markersize=5, linewidth=0, label=None)

    # >>> MEDIAN + IQR (solo si se activa el flag)
    if use_median_iqr:
        stats = (
            data1.groupby('Time point')[group]
                .agg(median='median', iqr=lambda x: iqr(x, nan_policy='omit'))
                .reset_index()
        )
        times_med = stats['Time point'].values
        med_values = stats['median'].values
        half_iqr = stats['iqr'].values / 2.0

        # Mediana (puntos REDONDOS, grandes y al 50 % de transparencia)
        ax1.plot(times_med, med_values,
                 color=color, marker=point, markersize=12,
                 linestyle='none', alpha=0.65, label=None)

        # Barras verticales ±½ IQR con la misma transparencia
        ax1.errorbar(times_med, med_values, yerr=half_iqr,
                     fmt='none', ecolor=color, capsize=4, alpha=0.65)

    # Si el modelo no es significativo, conectar promedios con una línea recta
    if p_value_f >= no_significant:
        mean_y = y.groupby(t).mean()
        mean_y[25] = mean_y.iloc[0]  # Agregar un punto en ZT25 con el valor de ZT1
        ax1.plot(mean_y.index, mean_y, ls1, color=color, label=group, linewidth=2)
    else:
        ax1.plot(t_fine, y_fit, color=color, label=group, linewidth=2, ls=ls1)

# --- AÑADE COMPARACIONES MANN–WHITNEY POR TIME POINT ---
with open(output_file, "a") as f:
    f.write("Pairwise Mann–Whitney U tests by Time point\n")
    f.write("=" * 50 + "\n")
    for tp in sorted(data['Time point'].unique()):
        f.write(f"Time point: {tp}\n")
        for i in range(len(groups)):
            for j in range(i+1, len(groups)):
                g1 = groups[i]
                g2 = groups[j]
                x = data.loc[data['Time point'] == tp, g1].dropna()
                y = data.loc[data['Time point'] == tp, g2].dropna()
                if len(x) > 0 and len(y) > 0:
                    U, p = mannwhitneyu(x, y, alternative='two-sided')
                    f.write(f"  {g1} vs {g2}: U={U:.2f}, p={p:.4f}\n")
        f.write("\n")

# Antes de personalizar la gráfica
print("--------------------------------")
print("--------------------------------")
print("5. Personalizando gráfica final")
# Personalizar gráfica
# plt.title(title + graph_name, fontsize=18)
plt.title(title + '$\\mathit{' + graph_name + '}$', fontsize=18)
plt.xlabel(label_x, fontsize=18)
plt.xticks(range(0, 25, 3), fontsize=15)
ax1.set_ylabel(label_y, fontsize=18)
plt.xlim(0, 24)
ax1.fill_between([12, 24], [-40, -40], [value_max * 3, value_max * 3], color='lightgrey')
plt.yticks(fontsize=15)
ax1.set_ylim(-0.3, max_graph-0.01)
ax1.set_yticks(np.arange(min_graph, max_graph, interval_graph))
if legend_graph:
    lg = ax1.legend(loc='upper right', fontsize=14, frameon=True) # bbox_to_anchor=(1.5, 1.0)

fig.set_size_inches(7, 5)

# Antes de guardar
print("6. Guardando resultados y gráfica")

# Guardar y mostrar gráfica
plt.savefig(path + graph_name + iqr_name + ".png", format='png', dpi=300, bbox_inches='tight', transparent=True)
plt.show()


