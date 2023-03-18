import {
    Circle,
    Icon,
    Layout,
    Line,
    Rect,
} from "@motion-canvas/2d/lib/components";
import { makeScene2D } from "@motion-canvas/2d/lib/scenes";
import { all, loop, waitFor } from "@motion-canvas/core/lib/flow";
import { makeSlide, SlideLayout } from "../util";
import {
    createRef,
    makeRef,
    range,
    useRandom,
} from "@motion-canvas/core/lib/utils";
import { ThreadGenerator } from "@motion-canvas/core/lib/threading";
import { easeInCubic, easeOutCubic } from "@motion-canvas/core/lib/tweening";
import { makeOutlet } from "../components/outlet";
import { Nord } from "@hhenrichsen/motion-canvas-nord";
import { Color } from "@motion-canvas/core/lib/types";
import { createSignal } from "@motion-canvas/core/lib/signals";

export default makeScene2D(function* (view) {
    yield* makeSlide(
        view,
        {
            section: "Outlets",
            title: "Let's Talk about Outlets",
            layout: SlideLayout.DEFAULT,
        },
        function* ({ view, toCancel, subslide }) {
            const outlet = makeOutlet(
                view,
                300,
                new Color(Nord.Colors.Aurora0).brighten(1)
            );
            const xPos = createSignal(400);
            outlet.position(() => [-xPos(), 0]);
            outlet.layout(false);
            const icon = createRef<Icon>();
            view.add(
                <Icon
                    layout={false}
                    position={() => [xPos(), 0]}
                    ref={icon}
                    icon={"icon-park-solid:new-computer"}
                    size={300}
                    color={Nord.Colors.PolarNight0}
                ></Icon>
            );
            const line = createRef<Line>();
            view.add(
                <Line
                    layout={false}
                    points={[
                        [-250, 0],
                        [-100, 100],
                        [100, -100],
                        [255, 34],
                        [255, 34],
                    ]}
                    stroke={Nord.Colors.PolarNight0}
                    lineWidth={12}
                    lineCap={"round"}
                    radius={200}
                    ref={line}
                ></Line>
            );
            yield* waitFor(1);
            yield* subslide();
            yield* icon().opacity(0, 1);
            icon().icon("mdi:hair-dryer");
            icon().rotation(75);
            line().save();
            yield* all(
                line().points(
                    [
                        [-250, 0],
                        [-100, 100],
                        [0, -100],
                        [100, 34],
                        [255, 33],
                    ],
                    1
                ),
                icon().opacity(1, 1)
            );
            yield* subslide();
        }
    );
});
