/* Tiny pixel-grid glyphs that match the Geist Pixel face. Pure SVG, inherits
   currentColor, so they take on whatever colour the surrounding text has. */

const MAPS = {
  asterisk: ["...#...", ".#.#.#.", "..###..", "#######", "..###..", ".#.#.#.", "...#..."],
  plus:     ["...#...", "...#...", "...#...", "#######", "...#...", "...#...", "...#..."],
  circle:   ["..###..", ".#####.", "#######", "#######", "#######", ".#####.", "..###.."],
  ring:     ["..###..", ".#...#.", "#.....#", "#.....#", "#.....#", ".#...#.", "..###.."],
  diamond:  ["...#...", "..###..", ".#####.", "#######", ".#####.", "..###..", "...#..."],
  square:   ["#######", "#.....#", "#.....#", "#.....#", "#.....#", "#.....#", "#######"],
  arrow:    ["...#...", "....#..", ".....#.", "#######", ".....#.", "....#..", "...#..."],
  down:     ["...#...", "...#...", "...#...", "#..#..#", ".#.#.#.", "..###..", "...#..."],
  sparkle:  ["...#...", "...#...", "..#.#..", "##...##", "..#.#..", "...#...", "...#..."],
} as const;

export type PixelShapeName = keyof typeof MAPS;

export default function PixelShape({
  name,
  size = "1em",
  className,
  title,
  ...rest
}: {
  name: PixelShapeName;
  size?: number | string;
  className?: string;
  title?: string;
} & Record<`data-${string}`, string | number | undefined>) {
  const rows = MAPS[name];
  const cells: [number, number][] = [];
  rows.forEach((row, y) => [...row].forEach((c, x) => c === "#" && cells.push([x, y])));

  return (
    <svg
      viewBox="0 0 7 7"
      width={size}
      height={size}
      className={`px-shape ${className ?? ""}`}
      shapeRendering="crispEdges"
      fill="currentColor"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      {...rest}
    >
      {cells.map(([x, y]) => <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" />)}
    </svg>
  );
}
