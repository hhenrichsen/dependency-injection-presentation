import { Nord } from "@hhenrichsen/motion-canvas-nord";
import {
    Img,
    Layout,
    Line,
    Rect,
    Txt,
    TxtProps,
    View2D,
    Node,
} from "@motion-canvas/2d/lib/components";
import {
    CodeBlock,
    CodeProps,
} from "@motion-canvas/2d/lib/components/CodeBlock";
import {
    cancel,
    Thread,
    ThreadGenerator,
} from "@motion-canvas/core/lib/threading";
import { beginSlide, createRef } from "@motion-canvas/core/lib/utils";
import logo from "./assets/lucid.svg";

const useCustomFonts = true;
const normalFontSize = 50;
const titleFontSize = 100;

export const DefaultTextProps: TxtProps = {
    fontFamily: useCustomFonts ? "Greycliff CF" : "sans-serif",
    fill: Nord.Colors.PolarNight1,
    fontSize: normalFontSize,
    lineHeight: normalFontSize * 1.2,
    fontWeight: 600,
};

export const DefaultTitleProps: TxtProps = {
    ...DefaultTextProps,
    fontSize: titleFontSize,
    lineHeight: titleFontSize * 1.2,
    fontWeight: 700,
};

export const DefaultCodeProps: CodeProps = {
    theme: Nord.Theme,
    fontFamily: useCustomFonts ? "Ellograph CF" : "monospace",
    fontSize: normalFontSize,
};

export const HighlightCodeProps: CodeProps = {
    ...DefaultCodeProps,
    fontSize: titleFontSize,
};

export enum SlideLayout {
    DEFAULT = 1,
    SECTION = 2,
    TITLE = 3,
}

export function* makeSlide(
    view: View2D,
    options:
        | {
              title?: string;
              subtitle?: string;
              section?: string;
              image?: string;
              layout?: SlideLayout;
              imageProportion?: number;
          }
        | undefined,
    slide: (params: {
        background: Rect;
        view: Layout;
        title: Txt;
        subtitle: Txt;
        section: Txt;
        image?: Img;
        toCancel: ThreadGenerator[];
    }) => ThreadGenerator
): ThreadGenerator {
    const titleText = options?.title ?? "Untitled";
    const subtitleText = options?.subtitle;
    const sectionText = options?.section;

    const toCancel: ThreadGenerator[] = [];

    if (!options.layout || options.layout == SlideLayout.DEFAULT) {
        yield* defaultSlideLayout(
            view,
            titleText,
            toCancel,
            slide,
            subtitleText,
            sectionText
        );
    } else if (options.layout == SlideLayout.SECTION) {
        yield* sectionSlideLayout(
            view,
            titleText,
            options.image,
            toCancel,
            slide,
            subtitleText,
            sectionText,
            options.imageProportion
        );
    } else if (options.layout == SlideLayout.TITLE) {
        yield* titleSlideLayout(view, titleText, toCancel, slide, subtitleText);
    }

    yield* beginSlide(titleText.toLowerCase().replace(/[\W ]+/g, "-"));
    view.removeChildren();
    cancel(...toCancel);
}

function* defaultSlideLayout(
    view: View2D,
    titleText: string,
    toCancel: ThreadGenerator[],
    slide: (params: {
        background: Rect;
        view: Layout;
        title: Txt;
        subtitle: Txt;
        section: Txt;
        image?: Img;
        toCancel: ThreadGenerator[];
    }) => ThreadGenerator,
    subtitleText?: string,
    sectionText?: string
): ThreadGenerator {
    const newView = createRef<Layout>();
    const background = createRef<Rect>();
    const title = createRef<Txt>();
    const subtitle = createRef<Txt>();
    const section = createRef<Txt>();

    yield view.add(
        <>
            <Rect fill={Nord.Colors.SnowStorm2} size={view.size()} />
            <Layout layout direction={"column"} size={view.size()}>
                <Layout
                    layout
                    direction={"column"}
                    offset={[-1, -1]}
                    position={view.size().div(2).mul(-1)}
                    paddingTop={20}
                    paddingLeft={50}
                    grow={0}
                >
                    <Txt
                        ref={section}
                        {...DefaultTitleProps}
                        fontSize={titleFontSize * 0.4}
                        lineHeight={titleFontSize * 1.2 * 0.4}
                        fontWeight={600}
                        text={sectionText}
                        fill={Nord.Colors.Frost3}
                    />
                    <Txt ref={title} {...DefaultTitleProps} text={titleText} />
                    <Txt
                        ref={subtitle}
                        {...DefaultTitleProps}
                        fontWeight={400}
                        fontSize={titleFontSize * 0.4}
                        lineHeight={titleFontSize * 1.2 * 0.4}
                        fontStyle={"italic"}
                        text={subtitleText}
                        stroke={Nord.Colors.Frost3}
                    />
                </Layout>
                <Layout
                    ref={newView}
                    direction={"row"}
                    alignItems={"center"}
                    justifyContent={"space-around"}
                    grow={1}
                    marginTop={20}
                ></Layout>
                <Layout
                    layout
                    direction={"row"}
                    justifyContent={"space-between"}
                    grow={0}
                    alignItems={"center"}
                >
                    <Img
                        src={logo}
                        marginLeft={50}
                        offset={[-1, -1]}
                        scale={1.5}
                    />
                    <Line
                        points={[
                            [0, 0],
                            [0, -200],
                            [-200, 0],
                        ]}
                        x={view.size.x() / 2}
                        y={view.size.y() / 2}
                        fill={Nord.Colors.SnowStorm0}
                    />
                </Layout>
            </Layout>
        </>
    );

    yield* slide({
        background: background(),
        subtitle: subtitle(),
        title: title(),
        section: section(),
        view: newView(),
        image: undefined,
        toCancel,
    });
}

