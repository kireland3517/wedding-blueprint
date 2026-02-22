"use client";

import { register } from "@builder.io/sdk-react";
import dynamic from "next/dynamic";
import { useEffect } from "react";

const QuizEmbed = dynamic(() => import("../builder-embeds/QuizEmbed"), {
  ssr: false,
  loading: () => (
    <div style={{ padding: "4rem", textAlign: "center", fontFamily: "Georgia, serif" }}>
      Loading quiz…
    </div>
  ),
});

const BlueprintEmbed = dynamic(() => import("../builder-embeds/BlueprintEmbed"), {
  ssr: false,
  loading: () => (
    <div style={{ padding: "4rem", textAlign: "center", fontFamily: "Georgia, serif" }}>
      Loading blueprint…
    </div>
  ),
});

export default function BuilderRegistry() {
  useEffect(() => {
    register("component", {
      name: "Wedding Quiz",
      component: QuizEmbed,
      inputs: [
        {
          name: "showIntro",
          type: "boolean",
          defaultValue: false,
          helperText: "Show an intro heading above the quiz steps",
        },
      ],
    });

    register("component", {
      name: "Wedding Blueprint",
      component: BlueprintEmbed,
      inputs: [],
    });
  }, []);

  return null;
}
