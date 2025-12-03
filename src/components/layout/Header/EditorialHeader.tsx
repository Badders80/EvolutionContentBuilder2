
import clsx from "clsx";
import { useAppContext } from "../../../context/AppContext";
import { headerPadding } from "../../../layout/layoutConfig";

const modeLabels: Record<string, string> = {
  "pre-race": "PRE-RACE PREVIEW",
  "post-race": "POST-RACE REPORT",
  "trainer": "TRAINER PROFILE",
  "investor": "INVESTOR UPDATE",
  "social": "SOCIAL FEATURE",
};

export function EditorialHeader() {
  const { structured: content, settings, layoutConfig } = useAppContext();
  const label = modeLabels[settings.mode] || "EDITORIAL";

  return (
    <header
      className={clsx(
        "mb-6 rounded-md bg-es-text text-es-bg",
        headerPadding(layoutConfig.headerStyle)
      )}
    >
      <div className="flex items-start justify-between gap-6">
        <div className="space-y-2">
          <p className="inline-flex items-center rounded-full bg-es-bg/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-es-bg/80">
            {label}
          </p>

          <div className="space-y-1">
            <h1 className="font-serif text-3xl md:text-4xl text-es-bg">
              {content.headline || "Your Headline Here"}
            </h1>
            {content.subheadline && (
              <p className="font-serif text-xl md:text-2xl text-es-textSoft">
                {content.subheadline}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-1 text-xs text-es-textSoft">
          {/* race meta here in future */}
        </div>
      </div>

      {layoutConfig.watermarkStyle === "subtle" && (
        <div className="pointer-events-none mt-3 text-[10px] font-semibold uppercase tracking-wide text-es-bg/20">
          Evolution Stables
        </div>
      )}
    </header>
  );
}
