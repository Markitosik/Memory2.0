export function load_settings_theme(context, qwe)
{
   qwe = 222;
  context.clearRect(0, 0, 1080, 720);
  context.fillStyle = '#95A792';
  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(0, 720);
  context.lineTo(200, 720);
  context.lineTo(450, 0);
  context.closePath();
  context.fill();

  context.fillStyle = '#CADEFC';
  context.beginPath();
  context.moveTo(200, 720);
  context.lineTo(450, 0);
  context.lineTo(650, 0);
  context.lineTo(880, 720);
  context.closePath();
  context.fill();

  context.fillStyle = '#EAAFAF';
  context.beginPath();
  context.moveTo(1080, 0);
  context.lineTo(1080, 720);
  context.lineTo(880, 720);
  context.lineTo(650, 0);
  context.closePath();
  context.fill();
  return qwe;
}
