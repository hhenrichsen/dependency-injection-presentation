import { Nord } from "@hhenrichsen/motion-canvas-nord";
import { Circle, Layout, Rect } from "@motion-canvas/2d/lib/components";
import { createSignal } from "@motion-canvas/core/lib/signals";
import { PossibleColor, PossibleVector2, Vector2 } from "@motion-canvas/core/lib/types";
import { createRef } from "@motion-canvas/core/lib/utils";

export function makeOutlet(view: Layout, initSize: PossibleVector2, color: PossibleColor) {
    const containerRef = createRef<Rect>();
    const size = createSignal(new Vector2(initSize), Vector2.arcLerp);
    view.add(<Rect ref={containerRef} size={size} fill={color} radius={() => size().x / 8}></Rect>);

    const container = containerRef();

    container.add(
        <>
            <Rect layout={false} size={() => size().mul([0.08, 0.2])} x={() => -size().x / 4} y={() => -size().y / 8} fill={Nord.Colors.PolarNight0}></Rect>
            <Rect layout={false} size={() => size().mul([0.08, 0.2])} x={() => size().x / 4} y={() => -size().y / 8} fill={Nord.Colors.PolarNight0}></Rect>
            <Circle layout={false} size={() => Vector2.one.scale(size().x * 0.15)} y={() => size().y / 4} fill={Nord.Colors.PolarNight0}></Circle>
        </>
    );
    
    return container;
}
