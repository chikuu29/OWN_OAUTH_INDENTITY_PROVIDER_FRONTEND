import {extendTheme } from "@chakra-ui/react";
import { buttonStyles } from "./components/button";
import { badgeStyles } from "./components/badge";
import { inputStyles } from "./components/input";
import { sliderStyles } from "./components/slider";
import { linkStyles } from "./components/link";
import { breakpoints } from "./foundations/breakpoints";
import { globalStyles } from "./styles";
import { tableStyles } from "./components/table";
import { textareaTheme } from "./components/textarea";





export default extendTheme({
  breakpoints, // Add breakpoints
  colors:globalStyles.colors,
  styles: globalStyles.styles, // Global styles
  components: {
    Button: buttonStyles, // Button styles
    Badge: badgeStyles.components.Badge, // Badge styles
    Input: inputStyles.Input, // Input styles
    Textarea: textareaTheme, // Textarea styles
    Slider: sliderStyles, // Slider styles
    Link: linkStyles.components.Link, // Link styles
    Table: tableStyles.components.Table, // Table styles
    // Add more components as needed
  },
});
