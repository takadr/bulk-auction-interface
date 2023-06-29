import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  initialColorMode: "dark",
  styles: {
    global: (props: any) => ({
      body: {
        // bg: mode("gray.700", "gray.900")(props),
      },
    }),
  },
  components: {},
});

export default theme;
