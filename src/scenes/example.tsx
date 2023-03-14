import {
    Circle,
    Img,
    Layout,
    Line,
    Node,
    Rect,
    Txt,
} from "@motion-canvas/2d/lib/components";
import { makeScene2D } from "@motion-canvas/2d/lib/scenes";
import { all, loop, waitFor } from "@motion-canvas/core/lib/flow";
import { DefaultTextProps, makeSlide, SlideLayout } from "../util";
import Hunter from "../assets/Hunter.jpg";
import { Nord } from "@hhenrichsen/motion-canvas-nord";
import { createRef, makeRef, useRandom } from "@motion-canvas/core/lib/utils";
import { ThreadGenerator } from "@motion-canvas/core/lib/threading";
import { easeInCubic, easeOutCubic } from "@motion-canvas/core/lib/tweening";

const safeColors = [
    Nord.Colors.Frost0,
    Nord.Colors.Frost1,
    Nord.Colors.Frost2,
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
            subtitle: "Building for Flexibility",
            layout: SlideLayout.TITLE,
        },
        function* ({ view, toCancel }) {
            const rects: Rect[] = [];
            const random = useRandom();

            const container = createRef<Layout>();
            view.add(
                <Rect layout={false} ref={container} size={view.size()}></Rect>
            );

            for (let i = 0; i < 20; i++) {
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
                const tmp = createRef<Layout>();
                view.add(<Layout ref={tmp} cache layout={false}></Layout>);
                for (let c = 0; c < 2; c++) {
                    const rect = rects[random.nextInt(0, rects.length)];
                    const connectionCount = random.nextInt(2, 7);

                    for (let i = 0; i < connectionCount; i++) {
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
                    ...lines.map(function* (line): ThreadGenerator {
                        const target = rects[random.nextInt(0, rects.length)];
                        const circle = createRef<Circle>();
                        yield* line.points(
                            [line.points()[0], target.position()],
                            2,
                            easeInCubic
                        );
                        tmp().add(
                            <Circle
                                layout={false}
                                position={target.position()}
                                opacity={0}
                                size={5}
                                fill={line.stroke()}
                                ref={circle}
                            />
                        );
                        yield* all(
                            circle().opacity(1, 1.0, easeOutCubic),
                            circle().size(30, 0.7, easeOutCubic)
                        );
                        yield* waitFor(1);
                        yield* tmp().opacity(0, 2);

                        line.remove();
                        circle().remove();
                    })
                );
            });
            yield connectionLoop;
            yield* waitFor(20);
            toCancel.push(connectionLoop);
        }
    );
    yield* makeSlide(
        view,
        {
            title: "Introduction",
        },
        function* ({ view }) {
            view.add(
                <Rect size={450} radius={225} fill={Nord.Colors.Frost0}>
                    <Node cache position={25}>
                        <Rect size={400} radius={200} fill={"#ffffff"}>
                            <Img
                                src={Hunter}
                                height={1200}
                                position={[-35, 100]}
                                compositeOperation={"source-in"}
                                layout={false}
                            />
                        </Rect>
                    </Node>
                </Rect>
            );
            view.add(
                <Txt
                    {...DefaultTextProps}
                    text={
                        "Hi, I'm Hunter\n" +
                        "• I'm a Software Engineer at Lucid\n" +
                        "• I'm a Utah State Alumnus\n" +
                        "• I minored in English and Math\n" +
                        "• I lead a team of 4 engineers on Lucidspark\n" +
                        "• I'm on the USU CS Discord -- say hi sometime!"
                    }
                ></Txt>
            );
            yield* waitFor(10);
        }
    );
});