function* sectionSlideLayout(
    view: View2D,
    titleText: string,
    imageSrc: string,
    toCancel: ThreadGenerator[],
    slide: (params: {
        background: Rect;
        view: Layout;
        title: Txt;
        subtitle: Txt;
        section: Txt;
        image?: Img;
        toCancel: ThreadGenerator[];
    }) => ThreadGenerator,
    subtitleText?: string,
    sectionText?: string,
    imageProportion: number = 0.3
): ThreadGenerator {
    const newView = createRef<Layout>();
    const background = createRef<Rect>();
    const title = createRef<Txt>();
    const subtitle = createRef<Txt>();
    const section = createRef<Txt>();
    const image = createRef<Img>();

    const cornerCut = 200;

    yield view.add(
        <>
            <Rect fill={Nord.Colors.SnowStorm1} size={view.size()} />
            <Layout layout direction={"row"}>
                <Layout cache size={view.size().mul([imageProportion, 1])}>
                    <Line
                        layout={false}
                        points={[
                            view.size().mul(-0.5),
                            view
                                .size()
                                .mul(-0.5)
                                .addX(view.size().x * imageProportion),
                            view
                                .size()
                                .mul([-0.5, 0.5])
                                .add([
                                    view.size().x * imageProportion,
                                    -cornerCut,
                                ]),
                            view
                                .size()
                                .mul([-0.5, 0.5])
                                .addX(
                                    view.size().x * imageProportion - cornerCut
                                ),
                            view.size().mul([-0.5, 0.5]),
                        ]}
                        offset={[-1.5, 0]}
                        fill={"#ffffff"}
                    ></Line>
                    <Img
                        src={imageSrc}
                        ref={image}
                        height={view.size().y}
                        offset={-1}
                        position={view.size().mul(-0.5)}
                        compositeOperation={"source-in"}
                    />
                </Layout>
                <Layout
                    layout
                    direction={"column"}
                    width={view.size().x * (1 - imageProportion)}
                >
                    <Layout
                        layout
                        direction={"column"}
                        offset={[-1, -1]}
                        paddingTop={20}
                        paddingLeft={50}
                        grow={0}
                    >
                        <Txt
                            ref={section}
                            {...DefaultTitleProps}
                            fontSize={titleFontSize * 0.4}
                            lineHeight={titleFontSize * 1.2 * 0.4}
                            fontWeight={600}
                            text={sectionText}
                            fill={Nord.Colors.Frost3}
                        />
                        <Txt
                            ref={title}
                            {...DefaultTitleProps}
                            text={titleText}
                        />
                        <Txt
                            ref={subtitle}
                            {...DefaultTitleProps}
                            fontWeight={400}
                            fontSize={titleFontSize * 0.4}
                            lineHeight={titleFontSize * 1.2 * 0.4}
                            fontStyle={"italic"}
                            text={subtitleText}
                            stroke={Nord.Colors.Frost3}
                        />
                    </Layout>
                    <Layout
                        ref={newView}
                        direction={"row"}
                        alignItems={"center"}
                        justifyContent={"space-around"}
                        grow={1}
                        marginTop={20}
                    ></Layout>
                    <Layout
                        layout
                        direction={"row"}
                        justifyContent={"space-between"}
                        grow={0}
                        alignItems={"center"}
                        height={100}
                    >
                        <Img
                            src={logo}
                            marginLeft={50}
                            offset={[-1, -1]}
                            scale={1.5}
                        />
                    </Layout>
                </Layout>
            </Layout>
        </>
    );

    yield* slide({
        background: background(),
        subtitle: subtitle(),
        title: title(),
        section: section(),
        view: newView(),
        image: image(),
        toCancel,
    });
}

function* titleSlideLayout(
    view: View2D,
    titleText: string,
    toCancel: ThreadGenerator[],
    slide: (params: {
        background: Rect;
        view: Layout;
        title: Txt;
        subtitle: Txt;
        toCancel: ThreadGenerator[];
    }) => ThreadGenerator,
    subtitleText?: string
): ThreadGenerator {
    const newView = createRef<Layout>();
    const background = createRef<Rect>();
    const title = createRef<Txt>();
    const subtitle = createRef<Txt>();

    yield view.add(
        <>
            <Rect fill={Nord.Colors.SnowStorm2} size={view.size()} />
            <Layout
                ref={newView}
                direction={"row"}
                alignItems={"center"}
                justifyContent={"space-around"}
                marginTop={20}
                opacity={0.8}
                size={view.size()}
            ></Layout>
            <Layout
                layout
                direction={"column"}
                size={view.size()}
                justifyContent={"space-evenly"}
            >
                <Layout
                    layout
                    direction={"column"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    offset={[-1, -1]}
                    position={view.size().div(2).mul(-1)}
                    paddingTop={20}
                    paddingLeft={50}
                >
                    <Txt
                        ref={title}
                        {...DefaultTitleProps}
                        fontSize={150}
                        text={titleText}
                        lineHeight={150 * 1.2}
                    />
                    <Txt
                        ref={subtitle}
                        {...DefaultTitleProps}
                        fontWeight={400}
                        fontSize={titleFontSize * 0.8}
                        lineHeight={titleFontSize * 1.2 * 0.8}
                        text={subtitleText}
                    />
                </Layout>
            </Layout>
        </>
    );

    yield* slide({
        background: background(),
        subtitle: subtitle(),
        title: title(),
        view: newView(),
        toCancel: toCancel,
    });
}
