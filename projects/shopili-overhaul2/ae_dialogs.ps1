# List After Effects modal dialogs (#32770), save an image of each, optionally press Enter on them.
# usage: powershell -File ae_dialogs.ps1 [-Enter]
param([switch]$Enter)
Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies System.Drawing @"
using System; using System.Text; using System.Drawing; using System.Collections.Generic; using System.Runtime.InteropServices;
public class AED { public delegate bool EP(IntPtr h, IntPtr l);
[DllImport("user32.dll")] static extern bool EnumWindows(EP f, IntPtr l);
[DllImport("user32.dll")] static extern uint GetWindowThreadProcessId(IntPtr h, out uint p);
[DllImport("user32.dll")] static extern bool IsWindowVisible(IntPtr h);
[DllImport("user32.dll")] static extern int GetClassName(IntPtr h, StringBuilder s, int n);
[DllImport("user32.dll")] static extern bool GetWindowRect(IntPtr h, out RECT r);
[DllImport("user32.dll")] static extern bool PrintWindow(IntPtr h, IntPtr dc, uint f);
[DllImport("user32.dll")] public static extern bool PostMessage(IntPtr h, uint m, IntPtr w, IntPtr l);
public struct RECT{public int L,T,R,B;}
public static List<IntPtr> Dialogs(uint pid){ var r=new List<IntPtr>(); EnumWindows((h,l)=>{ uint p; GetWindowThreadProcessId(h,out p); var b=new StringBuilder(64); GetClassName(h,b,64); if(p==pid && IsWindowVisible(h) && b.ToString()=="#32770") r.Add(h); return true;}, IntPtr.Zero); return r; }
public static void Snap(IntPtr h,string path){ RECT r; GetWindowRect(h,out r); var b=new Bitmap(Math.Max(1,r.R-r.L),Math.Max(1,r.B-r.T)); using(var g=Graphics.FromImage(b)){ var dc=g.GetHdc(); PrintWindow(h,dc,2); g.ReleaseHdc(dc);} b.Save(path);} }
"@
$ae = Get-Process AfterFX -ErrorAction SilentlyContinue
if (-not $ae) { "AE not running"; exit }
$i = 0
foreach ($h in [AED]::Dialogs([uint32]$ae.Id)) {
  $p = Join-Path $PSScriptRoot ("logs\dialog_$i.png"); [AED]::Snap($h, $p); "dialog $h -> $p"
  if ($Enter) { [AED]::PostMessage($h, 0x0100, [IntPtr]0x0D, [IntPtr]0) | Out-Null; [AED]::PostMessage($h, 0x0101, [IntPtr]0x0D, [IntPtr]0) | Out-Null; "  pressed Enter" }
  $i++
}
if ($i -eq 0) { "no dialogs" }
