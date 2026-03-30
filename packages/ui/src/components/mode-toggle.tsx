import { HugeiconsIcon } from "@hugeicons/react";
import { DarkModeIcon } from "@hugeicons/core-free-icons";

import { Button } from "@workspace/ui/components/button"

import { useTheme } from "@workspace/ui/components/theme-provider"

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      size={"icon-sm"}
      variant={"outline"}
      onClick={() => {
        setTheme(theme === "light" ? "dark" : "light");
      }}
    >
      <HugeiconsIcon icon={DarkModeIcon} strokeWidth={2} />
    </Button>
  );
}
