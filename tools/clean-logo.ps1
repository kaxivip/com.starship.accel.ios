Add-Type -AssemblyName System.Drawing

$code = @"
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;

public class ImgProc {
    public static void Process(string src, string dst) {
        using (var img = Image.FromFile(src))
        using (var bmp = new Bitmap(img)) {
            int w = bmp.Width, h = bmp.Height;
            var bgColor = bmp.GetPixel(5, 5);
            using (var g = Graphics.FromImage(bmp)) {
                using (var brush = new SolidBrush(bgColor)) {
                    // Cover watermark bottom-right area
                    g.FillRectangle(brush, (int)(w*0.76), (int)(h*0.92), (int)(w*0.24), (int)(h*0.08));
                }
            }
            int bgR = bgColor.R, bgG = bgColor.G, bgB = bgColor.B;
            var data = bmp.LockBits(new Rectangle(0,0,w,h), ImageLockMode.ReadWrite, PixelFormat.Format32bppArgb);
            byte[] bytes = new byte[data.Stride * h];
            Marshal.Copy(data.Scan0, bytes, 0, bytes.Length);
            for (int i = 0; i < bytes.Length; i += 4) {
                int b = bytes[i], gg = bytes[i+1], r = bytes[i+2];
                int diff = Math.Abs(r - bgR) + Math.Abs(gg - bgG) + Math.Abs(b - bgB);
                if (diff < 45) {
                    bytes[i+3] = 0;
                } else if (diff < 100) {
                    bytes[i+3] = (byte)((diff - 45) * 255 / 55);
                }
            }
            Marshal.Copy(bytes, 0, data.Scan0, bytes.Length);
            bmp.UnlockBits(data);
            bmp.Save(dst, ImageFormat.Png);
        }
    }
}
"@

Add-Type -TypeDefinition $code -ReferencedAssemblies System.Drawing

$src = "d:\QODER.COM\com.starship.accel.ios\tools\_orig.png"
$dst = "d:\QODER.COM\com.starship.accel.ios\public\logo.png"
[ImgProc]::Process($src, $dst)
Write-Host "Done. Output size:"
Get-Item $dst | Select-Object Name, Length
