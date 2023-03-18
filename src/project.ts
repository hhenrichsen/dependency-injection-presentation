import { makeProject } from "@motion-canvas/core";

import title from "./scenes/title?scene";
import intro from "./scenes/intro?scene";
import outlets from "./scenes/outlets?scene";
import plugs from "./scenes/plugs?scene";

export default makeProject({
    scenes: [title, intro, outlets, plugs],
});
