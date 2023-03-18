import { Nord } from "@hhenrichsen/motion-canvas-nord";
import { makeScene2D } from "@motion-canvas/2d";
import { Rect, Img, Txt, Node } from "@motion-canvas/2d/lib/components";
import { waitFor } from "@motion-canvas/core/lib/flow";
import { makeSlide, DefaultTextProps } from "../util";
import Hunter from "../assets/Hunter.jpg";

export default makeScene2D(function* (view) {
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
                        "• I'm on the USU CS and HackUSU Discords,\n" +
                        "  come say hi sometime!"
                    }
                ></Txt>
            );
            yield* waitFor(5);
        }
    );
})