#!/bin/bash
# Clips Ken Burns para la pasarela Macumba — arte pintado 100% estable (sin IA de video).
# Genera 5 clips individuales (01,03,04,05,06) + ensambla el desfile completo con crossfades.
# El clip 02 ya existe (clip-kenburns-02.mp4 → se renombra a clip-02-roja-espalda.mp4).
#
# Movimientos de cámara (estilo editorial, sutiles):
#   01 push-in 1.00→1.12 (abre, frontal)   · 03 push-out 1.14→1.00 (revela el arte splatter)
#   04 push-in 1.00→1.14                   · 05 push-in + deriva hacia abajo (abrigo largo)
#   06 push-in 1.00→1.12 + deriva hacia arriba · 02 push-in 1.00→1.14 (ya generado)
# Desfile: 01 → 04 → 03 → 05 → 02 → 06 (13s, crossfade 0.4s)
set -euo pipefail

DIR=/home/z/my-project/download/macumba-pasarela
OUT=$DIR/clips
mkdir -p "$OUT"

ENC="-c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -movflags +faststart -an"

clip() { # $1=src $2=dst $3=escala $4=zoompan $5=salida_size $6=d
  ffmpeg -y -v error -i "$1" -vf "$3,setsar=1,zoompan=$4:d=$6:s=$5:fps=30,format=yuv420p" \
    $ENC "$2"
}

# ---- Clips individuales (5s, 30fps) ----
# 01 · 768x1344 · push-in 1.00→1.12 (pre-escala 2x para nitidez al acercar)
if [ ! -f "$OUT/clip-01-roja-frente.mp4" ]; then
  clip "$DIR/01-roja-frente.png" "$OUT/clip-01-roja-frente.mp4" \
    "scale=1536:2688" \
    "z='min(zoom+0.0008,1.12)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'" \
    "768x1344" 150
  echo "OK clip-01"
fi

# 03 · push-out 1.14→1.00 (revela)
if [ ! -f "$OUT/clip-03-black-inspiration.mp4" ]; then
  clip "$DIR/03-black-inspiration.png" "$OUT/clip-03-black-inspiration.mp4" \
    "scale=1728:2304:force_original_aspect_ratio=increase,crop=1728:2304" \
    "z='if(lte(on,1),1.14,max(zoom-0.000933,1.0))':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'" \
    "864x1152" 150
  echo "OK clip-03"
fi

# 04 · push-in 1.00→1.14
if [ ! -f "$OUT/clip-04-asian-soul.mp4" ]; then
  clip "$DIR/04-asian-soul.png" "$OUT/clip-04-asian-soul.mp4" \
    "scale=1728:2304:force_original_aspect_ratio=increase,crop=1728:2304" \
    "z='min(zoom+0.000933,1.14)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'" \
    "864x1152" 150
  echo "OK clip-04"
fi

# 05 · push-in 1.00→1.14 + deriva suave hacia abajo (abrigo largo)
if [ ! -f "$OUT/clip-05-alma-dorada.mp4" ]; then
  clip "$DIR/05-alma-dorada.png" "$OUT/clip-05-alma-dorada.mp4" \
    "scale=1728:2304:force_original_aspect_ratio=increase,crop=1728:2304" \
    "z='min(zoom+0.000933,1.14)':x='iw/2-(iw/zoom/2)':y='(ih-ih/zoom)*(0.40+0.10*on/150)'" \
    "864x1152" 150
  echo "OK clip-05"
fi

# 06 · push-in 1.00→1.12 + deriva suave hacia arriba
if [ ! -f "$OUT/clip-06-espiritu-leon.mp4" ]; then
  clip "$DIR/06-espiritu-leon.png" "$OUT/clip-06-espiritu-leon.mp4" \
    "scale=1728:2304:force_original_aspect_ratio=increase,crop=1728:2304" \
    "z='min(zoom+0.0008,1.12)':x='iw/2-(iw/zoom/2)':y='(ih-ih/zoom)*(0.50-0.10*on/150)'" \
    "864x1152" 150
  echo "OK clip-06"
fi

# ---- Desfile completo (864x1152, ~13s, crossfade 0.4s, fundido entrada/salida) ----
# La 01 (4:7) va con fondo desenfocado de sí misma para llenar el lienzo 3:4.
ffmpeg -y -v error \
  -i "$DIR/01-roja-frente.png" \
  -i "$DIR/04-asian-soul.png" \
  -i "$DIR/03-black-inspiration.png" \
  -i "$DIR/05-alma-dorada.png" \
  -i "$DIR/02-roja-espalda.png" \
  -i "$DIR/06-espiritu-leon.png" \
  -filter_complex "\
[0:v]split=2[b0][f0];\
[f0]scale=-2:1152[f0g];\
[b0]scale=864:1152:force_original_aspect_ratio=increase,crop=864:1152,boxblur=24:2[b0g];\
[b0g][f0g]overlay=(W-w)/2:(H-h)/2,setsar=1,scale=1728:2304,zoompan=z='min(zoom+0.0016,1.12)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=75:s=864x1152:fps=30,settb=AVTB,fps=30,format=yuv420p[v0];\
[1:v]scale=1728:2304:force_original_aspect_ratio=increase,crop=1728:2304,setsar=1,zoompan=z='min(zoom+0.001867,1.14)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=75:s=864x1152:fps=30,settb=AVTB,fps=30,format=yuv420p[v1];\
[2:v]scale=1728:2304:force_original_aspect_ratio=increase,crop=1728:2304,setsar=1,zoompan=z='if(lte(on,1),1.14,max(zoom-0.001867,1.0))':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=75:s=864x1152:fps=30,settb=AVTB,fps=30,format=yuv420p[v2];\
[3:v]scale=1728:2304:force_original_aspect_ratio=increase,crop=1728:2304,setsar=1,zoompan=z='min(zoom+0.001867,1.14)':x='iw/2-(iw/zoom/2)':y='(ih-ih/zoom)*(0.40+0.10*on/75)':d=75:s=864x1152:fps=30,settb=AVTB,fps=30,format=yuv420p[v3];\
[4:v]scale=1728:2304:force_original_aspect_ratio=increase,crop=1728:2304,setsar=1,zoompan=z='min(zoom+0.001867,1.14)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=75:s=864x1152:fps=30,settb=AVTB,fps=30,format=yuv420p[v4];\
[5:v]scale=1728:2304:force_original_aspect_ratio=increase,crop=1728:2304,setsar=1,zoompan=z='min(zoom+0.0016,1.12)':x='iw/2-(iw/zoom/2)':y='(ih-ih/zoom)*(0.50-0.10*on/75)':d=75:s=864x1152:fps=30,settb=AVTB,fps=30,format=yuv420p[v5];\
[v0][v1]xfade=transition=fade:duration=0.4:offset=2.1[x1];\
[x1][v2]xfade=transition=fade:duration=0.4:offset=4.2[x2];\
[x2][v3]xfade=transition=fade:duration=0.4:offset=6.3[x3];\
[x3][v4]xfade=transition=fade:duration=0.4:offset=8.4[x4];\
[x4][v5]xfade=transition=fade:duration=0.4:offset=10.5[x5];\
[x5]fade=t=in:st=0:d=0.4,fade=t=out:st=12.6:d=0.4,format=yuv420p[vout]" \
  -map "[vout]" $ENC "$DIR/desfile-completo.mp4"
echo "OK desfile-completo.mp4"
