import {
    Circle,
    Layout,
    Line,
    Rect,
} from "@motion-canvas/2d/lib/components";
import { makeScene2D } from "@motion-canvas/2d/lib/scenes";
import { all, loop, waitFor } from "@motion-canvas/core/lib/flow";
import { makeSlide, SlideLayout } from "../util";
import { createRef, makeRef, useRandom } from "@motion-canvas/core/lib/utils";
import { ThreadGenerator } from "@motion-canvas/core/lib/threading";
import { easeInCubic, easeOutCubic } from "@motion-canvas/core/lib/tweening";
import { makeOutlet } from "../components/outlet";
import { Nord } from "@hhenrichsen/motion-canvas-nord";
import { Color } from "@motion-canvas/core/lib/types";
import dryer from "../assets/dryer.jpg"

export default makeScene2D(function* (view) {
    yield* makeSlide(
        view,
        {
            title: "Outlets",
            subtitle: "Thanks to Steven van Deursen for this analogy",
            layout: SlideLayout.SECTION,
            image: dryer,
        },
        function* ({ view, toCancel }) {
            yield* waitFor(5);
        }
    );
});
