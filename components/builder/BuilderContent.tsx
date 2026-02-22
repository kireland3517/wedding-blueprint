"use client";

import { Content, isPreviewing } from "@builder.io/sdk-react";

const API_KEY = process.env.NEXT_PUBLIC_BUILDER_API_KEY!;

interface Props {
  model: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any;
}

export function RenderBuilderContent({ model, content }: Props) {
  if (!content && !isPreviewing()) return null;

  return <Content model={model} content={content} apiKey={API_KEY} />;
}
