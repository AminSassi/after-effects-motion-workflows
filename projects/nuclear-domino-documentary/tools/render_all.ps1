# Renders every act to 03_AFTER_EFFECTS as *_v2.mp4 (new files; old renders are kept)
Set-Location $PSScriptRoot
$out = "..\03_AFTER_EFFECTS"
$jobs = @(
  
  @('act4.mjs', 'a4', 2700, "$out\ND_A4_3D_v2.mp4"),
  @('act5.mjs', 'a5', 2323, "$out\ND_A5_3D_v2.mp4"),
  @('act6.mjs', 'a6', 2301, "$out\ND_A6_3D_v2.mp4"),
  @('act2.mjs', 'a2', 1657, "$out\ND_A2_3D_v2.mp4"),
  @('m1_3d.mjs', 'm1', 1525, "$out\ND_M1_3D_v3.mp4")
)
foreach ($j in $jobs) {
  node render.mjs $j[0] $j[1] $j[2] $j[3] 5
  if ($LASTEXITCODE -ne 0) { node render.mjs $j[0] $j[1] $j[2] $j[3] 4 }  # retry missing chunks once
  "$($j[1]) exit $LASTEXITCODE"
}
"ALL DONE"
