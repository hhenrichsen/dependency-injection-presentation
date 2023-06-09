import {
    Circle,
    Layout,
    Line,
    Rect,
} from "@motion-canvas/2d/lib/components";
import { makeScene2D } from "@motion-canvas/2d/lib/scenes";
import { all, loop, waitFor } from "@motion-canvas/core/lib/flow";
import { makeSlide, SlideLayout } from "../util";
import { Nord } from "@hhenrichsen/motion-canvas-nord";
import { createRef, makeRef, useRandom } from "@motion-canvas/core/lib/utils";
import { ThreadGenerator } from "@motion-canvas/core/lib/threading";
import { easeInCubic, easeOutCubic } from "@motion-canvas/core/lib/tweening";

const safeColors = [
    Nord.Colors.Frost1,
    Nord.Colors.Frost3,
    Nord.Colors.Aurora0,
    Nord.Colors.Aurora1,
    Nord.Colors.Aurora2,
    Nord.Colors.Aurora3,
    Nord.Colors.Aurora4,
];

export default makeScene2D(function* (view) {
    yield* makeSlide(
        view,
        {
            title: "Dependency Injection",
            subtitle: "Inverting Control for Great Good",
            layout: SlideLayout.TITLE,
        },
        function* ({ view, toCancel }) {
            const rectCt = 20;
            const rects: Rect[] = [];
            const random = useRandom();

            const container = createRef<Layout>();
            view.add(
                <Rect layout={false} ref={container} size={view.size()}></Rect>
            );

            for (let i = 0; i < rectCt; i++) {
                container().add(
                    <Rect
                        size={50}
                        ref={makeRef(rects, i)}
                        position={[
                            random.nextInt(-view.width() / 2, view.width() / 2),
                            random.nextInt(
                                -view.height() / 2,
                                view.height() / 2
                            ),
                        ]}
                        fill={safeColors[random.nextInt(0, safeColors.length)]}
                        radius={5}
                    ></Rect>
                );
            }

            const connectionLoop = loop(Infinity, () => {
                const lines: Line[] = [];
                const target: number[] = [];
                const targets = [...Array(rectCt)]
                    .map((_, i) => i)
                    .sort(() => Math.random() - 0.5);
                const tmp = createRef<Layout>();
                view.add(<Layout ref={tmp} cache layout={false}></Layout>);
                for (let c = 0; c < 2; c++) {
                    const idx = random.nextInt(0, rects.length);
                    const rect = rects[idx];
                    const connectionCount = lines.length
                        ? 8 - lines.length
                        : random.nextInt(2, 7);

                    for (let i = 0; i < connectionCount; i++) {
                        if (targets[0] == idx) {
                            targets.shift();
                        }
                        target.push(targets.shift());
                        tmp().add(
                            <Line
                                layout={false}
                                ref={makeRef(lines, i)}
                                points={[rect.position(), rect.position()]}
                                stroke={rect.fill}
                                lineWidth={3}
                            ></Line>
                        );
                    }
                }
                return all(
                    ...lines.map(function* (line, idx): ThreadGenerator {
                        const rect = rects[target[idx]];
                        const circle = createRef<Circle>();
                        yield* line.points(
                            [line.points()[0], rect.position()],
                            1,
                            easeInCubic
                        );
                        tmp().add(
                            <Circle
                                layout={false}
                                position={rect.position()}
                                opacity={0}
                                size={5}
                                fill={line.stroke()}
                                ref={circle}
                            />
                        );
                        yield* all(
                            circle().opacity(1, 0.5, easeOutCubic),
                            circle().size(30, 0.4, easeOutCubic)
                        );
                        yield* waitFor(0.5);
                        yield* tmp().opacity(0, 1);

                        line.remove();
                        circle().remove();
                    })
                );
            });
            yield connectionLoop;
            yield* waitFor(4);
            toCancel.push(connectionLoop);
        }
    );
});
