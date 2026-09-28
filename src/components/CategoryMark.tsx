import PixelShape, { type PixelShapeName } from "./PixelShape";
import type { Category } from "@/lib/journal-shared";

/* Each journal category gets its own pixel glyph. */
const SHAPES: Record<Category, PixelShapeName> = {
  achievement: "sparkle",
  event: "circle",
  milestone: "diamond",
  note: "square",
};

export default function CategoryMark({ category }: { category: Category }) {
  return <PixelShape name={SHAPES[category]} className={`cat-mark cat-mark--${category}`} />;
}
